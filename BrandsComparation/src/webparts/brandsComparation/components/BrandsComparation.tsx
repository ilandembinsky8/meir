import * as React from 'react';
import styles from './BrandsComparation.module.scss';
import { IBrandsComparationProps } from './IBrandsComparationProps';
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

sp.setup({
  sp: {
    baseUrl: "https://meir365.sharepoint.com/sites/KBMCT2"
  }
});

export interface IState { 
  models: any[];  // Store all model data as an array of objects
  selectedModels: any[]; // Store selected models data here
}

export default class BrandsComparation extends React.Component<IBrandsComparationProps, IState> {

  private items = 0;
  private a_items: number[] = [];
  
  private MAX_MODELS = 4;

  constructor(props: IBrandsComparationProps) {
    super(props);

    this.state = { models: [], selectedModels: [] };  
    this.GetModels();
  }

  private async GetModels() {
    try {
      const models = await this.GetItems(
        "דגמים",
        "ID,Title,ModelCode,ConsumerPrice,SafetyLevel,ManufacturingCountry/Title,Brand/Title,Segment/Title,EngineType/Title,DrivingRange,AvrgFuelUsage,Power", 
        "ManufacturingCountry,Brand,Segment,EngineType",
        "Title",
        false, 
        null,  
        500
      );
      
      this.setState({ models });
      
      const brandCodesArray = this.getBrandCodes();
      
      // Filter the models that match the IDs from brandCodesArray
      const selectedModels = models.filter(model => brandCodesArray.includes(model.ID));
  
      // Update the state with the selected models
      this.setState({ selectedModels }, () => {
        // Check the checkboxes for the selected models
        selectedModels.forEach(model => {
          const checkbox = document.getElementById(`d${model.ID}`) as HTMLInputElement;
          if (checkbox) {
            checkbox.checked = true;
          }
        });
      });
  
      console.log(brandCodesArray); 
      debugger;
    } catch (error) {
      console.error('Error fetching items', error);
    }   
  }
  

  private async GetItems(
    listName: string,
    columns: string,
    expand: string | null,
    orderCol: string | null, 
    orderType: boolean | null, 
    filters: string | null, 
    top: number
  ): Promise<any[]> {
    try {
      let query = sp.web.lists.getByTitle(listName).items.select(columns).top(top);
  
      if (expand) {
        query = query.expand(expand);
      }

      if (orderCol && orderType !== null) {
        query = query.orderBy(orderCol, orderType);
      }
  
      if (filters) {
        query = query.filter(filters);
      }
  
      const items = await query.get();
      return items;
    } catch (e) {
      console.error('Error - get query', e);
      throw e; 
    }
  }

  private getBrandCodes(): number[] {
    const urlParams = new URLSearchParams(window.location.search);
    const brandsCode = urlParams.get('BrandsCode');
    
    if (brandsCode) {
      return brandsCode.split('-').map(code => parseInt(code, 10));
    } else {
      return [];
    }
  } 
  
  private addRemoveFromCompare(modelId: number) {
    const isChecked = (document.getElementById(`d${modelId}`) as HTMLInputElement).checked;
    const selectedModel = this.state.models.find(model => model.ID === modelId);

    if (isChecked) {
      if (this.items < this.MAX_MODELS) {
        this.a_items[this.items] = modelId;
        this.items++;
        this.setState(prevState => ({
          selectedModels: [...prevState.selectedModels, selectedModel]
        }));
      } else {
        (document.getElementById(`d${modelId}`) as HTMLInputElement).checked = false;
      }
    } else {
      this.setState(prevState => ({
        selectedModels: prevState.selectedModels.filter(model => model.ID !== modelId)
      }));
      this.a_items = this.a_items.filter(id => id !== modelId);
      this.items--;
    }
  }

  private async saveComparation() {
    if (this.state.selectedModels.length < 2) {
      alert('יש לבחור לפחות 2 דגמים להשוואה');
      return;
    }
  
    const title = this.state.selectedModels.map(model => model.Title).join('-');
    const code = this.state.selectedModels.map(model => model.ID).join('-');
  
    // Prompt the user to enter a title
    const userTitle = prompt('Please enter a title for the comparison:', title);
  
    // If the user didn't enter a title, show an alert and return
    if (userTitle === null || userTitle.trim() === '') {
      alert('Title cannot be empty.');
      return;
    }
  
    try {
      await sp.web.lists.getByTitle('השוואה בין דגמים').items.add({
        Title: userTitle,
        Code: code
      });
  
      alert('השוואה נשמרה בהצלחה');
    } catch (error) {
      console.error('Error saving comparation', error);
      alert('Failed to save comparation.');
    }
  }
  

  private EditComparations(){
    var url = "/sites/KBMCT2/Lists/ModelsComparison/view.aspx";
    window.open(url, '_blank');
  }

  private getDisplayValue(value: any): string {
    return value ? value : "לא הוזן";
  }

public render(): React.ReactElement<IBrandsComparationProps> {
  return (
    <section className={styles.brandsComparation}>
      <section className={styles.updateArea}>
        <div className={styles.innerCompare}>
          {this.state.models.map(model => (
            <div key={model.ID} className={styles.oneCheckbox}>
              <input 
                id={`d${model.ID}`} 
                type="checkbox" 
                checked={this.state.selectedModels.some(selected => selected.ID === model.ID)}
                onChange={() => this.addRemoveFromCompare(model.ID)} 
              />
              &nbsp;<span id={`t${model.ID}`}>{this.getDisplayValue(model.Title)}</span>
            </div>
          ))}
        </div>
        <div className={styles.innerCompare}>
          {[...Array(this.MAX_MODELS)].map((_, index) => {
            const num = index + 1;
            const model = this.state.selectedModels[num - 1];
            return (
              <div key={`item${num}`} id={`item${num}`} className={styles.oneItem} style={{ display: model ? 'inline' : 'none' }}>
                {model && (
                  <>
                    <div id={`i${num}1`} className={styles.theTitle}>{this.getDisplayValue(model.Title)}</div>
                    <div className={styles.modelDetails}>
                      <div><strong>קוד מודל:</strong> {this.getDisplayValue(model.ModelCode)}</div>
                      <div><strong>מחיר לצרכן:</strong> {this.getDisplayValue(model.ConsumerPrice)}</div>
                      <div><strong>מותג:</strong> {this.getDisplayValue(model.Brand?.Title)}</div>
                      <div><strong>סגמנט:</strong> {this.getDisplayValue(model.Segment?.Title)}</div>
                      <div><strong>סוג מנוע:</strong> {this.getDisplayValue(model.EngineType?.Title)}</div>
                      <div><strong>הספק:</strong> {this.getDisplayValue(model.Power)}</div>
                      <div><strong>צריכת דלק ממוצעת:</strong> {this.getDisplayValue(model.AvrgFuelUsage)}</div>
                      <div><strong>טווח נסיעה:</strong> {this.getDisplayValue(model.DrivingRange)}</div>
                      <div><strong>רמת אבזור בטיחותי:</strong> {this.getDisplayValue(model.SafetyLevel)}</div>
                      <div><strong>מדינת ייצור:</strong> {this.getDisplayValue(model.ManufacturingCountry?.Title)}</div>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
        {this.state.selectedModels.length >= 2 && (
          <button className={styles.saveButton} onClick={() => this.saveComparation()}>
            שמירת השוואה
          </button>
        )}
         <button className={styles.saveButton} onClick={() => this.EditComparations()}>
            עריכת השוואות שלי
          </button>
      </section>
    </section>
  );
}

}
