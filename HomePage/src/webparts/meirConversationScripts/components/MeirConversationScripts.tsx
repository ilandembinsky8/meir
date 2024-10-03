import * as React from 'react';
import styles from './MeirConversationScripts.module.scss';
import { IMeirConversationScriptsProps } from './IMeirConversationScriptsProps';
import { Utils } from '../../../Services/Utils';

const siteURL = "KBMCT2"; //KBMCT1

// Define the interface for brand items
interface IBrandItem {
  Title: string;
  ID: number;
}

export interface IScriptsState {
  allItems: IBrandItem[]; // Use the interface here
  selectedOption: string;
  selectedItem: IBrandItem | null; // Update the type to IBrandItem or null
  attachmentUrls: string[]; // New state to hold attachment URLs
}

export default class MeirConversationScripts extends React.Component<IMeirConversationScriptsProps, IScriptsState> {

  private _utils: Utils;
  
  constructor(props: IMeirConversationScriptsProps) {
    super(props);
    this._utils = new Utils();
 
    this.state = {
      allItems: [],
      selectedOption: '', 
      selectedItem: null, // Initialize with null
      attachmentUrls: [] // Initialize with an empty array
    };

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

  private async fetchAttachments(itemId: number): Promise<string[]> {
    const endpoint = `/sites/${siteURL}/_api/web/lists/getbytitle('מותגים')/items(${itemId})/AttachmentFiles`;

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
      console.error('Error fetching attachments', error);
      return [];
    }
  }

  private async handleSelectChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const selectedOption = event.target.value;
    const selectedItem = this.state.allItems.find((item: IBrandItem) => item.Title === selectedOption);
    
    if (selectedItem) {
      const attachmentUrls = await this.fetchAttachments(selectedItem.ID);
      this.setState({ 
        selectedOption,
        selectedItem: selectedItem, // Update the selected item
        attachmentUrls // Update the state with the fetched attachment URLs
      });
    } else {
      this.setState({ 
        selectedOption,
        selectedItem: null,
        attachmentUrls: [] // Clear the attachment URLs if no item is selected
      });
    }
  }

  private handleTextClick() {
    const { attachmentUrls } = this.state;
    
    if (attachmentUrls.length > 0) {
      // Open the first attachment or implement additional logic to select an attachment
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
                    onClick={this.handleTextClick} // Add onClick handler
                  >
                    {/* Display the selected option or a placeholder text */}
                    {this.state.selectedOption ? `תסריט שיחה עבור מותג: ${this.state.selectedOption}` : 'תסריטי שיחה עם נציגי מכירות'}
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
