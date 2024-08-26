import * as React from 'react';
import styles from './MeirBrandsComparation.module.scss';
import { IMeirBrandsComparationProps } from './IMeirBrandsComparationProps';
import { Utils } from '../../../Services/Utils';
import { sp } from "@pnp/sp";
import '@pnp/sp/site-users/web';

const siteURL = "KBMCT2"; //KBMCT1

export interface IItem {
  Title: string;
  Code: string;
}

export interface ICompareModelsState { 
  allItems: IItem[];
}

export default class MeirBrandsComparation extends React.Component<IMeirBrandsComparationProps, ICompareModelsState> {
  
  private _utils: Utils;

  constructor(props: IMeirBrandsComparationProps) {
    super(props);
    this._utils = new Utils();
    this.state = {
      allItems: []
    };
  }

  private GetItems = async () => {
    try {
      const currentUser = await sp.web.currentUser.get();

      const items: IItem[] = await this._utils.GetItems(
        "השוואה בין דגמים",
        "Title,Code",
        null,
        "Created",
        false, 
        `(Author/Id eq ${currentUser.Id} or Editor/Id eq ${currentUser.Id})`, 
        6
      );

      console.log("Brand Compare Items: ", items);
      this.setState({ allItems: items });
    } catch (error) {
      console.error('Error fetching items', error);
    }
  }

  public componentDidMount() {
    this.GetItems();
  }

  public render(): React.ReactElement<IMeirBrandsComparationProps> {
   
    const { allItems } = this.state;
    const noItemsMessage = (
      <div>
        עוד לא יצרת השוואות בין דגמים, להוספה ,{" "}
        <a
          href={`/sites/${siteURL}/SitePages/BrandsComparation.aspx`}
          target="_blank"
          rel="noopener noreferrer"
        >
          לחצ/י כאן
        </a>.
      </div>
    );
  
    return (
      <section className={styles.meirBrandsComparation}>
        <div className={styles.updateArea}>
          <div className={styles.links}>
            <div className={styles.linksList}>
              <div className={styles.oneItem}>
                <div className={styles.imageArea}>
                  <div
                    className={styles.theImage}
                    style={{
                      backgroundImage: `url('/sites/${siteURL}/SiteAssets/cut/compare.svg')`,
                    }}
                  ></div>
                </div>
                <div className={styles.data}>
                  <div
                    className={styles.title}
                    onClick={() =>
                      this._utils.OpenTab(
                        `/sites/${siteURL}/SitePages/BrandsComparation.aspx`
                      )
                    }
                  >
                    השוואה בין דגמים
                  </div>
                  <div className={styles.text}>
                    {allItems.length === 0 ? (
                      noItemsMessage
                    ) : (
                      allItems.map((item, index) => (
                        <a
                          key={index}
                          href={`/sites/${siteURL}/SitePages/BrandsComparation.aspx?BrandsCode=${item.Code}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.tooltipContainer}
                        >
                          {this._utils.limitChars(item.Title, 30)}
                          <span className={styles.tooltipText}>
                            {item.Title}
                          </span>
                        </a>
                      ))
                    )}
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
