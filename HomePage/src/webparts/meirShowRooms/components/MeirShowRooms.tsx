import * as React from 'react';
import styles from './MeirShowRooms.module.scss';
import { IMeirShowRoomsProps } from './IMeirShowRoomsProps';
import { Utils } from '../../../Services/Utils';

const siteURL = "KBMCT2" //KBMCT1

export default class MeirShowRooms extends React.Component<IMeirShowRoomsProps, {}> {

  private _utils: Utils;

  constructor(props: IMeirShowRoomsProps) {
    super(props);
    this._utils = new Utils();
  }

  public render(): React.ReactElement<IMeirShowRoomsProps> {

    return (
      <section className={styles.meirShowRooms}>
        <div className={styles.updateArea}>
          <div className={styles.links}>
            <div className={styles.linksList}>
              <div className={styles.oneItem} onClick={() =>
                    this._utils.OpenTab(
                      `/sites/${siteURL}/SitePages/Showrooms.aspx`
                    )
                  }>
                <div className={styles.imageArea}>
                  <div
                    className={styles.theImage}
                    style={{ backgroundImage: `url('/sites/${siteURL}/SiteAssets/cut/handshake.svg')` }}
                  ></div>
                </div>
                <div className={styles.data}>
                  <div className={styles.title}>אולמות תצוגה</div>
                  <div className={styles.text}>
                    {this.props.description}
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
