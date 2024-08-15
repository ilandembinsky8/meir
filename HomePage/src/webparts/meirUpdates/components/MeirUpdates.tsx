import * as React from 'react';
import styles from './MeirUpdates.module.scss';
import { IMeirUpdatesProps } from './IMeirUpdatesProps';

const siteURL = "Meir-Demo"; // KBMCT1

interface IUpdateItem {
  id: number;
  title: string;
  date: string;
  text: string;
  description: string;
  imageUrl: string;
}

interface IMeirUpdatesState {
  selectedUpdate: IUpdateItem | null;
  isPopupVisible: boolean;
}

export default class MeirUpdates extends React.Component<IMeirUpdatesProps, IMeirUpdatesState> {
  private updates: IUpdateItem[] = [
    { id: 1, title: 'דגמים חדשים', date: "יום ה' 30 במאי 2024", text: 'NQiGTs-Cargo-5-1', description: 'תיאור דגם חדש', imageUrl: `/sites/${siteURL}/SiteAssets/cut/NQiGTs-Cargo-5-1.png` },
    { id: 2, title: 'דגם אחר', date: "יום ב' 15 ביוני 2024", text: 'כותרת דגם נוסף', description: 'תיאור דגם נוסף', imageUrl: `/sites/${siteURL}/SiteAssets/cut/sampleCar2.png` },
    { id: 3, title: 'עוד דגם', date: "יום ג' 10 ביולי 2024", text: 'עוד כותרת דגם', description: 'תיאור דגם אחר', imageUrl: `/sites/${siteURL}/SiteAssets/cut/sampleCar3.png` },
    { id: 4, title: 'דגמים חדשים', date: "יום ה' 30 במאי 2024", text: 'כותרת דגם חדש', description: 'תיאור דגם חדש נוסף', imageUrl: `/sites/${siteURL}/SiteAssets/cut/sampleCar.png` },
    { id: 5, title: 'דגם אחר', date: "יום ב' 15 ביוני 2024", text: 'כותרת דגם נוסף', description: 'תיאור דגם נוסף אחר', imageUrl: `/sites/${siteURL}/SiteAssets/cut/sampleCar2.png` }, 
  ];

  constructor(props: IMeirUpdatesProps) {
    super(props);
    this.state = {
      selectedUpdate: this.updates[0],
      isPopupVisible: false,
    };
  }

  handleUpdateClick = (update: IUpdateItem) => {
    if (this.state.selectedUpdate?.id === update.id) {
      // If the update is already selected, toggle the popup
      this.setState({ isPopupVisible: !this.state.isPopupVisible });
    } else {
      // Select the update and hide the popup
      this.setState({ selectedUpdate: update, isPopupVisible: false });
    }
  };

  handlePopupClose = () => {
    this.setState({ isPopupVisible: false });
  };

  render(): React.ReactElement<IMeirUpdatesProps> {
    const { selectedUpdate, isPopupVisible } = this.state;

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
                {this.updates.map((update) => (
                  <div
                    key={update.id}
                    className={`${styles.oneUpdate} ${selectedUpdate?.id === update.id ? styles.oneUpdateSelected : ''}`}
                    onClick={() => this.handleUpdateClick(update)}
                  >
                    <div className={styles.icon}>
                      <img src={`/sites/${siteURL}/SiteAssets/cut/favorite.svg`} alt={`Icon for ${update.title}`} />
                    </div>
                    <div className={styles.data}>
                      <div className={styles.r100}>
                        <div className={styles.title}>{update.title}</div>
                        <div className={styles.date}>{update.date}</div>
                      </div>
                      <div className={styles.text}>
                        {update.text}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className={styles.oneUpdateDetails}>
                {selectedUpdate && (
                  <>
                    <div className={styles.r100} onClick={() => this.setState({ isPopupVisible: true })}>
                      <img src={selectedUpdate.imageUrl} alt={`image for ${selectedUpdate.title}`} />
                    </div>
                    <div className={styles.text} onClick={() => this.setState({ isPopupVisible: true })}>
                      {selectedUpdate.description} 
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
              <h2>{selectedUpdate.title}</h2> 
              <img src={selectedUpdate.imageUrl} alt={`Popup image for ${selectedUpdate.title}`} />
              <div className={styles.popupText}>
                {selectedUpdate.description} 
              </div>
              <button className={styles.closeButton} onClick={this.handlePopupClose}>קראתי, הבנתי</button>
            </div>
          </div>
        )}
      </section>
    );
  }
}
