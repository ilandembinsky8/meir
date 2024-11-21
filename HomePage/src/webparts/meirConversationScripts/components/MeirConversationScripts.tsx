import * as React from 'react';
import styles from './MeirConversationScripts.module.scss';
import { IMeirConversationScriptsProps } from './IMeirConversationScriptsProps';
import { Utils } from '../../../Services/Utils';

const siteURL = "KBMCT2";

interface IBrandItem {
  Title: string;
  ID: number;
}

export interface IScriptsState {
  allItems: IBrandItem[];
  modelItems: IBrandItem[];
  selectedOption: string;
  selectedItem: IBrandItem | null;
  attachmentUrls: string[];
}

export default class MeirConversationScripts extends React.Component<IMeirConversationScriptsProps, IScriptsState> {

  private _utils: Utils;

  constructor(props: IMeirConversationScriptsProps) {

    super(props);
    this._utils = new Utils();

    this.state = {
      allItems: [],
      modelItems: [],
      selectedOption: '',
      selectedItem: null,
      attachmentUrls: []
    };

    this.GetBrands = this.GetBrands.bind(this);
    this.GetModels = this.GetModels.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.handleSelectChangeModels = this.handleSelectChangeModels.bind(this);
    this.handleTextClick = this.handleTextClick.bind(this);
  }

  componentDidMount() {
    this.GetBrands();
    this.GetModels();
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

  private async GetModels() {
    try {
      const items: IBrandItem[] = await this._utils.GetItems(
        "דגמים",
        "Title,ID",
        null,
        "Title",
        true,
        null,
        100
      );
  
      // Fetch attachments concurrently for all items
      const attachmentResults = await Promise.all(
        items.map(item => this.fetchAttachments(item.ID, "דגמים"))
      );
  
      // Filter items based on whether they have attachments
      const modelsWithAttachments = items.filter((item, index) => attachmentResults[index].length > 0);
  
      console.log("Filtered model items with attachments: ", modelsWithAttachments);
      this.setState({ modelItems: modelsWithAttachments });
    } catch (error) {
      console.error('Error fetching items', error);
    }
  }
  
  private async fetchAttachments(itemId: number, listName: string): Promise<string[]> {
 
    const endpoint = `/sites/${siteURL}/_api/web/lists/getbytitle('${listName}')/items(${itemId})/AttachmentFiles`;

    try {
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Accept': 'application/json;odata=verbose',
        },
      });
      const data = await response.json();
      return data.d.results.map((attachment: { ServerRelativeUrl: string }) => attachment.ServerRelativeUrl);
    } catch (error) {
      console.error(`Error fetching attachments from list "${listName}"`, error);
      return [];
    }
  }

  private async handleChangeForItem(list: string, selectedItem: any, selectedOption: any) {
    if (selectedItem) {
      
      debugger;
      const attachmentUrls = await this.fetchAttachments(selectedItem.ID, list);
  
      const pdfAttachments = attachmentUrls.filter(url => url.toLowerCase().endsWith('.pdf'));
  
      this.setState({
        selectedOption,
        selectedItem: selectedItem,
        attachmentUrls: pdfAttachments, 
      });
  
      if (pdfAttachments.length > 0) {
        window.open(pdfAttachments[0], '_blank');
      } else {
        console.error('No PDF attachments found for the selected item');
      }
    } else {
      this.setState({
        selectedOption,
        selectedItem: null,
        attachmentUrls: [],
      });
    }
  }
  
  private async handleSelectChange(event: React.ChangeEvent<HTMLSelectElement>) {  
 
    const selectedOption = event.target.value;
    const selectedItem = this.state.allItems.find((item: IBrandItem) => item.Title === selectedOption);

    this.handleChangeForItem("מותגים", selectedItem, selectedOption);
  }

  private async handleSelectChangeModels(event: React.ChangeEvent<HTMLSelectElement>) {  
    debugger;
    const selectedOption = event.target.value;
    const selectedItem = this.state.modelItems.find((item: IBrandItem) => item.Title === selectedOption);
    this.handleChangeForItem("דגמים",  selectedItem, selectedOption);
  }


  private handleTextClick() {
    const { attachmentUrls } = this.state;

    if (attachmentUrls.length > 0) {
      window.open(attachmentUrls[0], '_blank');
    } else {
      console.error('No attachments found for the selected brand');
    }
  }

  public render(): React.ReactElement<IMeirConversationScriptsProps> {

    return (
      <section className={styles.meirConversationScripts}>
        <div className={styles.updateArea}>
          <div className={styles.links}>
            <div className={styles.linksList}>

              <div className={styles.oneItem}>
                <div className={styles.imageArea}>
                  <div
                    className={styles.theImage}
                    style={{ backgroundImage: `url('/sites/${siteURL}/SiteAssets/cut/chat.svg')` }}
                  ></div>
                </div>
                <div className={styles.data}>
                  <div className={styles.title}>תסריטי שיחה</div>
                  <div
                    className={this.state.selectedOption ? styles.textLink : styles.text}
                    onClick={this.handleTextClick}
                  >
                    {this.state.selectedOption ? `תסריט שיחה עבור : ${this.state.selectedOption}` : 'תסריטי שיחה עם נציגי מכירות'}
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

                  <select
                    className={styles.selectBox}
                    onChange={this.handleSelectChangeModels}
                    value={this.state.selectedOption}
                  >
                    <option value="" disabled>
                      בחר/י דגם
                    </option>
                    {this.state.modelItems.map((option) => (
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
