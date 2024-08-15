import * as React from 'react';
import styles from './MeirBrandsComparation.module.scss';
import { IMeirBrandsComparationProps } from './IMeirBrandsComparationProps';

const siteURL = "Meir-Demo"; //KBMCT1

export default class MeirBrandsComparation extends React.Component<IMeirBrandsComparationProps, {}> {
  public render(): React.ReactElement<IMeirBrandsComparationProps> {
    const links = [
      { text: 'הונדה רכבים- Volvo Selekt', url: 'https://example.com/1' },
      { text: 'Volvo אוטובוסים- Zhong Tong אוטובוסים', url: 'https://example.com/2' },
      { text: 'וולוו משאיות - רנו משאיות', url: 'https://example.com/3' },
      { text: 'פולסטאר - NIU', url: 'https://example.com/4' },
      { text: 'פולסטאר - וולוו רכבים', url: 'https://example.com/5' },
    ];

    return (
      <section className={styles.meirBrandsComparation}>
        <div className={styles.updateArea}>
          <div className={styles.links}>
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
                    {links.map((link, index) => (
                      <a key={index} href={link.url} target="_blank" rel="noopener noreferrer" className={styles.link}>
                        {link.text}
                      </a>
                    ))}
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
