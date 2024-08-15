import * as React from 'react';
import styles from './MeirFaq.module.scss';
import { IMeirFaqProps } from './IMeirFaqProps';
import { Utils } from '../../../Services/Utils';

export interface IFAQState { 
  allItems: any[];
  currItems: any[];
}

const faqItems = [
  { Title: "שאלה מקסימה ומאתגרת", Answer: "תשובה נהדרת", ID: 1, number_of_entries: 0, Created: "2024-10-14T00:00:00" },
  { Title: "שאלה שניה", Answer: "תשובה שניה", ID: 2, number_of_entries: 2, Created: "2024-10-13T00:00:00" },
  { Title: "שאלה ממש ממש ארוכה כדי לבדוק מה קורה כשיש שאלה ממש ארוכה שלא תיחתך באמצע שאלה ממש ממש ארוכה כדי לבדוק מה קורה כשיש שאלה ממש ארוכה שלא תיחתך באמצע", 
    Answer: "תשובה עוד יותר ארוכה שגם היא לא תיחתך באמצע במקרה שיש תשובה ממש ממש ארוכה תשובה עוד יותר ארוכה שגם היא לא תיחתך באמצע במקרה שיש תשובה ממש ממש ארוכה תשובה עוד יותר ארוכה שגם היא לא תיחתך באמצע במקרה שיש תשובה ממש ממש ארוכה תשובה עוד יותר ארוכה שגם היא לא תיחתך באמצע במקרה שיש תשובה ממש ממש ארוכה תשובה עוד יותר ארוכה שגם היא לא תיחתך באמצע במקרה שיש תשובה ממש ממש ארוכה תשובה עוד יותר ארוכה שגם היא לא תיחתך באמצע במקרה שיש תשובה ממש ממש ארוכה תשובה עוד יותר ארוכה שגם היא לא תיחתך באמצע במקרה שיש תשובה ממש ממש ארוכה תשובה עוד יותר ארוכה שגם היא לא תיחתך באמצע במקרה שיש תשובה ממש ממש ארוכה תשובה עוד יותר ארוכה שגם היא לא תיחתך באמצע במקרה שיש תשובה ממש ממש ארוכה תשובה עוד יותר ארוכה שגם היא לא תיחתך באמצע במקרה שיש תשובה ממש ממש ארוכה תשובה עוד יותר ארוכה שגם היא לא תיחתך באמצע במקרה שיש תשובה ממש ממש ארוכה תשובה עוד יותר ארוכה שגם היא לא תיחתך באמצע במקרה שיש תשובה ממש ממש ארוכה תשובה עוד יותר ארוכה שגם היא לא תיחתך באמצע במקרה שיש תשובה ממש ממש ארוכה תשובה עוד יותר ארוכה שגם היא לא תיחתך באמצע במקרה שיש תשובה ממש ממש ארוכה תשובה עוד יותר ארוכה שגם היא לא תיחתך באמצע במקרה שיש תשובה ממש ממש ארוכה תשובה עוד יותר ארוכה שגם היא לא תיחתך באמצע במקרה שיש תשובה ממש ממש ארוכה תשובה עוד יותר ארוכה שגם היא לא תיחתך באמצע במקרה שיש תשובה ממש ממש ארוכה תשובה עוד יותר ארוכה שגם היא לא תיחתך באמצע במקרה שיש תשובה ממש ממש ארוכה תשובה עוד יותר ארוכה שגם היא לא תיחתך באמצע במקרה שיש תשובה ממש ממש ארוכה ", ID: 3, number_of_entries: 1, Created: "2024-10-12T00:00:00" },
  { Title: "3שאלה", Answer: "תשובה", ID: 4, number_of_entries: 3, Created: "2024-10-11T00:00:00" },
  { Title: "4שאלה", Answer: "תשובה", ID: 5, number_of_entries: 4, Created: "2024-10-10T00:00:00" },
  { Title: "3שאלה", Answer: "תשובה", ID: 6, number_of_entries: 3, Created: "2024-10-09T00:00:00" },
  { Title: "שאלה בפופולריות 5", Answer: "תשובה", ID: 7, number_of_entries: 5, Created: "2024-10-08T00:00:00" },
  { Title: "שאלה", Answer: "תשובה", ID: 8, number_of_entries: 3, Created: "2024-10-07T00:00:00" },
  { Title: " שאלה פופלרית מאוד", Answer: "תשובה", ID: 9, number_of_entries: 22, Created: "2024-10-06T00:00:00" },
];

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

  private GetFAQ() {
    // Initially set allItems and the currItems to the newest 5 items
    this.setState({ 
      allItems: faqItems,
      currItems: this.getNewestItems(faqItems, 4)
    });
  }

  private getNewestItems(items: any[], count: number) {
    return items
      .sort((a, b) => new Date(b.Created).getTime() - new Date(a.Created).getTime())
      .slice(0, count);
  }

  private getMostPopularItems(items: any[], count: number) {
    return items
      .sort((a, b) => b.number_of_entries - a.number_of_entries)
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

  private showAnswer = (item: any) => {
    console.log(`ID: ${item.ID}, Title: ${item.Title}, Number of Entries: ${item.number_of_entries}`);

    const answerElement = document.getElementById(`p${item.ID}`);
    if (answerElement) {
      answerElement.style.display = answerElement.style.display === 'none' ? 'block' : 'none';
    }

    // Increment the number_of_entries
    item.number_of_entries++;
    this.setState((prevState) => ({
      allItems: prevState.allItems.map((currItem) =>
        currItem.ID === item.ID ? { ...currItem, number_of_entries: item.number_of_entries } : currItem
      ),
    }));
  };

  public render(): React.ReactElement<IMeirFaqProps> {
    return (
        <section className={styles.meirFaq}>
            <div className={styles.bottomSection}>
                <div className={styles.qa}>
                    <div className={styles.titleArea}>
                        <div className={styles.theTitle}>שאלות ותשובות</div>
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
