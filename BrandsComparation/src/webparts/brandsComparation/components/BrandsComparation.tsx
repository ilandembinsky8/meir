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
        "ID,Title,ModelCode,ConsumerPrice,ManufacturingCountry/Title", 
        "ManufacturingCountry",
        "Title",
        false, 
        null,  
        500
      );
      
      // Update the state with the retrieved models
      this.setState({ models });

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

    try {
      await sp.web.lists.getByTitle('השוואה בין דגמים').items.add({
        Title: title,
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
                &nbsp;<span id={`t${model.ID}`}>{model.Title}</span>
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
                      <div id={`i${num}1`} className={styles.theTitle}>{model.Title}</div>
                      <div className={styles.modelDetails}>
                        <div><strong>קוד מודל:</strong> {model.ModelCode}</div>
                        <div><strong>מחיר לצרכן:</strong> {model.ConsumerPrice}</div>
                        <div><strong>מותג:</strong> {model.ConsumerPrice}</div>
                        <div><strong>סגמנט:</strong> {model.ConsumerPrice}</div>
                        <div><strong>סוג מנוע:</strong> {model.ConsumerPrice}</div>
                        <div><strong>הספק:</strong> {model.ConsumerPrice}</div>
                        <div><strong>צריכת דלק ממוצעת:</strong> {model.ConsumerPrice}</div>
                        <div><strong>טווח נסיעה:</strong> {model.ConsumerPrice}</div>
                        <div><strong>רמת אבזור בטיחותי:</strong> {model.ConsumerPrice}</div>
                        <div><strong>מדינת ייצור:</strong> {model.ManufacturingCountry.Title}</div>
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
