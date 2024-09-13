import * as React from 'react';
import styles from './MeirScripts.module.scss';
import { IMeirScriptsProps } from './IMeirScriptsProps';

const siteURL = "KBMCT2"; //KBMCT1

export default class MeirScripts extends React.Component<IMeirScriptsProps, {}> {
  public render(): React.ReactElement<IMeirScriptsProps> {
   

    return (
      <section className={styles.meirScripts}>
      <div className={styles.updateArea}>
          <div className={styles.links}>
            <div className={styles.headLine}>
              &nbsp;
            </div>
            <div className={styles.linksList}>
              <div className={styles.oneItem}>
                <div className={styles.imageArea}>
                  <div
                    className={styles.theImage}
                    style={{ backgroundImage: `url('/sites/${siteURL}/SiteAssets/cut/compare.svg')` }}
                  ></div>
                </div>
                <div className={styles.data}>
                  <div className={styles.title}>השוואה בין דגמים</div>
                  <div className={styles.text}>
                    לורם איפסום דולור סיט אמט, קונסקטורר אדיפיסינג אלית סחטיר בלובק. תצטנפל בלינדו למרקל אס לכימפו, דול, צוט
                  </div>
                </div>
              </div>
              <div className={styles.oneItem}>
                <div className={styles.imageArea}>
                  <div
                    className={styles.theImage}
                    style={{ backgroundImage: `url('/sites/${siteURL}/SiteAssets/cut/chat.svg')` }}
                  ></div>
                </div>
                <div className={styles.data}>
                  <div className={styles.title}>תסריטי שיחה</div>
                  <div className={styles.text}>
                    לורם איפסום דולור סיט אמט, קונסקטורר אדיפיסינג אלית סחטיר בלובק. תצטנפל בלינדו למרקל אס לכימפו, דול, צוט
                  </div>
                </div>
              </div>
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
                    לורם איפסום דולור סיט אמט, קונסקטורר אדיפיסינג אלית סחטיר בלובק. תצטנפל בלינדו למרקל אס לכימפו, דול, צוט
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
