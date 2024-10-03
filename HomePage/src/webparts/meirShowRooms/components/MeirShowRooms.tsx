import * as React from 'react';
import styles from './MeirShowRooms.module.scss';
import { IMeirShowRoomsProps } from './IMeirShowRoomsProps';
import { Utils } from '../../../Services/Utils';

const siteURL = "KBMCT2" 

interface IBrandItem {
  Title: string;
  ID: number;
}

export interface IBrandsState {
  allItems: any[];
  selectedOption: string;
  selectedItem: IBrandItem | null;
}

export default class MeirShowRooms extends React.Component<IMeirShowRoomsProps, IBrandsState> {

  private _utils: Utils;

  constructor(props: IMeirShowRoomsProps) {
    super(props);
    this._utils = new Utils();
    this.state = { allItems: [],  selectedOption: '', 
      selectedItem: null};
    
    this.GetBrands = this.GetBrands.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.handleTextClick = this.handleTextClick.bind(this);
  }

  componentDidMount() {
    this.GetBrands();
  }

  private async GetBrands() {
    try {
      const items: IBrandItem[] = await this._utils.GetItems(
        "מותגים",
        "Title,ID",
        null,
        "Title",
        true, 
        null, 
        100
      );
        
      console.log("Brands Items: ", items);
      this.setState({ allItems: items });
    } catch (error) {
      console.error('Error fetching items', error);
    }
  }

  private async handleSelectChange(event: React.ChangeEvent<HTMLSelectElement>) {

    const selectedOption = event.target.value;
    const selectedItem = this.state.allItems.find((item: IBrandItem) => item.Title === selectedOption);
    
    if (selectedItem) {
      this.setState({ 
        selectedOption,
        selectedItem: selectedItem
      });
    } else {
      this.setState({ 
        selectedOption,
        selectedItem: null
      });
    }
  }

  private handleTextClick() {
    
    this._utils.OpenTab(
      `/sites/${siteURL}/SitePages/Showrooms.aspx?Brand=${this.state.selectedItem.Title}&BrandID=${this.state.selectedItem.ID}`
    )
  }

  public render(): React.ReactElement<IMeirShowRoomsProps> {

    return (
      <section className={styles.meirShowRooms}>


<div className={styles.updateArea}>
          <div className={styles.links}>
            <div className={styles.linksList}>

              <div className={styles.oneItem}>
                <div className={styles.imageArea}>
                  <div
                    className={styles.theImage}
                    style={{ backgroundImage: `url('/sites/${siteURL}/SiteAssets/cut/handshake.svg')` }}
                  ></div>
                </div>
                <div className={styles.data}>
                  <div className={styles.title}>אולמות תצוגה</div>
                  <div 
                    className={this.state.selectedOption ? styles.textLink : styles.text}
                    onClick={this.handleTextClick} 
                  >
                    {this.state.selectedOption ? `כניסה לאולם תצוגה - מותג: ${this.state.selectedOption}` : 'אולמות תצוגה לפי מותגים'}
                  </div>
                  <select
                    className={styles.selectBox}
                    onChange={this.handleSelectChange}
                    value={this.state.selectedOption}
                  >
                    <option value="" disabled>
                      בחר/י מותג
                    </option>
                    {this.state.allItems.map((option) => (
                      <option key={option.ID} value={option.Title}>
                        {option.Title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>
    );
  }
}
