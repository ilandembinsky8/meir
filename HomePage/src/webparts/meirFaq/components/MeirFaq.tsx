import * as React from 'react';
import styles from './MeirFaq.module.scss';
import { IMeirFaqProps } from './IMeirFaqProps';
import { Utils } from '../../../Services/Utils';

export interface IFAQState { 
  allItems: any[];
  currItems: any[];
}

const siteURL = "KBMCT2"; 

export default class MeirFaq extends React.Component<IMeirFaqProps, IFAQState> {

  private _utils: Utils;

  constructor(props: IMeirFaqProps) {
    super(props);
    this._utils = new Utils();
    
    console.log(this._utils.formatDate("aa"));

    this.state = {
      allItems: [],
      currItems: [],
    };

    this.GetFAQ = this.GetFAQ.bind(this);
    this.handleFilterChange = this.handleFilterChange.bind(this);
  }

  componentDidMount() {
    this.GetFAQ();
  }

  private async GetFAQ() {

    try {
      const items: any[] = await this._utils.GetItems(
        "שאלות ותשובות",
        "Title,ID,Answer,EntriesNumber,Created",
        null,
        "Title",
        true, 
        null, 
        500
      );
    
    
      console.log("FAQ Items: ", items);
      this.setState({ 
        allItems: items,
        currItems: this.getNewestItems(items, 4)
      });
    
    } catch (error) {
      console.error('Error fetching items', error);
    }    
  }

  private getNewestItems(items: any[], count: number) {
    return items
      .sort((a, b) => new Date(b.Created).getTime() - new Date(a.Created).getTime())
      .slice(0, count);
  }

  private getMostPopularItems(items: any[], count: number) {
    return items
      .sort((a, b) => b.EntriesNumber - a.EntriesNumber)
      .slice(0, count);
  }

  private handleFilterChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const filterValue = event.target.value;
    let sortedItems;

    if (filterValue === 'New') {
      sortedItems = this.getNewestItems(this.state.allItems, 4);
    } else if (filterValue === 'Popular') {
      sortedItems = this.getMostPopularItems(this.state.allItems, 4);
    }

    this.setState({ currItems: sortedItems });
  }

  private updateFAQItem = async (item: any) => {
    try {
      await this._utils.UpdateItem(
        "שאלות ותשובות", // List name
        item.ID, // ID of the item to update
        { EntriesNumber: item.EntriesNumber } // Fields to update
      );
      console.log(`Item with ID ${item.ID} updated successfully.`);
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };
  
  private showAnswer = (item: any) => {
    console.log(`ID: ${item.ID}, Title: ${item.Title}, Number of Entries: ${item.EntriesNumber}`);
  
    const answerElement = document.getElementById(`p${item.ID}`);
    if (answerElement) {
      answerElement.style.display = answerElement.style.display === 'none' ? 'block' : 'none';
    }
  
    // Increment the number_of_entries
    item.EntriesNumber++;
    this.setState((prevState) => ({
      allItems: prevState.allItems.map((currItem) =>
        currItem.ID === item.ID ? { ...currItem, EntriesNumber: item.EntriesNumber } : currItem
      ),
    }));
  
    // Update the item in SharePoint
    this.updateFAQItem(item);
  };
  

  public render(): React.ReactElement<IMeirFaqProps> {
    return (
        <section className={styles.meirFaq}>
            <div className={styles.bottomSection}>
                <div className={styles.qa}>
                <div className={styles.link} 
                          onClick={()=> this._utils.OpenTab(`/sites/${siteURL}/SitePages/FAQ.aspx`)} >לכל השאלות</div>

                    <div className={styles.titleArea}>

                        <div className={styles.theTitle} >שאלות ותשובות</div>

                        <div className={styles.theFilter}>
                         
                            <select onChange={this.handleFilterChange}>
                                <option value="New">הכי חדשות</option>
                                <option value="Popular">הכי פופולאריות</option>
                            </select>
                        </div>
                    </div>

                    {this.state.currItems.length > 0 ? (
                        this.state.currItems.map((item: any) => (
                            <div key={item.ID}>
                                <div
                                    id={`q${item.ID}`}
                                    className={styles.oneQuestion}
                                    data-full-text={item.Title}
                                    onClick={() => this.showAnswer(item)}
                                >
                                    {item.Title}
                                </div>
                                <div id={`p${item.ID}`} className={styles.oneAnswer} style={{ display: 'none' }}>
                                    {item.Answer}
                                </div>              
                            </div>
                        ))
                    ) : (
                        <div>לא נמצאו שאלות</div>
                    )}
                </div>
                <div className={styles.sampleImage}></div>
            </div>
        </section>
    );
}


}
