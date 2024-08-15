import * as React from 'react';
import styles from './MeirShowRooms.module.scss';
import { IMeirShowRoomsProps } from './IMeirShowRoomsProps';

const siteURL = "Meir-Demo" //KBMCT1

export default class MeirShowRooms extends React.Component<IMeirShowRoomsProps, {}> {
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
                  <div className={styles.text}>
                  בואו לראות מקרוב ולהכיר את המכוניות החדשות והמוכרות של הונדה באולמות התצוגה ברחבי הארץ: רכב פנאי-שטח, רכב קומפקטי ורכב משפחתי, ותאמו עוד היום נסיעת מבחן.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}
