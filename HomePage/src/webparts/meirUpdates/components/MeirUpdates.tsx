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
  isFavorite: boolean;
  Brand: any;
  Model: any;
  Attachments?: string[]; // New field for attachments
  showFirst: boolean;
  isSigned: boolean
}


interface IMeirUpdatesState {
  allItems: IUpdateItem[];
  currentItems: IUpdateItem[];
  reserveItems: IUpdateItem[];
  selectedUpdate: IUpdateItem | null;
  isPopupVisible: boolean;
}

export default class MeirUpdates extends React.Component<IMeirUpdatesProps, IMeirUpdatesState> {
  private _utils: Utils;
  private currentUserId: number; // To store the current user ID

  constructor(props: IMeirUpdatesProps) {
    super(props);
    this._utils = new Utils();
    this.state = {
      allItems: [],
      currentItems: [],
      reserveItems: [],
      selectedUpdate: null,
      isPopupVisible: false,
    };
  }

  private GetCurrentUser = async (): Promise<void> => {
    try {
      const response = await fetch(`/sites/${siteURL}/_api/web/currentUser`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json;odata=verbose',
        },
      });
      const data = await response.json();
      this.currentUserId = data.d.Id; // Store the user ID
      console.log("Current User ID: ", this.currentUserId);
    } catch (error) {
      console.error('Error fetching current user:', error);
    }
  };

  private GetFavorites = async (): Promise<number[]> => {
    try {
      const favoriteItems = await this._utils.GetItems(
        "מועדפים",
        "UpdateID",
        null,
        null,
        false,
        `AuthorId eq ${this.currentUserId}`,
        4999
      );

      // Extract the UpdateIDs of the favorites
      return favoriteItems.map(item => item.UpdateID);
    } catch (error) {
      console.error('Error fetching favorite items:', error);
      return [];
    }
  };

  
  private GetSignedItems = async (): Promise<number[]> => {
    try {
      const signedItems = await this._utils.GetItems(
        "חתימה על עדכונים", 
        "UpdateID", 
        null, 
        null, 
        false, 
        `AuthorId eq ${this.currentUserId}`, 
        4999
      );
      return signedItems.map(item => item.UpdateID);
    } catch (error) {
      console.error('Error fetching signed items:', error);
      return [];
    }
  };


  private async GetAttachments(itemId: number): Promise<string[]> {
    try {
      const response = await fetch(
        `/sites/${siteURL}/_api/web/lists/getbytitle('עדכונים')/items(${itemId})/AttachmentFiles`,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json;odata=verbose',
          },
        }
      );
      const data = await response.json();
  
      return data.d.results
        .map((attachment: any) => attachment.ServerRelativeUrl)
        .filter((url: string) => !url.includes("Reserved_ImageAttachment"));
    } catch (error) {
      console.error('Error fetching attachments:', error);
      return [];
    }
  }

  
  private GetItems = async () => {
    
    try {
      const items: IUpdateItem[] = await this._utils.GetItems(
        "עדכונים",
        "Title,ID,UpdateType/Title,UpdateType/ID,UpdateDate,Detail1,Picture1,Brand/ID,Model/ID,showFirst",
        "UpdateType,Brand,Model",
        "Created",
        false,
        "Active eq 1",
        4999
      );
   
      // Fetch attachments for each item
      const itemsWithAttachments = await Promise.all(
        items.map(async (item) => {
          const attachments = await this.GetAttachments(item.ID);
          return { ...item, Attachments: attachments };
        })
      );
  
      // Continue existing processing
      const parsedItems = itemsWithAttachments.map((item) => ({
        ...item,
        Picture1: item.Picture1 ? this.SetPic(item.ID, item.Picture1) : null,
        isFavorite: false, // Initially set to false
      }));
  

      debugger;
      // Get the current user
      await this.GetCurrentUser();

      // Fetch the user's favorite items
      const favoriteUpdateIds = await this.GetFavorites();

      // Update the `isFavorite` flag for each update
      const updatedItems = parsedItems.map(item => ({
        ...item,
        isFavorite: favoriteUpdateIds.includes(item.ID)
      }));

 
 // Sort items: ShowFirst items first, then by UpdateDate descending
      const sortedItems = updatedItems.sort((a, b) => {
        if (a.showFirst !== b.showFirst) {
          return a.showFirst ? -1 : 1; // ShowFirst items come first
        }
        return new Date(b.UpdateDate).getTime() - new Date(a.UpdateDate).getTime(); // Newer items first
      });

      const signedItemIds = await this.GetSignedItems();

if (this.props.description === "page") {
    const unsignedItems = sortedItems.filter(item => !signedItemIds.includes(item.ID));

    const currentItems = unsignedItems.slice(0, 5);
    const reserveItems = unsignedItems.slice(5);

    this.setState({ currentItems, reserveItems });

    this.setState({
        allItems: sortedItems,
        selectedUpdate: currentItems[0]
    });
} else {
    // Update the isSigned property for items that are part of the signed items
    const updatedItems = sortedItems.map(item => ({
        ...item,
        isSigned: signedItemIds.includes(item.ID) ? true : item.isSigned,
    }));

    this.setState({
        allItems: updatedItems,
        selectedUpdate: updatedItems[0],
        currentItems: updatedItems
    });
  }

    } catch (error) {
      console.error('Error fetching items', error);
    }
  }


  private SetPic(id: number, pic: string) {
    debugger;
    const picObject = JSON.parse(pic);
    const fileName = picObject.fileName;


    var site = '117513fa-1454-464e-9f1c-36d06c716776,2cf4f04d-18d0-4eb6-b9e2-28c4c4903a02';
    var list = 'f66f47c2-4743-4244-bc68-a9883f7b17b2';
    var picUrl = `/sites/${siteURL}/_api/v2.1/sites('` + site + 
    `')/lists('` + list +
    `')/items('` + id + `')/attachments('` + fileName +
    `')/thumbnails/0/c400x400/content?prefer=noredirect%2Cclosestavailablesize`;
    
    return picUrl;
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

  handlePopupClose = (update: IUpdateItem) => {
    this.AddToSignedItems(update);
    this.setState({ isPopupVisible: false });
  };

  private AddToSignedItems = async (update: IUpdateItem) => {
   
    update.isSigned = true;

    debugger;
    let data = {
      UpdateID: update.ID,
      Title: update.Title
    };
  
    try {
      await this._utils.AddItem(data, "חתימה על עדכונים");   
       
      if(this.props.description == "page")
          this.updateItemsAfterSign(update.ID);
    } catch (error) {
      console.error('Error adding item to favorites:', error);
    }
  }

  private updateItemsAfterSign = (updateId: number) => {

    const currentItems = this.state.currentItems.filter(item => item.ID !== updateId);
  
    const reserveItems = [...this.state.reserveItems];
    if (reserveItems.length > 0) {
      currentItems.push(reserveItems.shift()!);
    }
  
    this.setState({ currentItems, reserveItems });
  };
  

  private AddToFavorites = async (update: IUpdateItem) => {
    const data = {
      UpdateID: update.ID,
      Title: update.Title,
      UpdateDate: update.UpdateDate,
      Detail1: update.Detail1,
      UpdateTypeId: update.UpdateType?.ID, // Optional chaining for UpdateType.ID
      BrandId: update.Brand?.ID,           // Optional chaining for Brand.ID
      ModelId: update.Model?.ID            // Optional chaining for Model.ID
    };
  
    try {
      await this._utils.AddItem(data, "מועדפים");
  
      // Update the isFavorite flag for the update in both allItems and currentItems
      this.setState((prevState) => ({
        allItems: prevState.allItems.map(item => 
          item.ID === update.ID ? { ...item, isFavorite: true } : item
        ),
        currentItems: prevState.currentItems.map(item => 
          item.ID === update.ID ? { ...item, isFavorite: true } : item
        )
      }));
  
    } catch (error) {
      console.error('Error adding item to favorites:', error);
    }
  };
    
  private RemoveFromFavorites = async (updateId: number) => {
    try {
      await this._utils.RemoveItemFavorites(updateId, "מועדפים");
  
      // Update the isFavorite flag for the update in both allItems and currentItems
      this.setState((prevState) => ({
        allItems: prevState.allItems.map(item => 
          item.ID === updateId ? { ...item, isFavorite: false } : item
        ),
        currentItems: prevState.currentItems.map(item => 
          item.ID === updateId ? { ...item, isFavorite: false } : item
        )
      }));
  
    } catch (error) {
      console.error('Error removing item from favorites:', error);
    }
  };
  

  render(): React.ReactElement<IMeirUpdatesProps> {
    const { currentItems, selectedUpdate, isPopupVisible } = this.state;

    const showUnreadMessage = this.props.description === "page" && currentItems.length === 0;
    const unreadCount = this.state.reserveItems.length + currentItems.length;

    return (
        <section className={styles.meirUpdates}>
            <div className={styles.updateArea}>
                <div className={styles.updates} style={this.props.description === "page" ? { width: '70%' } : {}}>
                    {this.props.description === "page" ? (
                        <div className={styles.headLine}>
                            <div style={{ fontSize: 20 }}>עדכונים שלא נקראו</div>
                        </div>
                    ) : (
                        <div className={styles.headLine}>
                            <div className={styles.title}>עדכונים</div>
                            <div
                                className={styles.link}
                                onClick={() => this._utils.OpenTab(`/sites/${siteURL}/SitePages/Updates.aspx`)}
                            >
                                לכל העדכונים
                            </div>
                        </div>
                    )}

                    <div
                        className={styles.upList}
                        style={
                            currentItems.length === 0
                                ? { height: 'auto' }
                                : { height: '581px' }
                        }
                    >
                        {showUnreadMessage ? (
                            <div className={styles.noUpdatesMessage}>אין עדכונים שלא נקראו</div>
                        ) : (
                            <>
                                {this.props.description === "page" && (
                                    <div className={styles.unreadCount}>
                                        {`נותרו ${unreadCount} עדכונים שלא נקראו`}
                                    </div>
                                )}
                                <div className={styles.right}>
                                    {currentItems.map((update) => (
                                        <div
                                            key={update.ID}
                                            className={`${styles.oneUpdate} ${
                                                selectedUpdate?.ID === update.ID ? styles.oneUpdateSelected : ''
                                            }`}
                                        >
                                            <div className={styles.icon}>
                                                {/* Favorite button */}
                                                {update.isFavorite ? (
                                                    <div
                                                        onClick={() => this.RemoveFromFavorites(update.ID)}
                                                    >
                                                        <img
                                                            src={`/sites/${siteURL}/SiteAssets/cut/faveStar.png`}
                                                            style={{ width: 21 }}
                                                            alt={`Icon for ${update.UpdateType?.Title || 'Update'}`}
                                                        />
                                                    </div>
                                                ) : (
                                                    <div
                                                        
                                                        onClick={() => this.AddToFavorites(update)}
                                                    >
                                                        <img
                                                            src={`/sites/${siteURL}/SiteAssets/cut/favorite.svg`}
                                                            alt={`Icon for ${update.UpdateType?.Title || 'Update'}`}
                                                        />
                                                    </div>
                                                )}

                                                {/* Checkbox to mark as signed */}
                                                <div>
                                                    <input
                                                        type="checkbox"
                                                        id={`signedCheckbox-${update.ID}`}
                                                        checked={update.isSigned}
                                                        onChange={async () => {
                                                            await this.handlePopupClose(update);
                                                            this.setState({
                                                                currentItems: currentItems.map(item =>
                                                                    item.ID === update.ID ? { ...item, isSigned: update.isSigned } : item
                                                                ),
                                                            });
                                                        }}
                                                    />
                                                </div>
                                            </div>

                                            <div
                                                className={styles.data}
                                                onClick={() => this.handleUpdateClick(update)}
                                            >
                                                <div className={styles.r100}>
                                                    <div className={styles.title}>
                                                        {update.UpdateType?.Title || 'Update Type'}
                                                    </div>
                                                    <div className={styles.date}>
                                                        {this._utils.formatDate(update.UpdateDate)}
                                                    </div>
                                                </div>
                                                <div className={styles.text}>{update.Title}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className={styles.oneUpdateDetails}>
                                    {selectedUpdate && (
                                        <>
                                            {selectedUpdate.Picture1 && (
                                                <div
                                                    className={styles.r100}
                                                    onClick={() => this.setState({ isPopupVisible: true })}
                                                >
                                                    <img
                                                        src={selectedUpdate.Picture1}
                                                        alt={`image for ${selectedUpdate.Title}`}
                                                    />
                                                </div>
                                            )}
                                            <div
                                                className={styles.text}
                                                onClick={() => this.setState({ isPopupVisible: true })}
                                                dangerouslySetInnerHTML={{ __html: selectedUpdate.Detail1 }}
                                            ></div>
                                        </>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {isPopupVisible && selectedUpdate && (
                <div className={styles.popup}>
                    <div className={styles.popupContent}>
                        <h2>{selectedUpdate.Title}</h2>
                        {selectedUpdate.Picture1 && (
                            <img
                                src={selectedUpdate.Picture1}
                                alt={`Popup image for ${selectedUpdate.Title}`}
                            />
                        )}
                        <div
                            className={styles.popupText}
                            dangerouslySetInnerHTML={{ __html: selectedUpdate.Detail1 }}
                        ></div>
                        {selectedUpdate.Attachments && selectedUpdate.Attachments.length > 0 && (
                            <div className={styles.attachments}>
                                <h3>קבצים מצורפים</h3>
                                <ul>
                                    {selectedUpdate.Attachments.map((attachment, index) => (
                                        <li key={index}>
                                            <a
                                                href={attachment}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                {attachment.split('/').pop()}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        <button
                            className={styles.closeButton}
                            onClick={() => this.handlePopupClose(selectedUpdate)}
                        >
                            קראתי, הבנתי
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
}
  
  
}
