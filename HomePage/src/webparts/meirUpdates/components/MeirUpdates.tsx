import * as React from 'react';
import styles from './MeirUpdates.module.scss';
import { IMeirUpdatesProps } from './IMeirUpdatesProps';
import { Utils } from '../../../Services/Utils';

const siteURL = "KBMCT2";

interface IUpdateItem {
  ID: number;
  UpdateType: any;
  UpdateDate: string;
  Title: string;
  Detail1: string;
  Picture1: any;
}

interface IMeirUpdatesState {
  allItems: IUpdateItem[];
  selectedUpdate: IUpdateItem | null;
  isPopupVisible: boolean;
}

export default class MeirUpdates extends React.Component<IMeirUpdatesProps, IMeirUpdatesState> {
  private _utils: Utils;

  constructor(props: IMeirUpdatesProps) {
    super(props);
    this._utils = new Utils();
    this.state = {
      allItems: [],
      selectedUpdate: null,
      isPopupVisible: false,
    };
  }

  private GetItems = async () => {
    try {
      const items: IUpdateItem[] = await this._utils.GetItems(
        "עדכונים",
        "Title,ID,UpdateType/Title,UpdateDate,Detail1,Picture1",
        "UpdateType",
        "Created",
        false, 
        null, 
        5
      );

      // Parse the Picture1 JSON string into an object
      const parsedItems = items.map(item => ({
        ...item,
        Picture1: item.Picture1 ? JSON.parse(item.Picture1) : null
      }));

      console.log("Parsed Updates Items: ", parsedItems);
      this.setState({ 
        allItems: parsedItems, 
        selectedUpdate: parsedItems[0] // Select the first update on load
      });
    } catch (error) {
      console.error('Error fetching items', error);
    }
  }

  public componentDidMount() {
    this.GetItems();
  }

  handleUpdateClick = (update: IUpdateItem) => {
    if (this.state.selectedUpdate?.ID === update.ID) {
      this.setState({ isPopupVisible: !this.state.isPopupVisible });
    } else {
      this.setState({ selectedUpdate: update, isPopupVisible: false });
    }
  };

  handlePopupClose = () => {
    this.setState({ isPopupVisible: false });
  };

  render(): React.ReactElement<IMeirUpdatesProps> {
    const { allItems, selectedUpdate, isPopupVisible } = this.state;

    return (
      <section className={styles.meirUpdates}>
        <div className={styles.updateArea}>
          <div className={styles.updates}>
            <div className={styles.headLine}>
              <div className={styles.title}>עדכונים</div>
              <div className={styles.link}>עדכונים שקרו בחודש האחרון</div>
            </div>
            <div className={styles.upList}>
              <div className={styles.right}>
                {allItems.map((update) => (
                  <div
                    key={update.ID}
                    className={`${styles.oneUpdate} ${selectedUpdate?.ID === update.ID ? styles.oneUpdateSelected : ''}`}
                    onClick={() => this.handleUpdateClick(update)}
                  >
                    <div className={styles.icon}>
                      <img src={`/sites/${siteURL}/SiteAssets/cut/favorite.svg`} alt={`Icon for ${update.UpdateType?.Title || 'Update'}`} />
                    </div>
                    <div className={styles.data}>
                      <div className={styles.r100}>
                        <div className={styles.title}>{update.UpdateType?.Title || 'Update Type'}</div>
                        <div className={styles.date}>{this._utils.formatDate(update.UpdateDate)}</div>
                      </div>
                      <div className={styles.text}>
                        {update.Title}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className={styles.oneUpdateDetails}>
                {selectedUpdate && (
                  <>
                    {selectedUpdate.Picture1 && selectedUpdate.Picture1.serverRelativeUrl && (
                      <div className={styles.r100} onClick={() => this.setState({ isPopupVisible: true })}>
                        <img src={selectedUpdate.Picture1.serverRelativeUrl} alt={`image for ${selectedUpdate.Title}`} />
                      </div>
                    )}
                    <div className={styles.text} onClick={() => this.setState({ isPopupVisible: true })} dangerouslySetInnerHTML={{ __html: selectedUpdate.Detail1 }}>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {isPopupVisible && selectedUpdate && (
          <div className={styles.popup}>
            <div className={styles.popupContent}>
              <h2>{selectedUpdate.Title}</h2>
              {selectedUpdate.Picture1 && selectedUpdate.Picture1.serverRelativeUrl && (
                <img src={selectedUpdate.Picture1.serverRelativeUrl} alt={`Popup image for ${selectedUpdate.Title}`} />
              )}
              <div className={styles.popupText} dangerouslySetInnerHTML={{ __html: selectedUpdate.Detail1 }}>
              </div>
              <button className={styles.closeButton} onClick={this.handlePopupClose}>קראתי, הבנתי</button>
            </div>
          </div>
        )}
      </section>
    );
  }
}
