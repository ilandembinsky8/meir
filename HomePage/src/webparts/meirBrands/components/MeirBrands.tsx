import * as React from 'react';
import styles from './MeirBrands.module.scss';
import { IMeirBrandsProps } from './IMeirBrandsProps';
import { Utils } from '../../../Services/Utils';

const siteURL = "KBMCT2"; // Change this as needed

export interface IBrandsState {
  allItems: any[];
  currItems: any[];
  index: number;
  limit: string;
}

interface IBrandItem {
  Title: string;
  ID: string;
  EngTitle: string;
  Explanation: string;
  Picture1?: string; // Assuming Picture1 is a JSON string
}


export default class MeirBrands extends React.Component<IMeirBrandsProps, IBrandsState> {

  private _utils: Utils;

  constructor(props: IMeirBrandsProps) {
    super(props);
    this._utils = new Utils();
    this.state = { allItems: [], currItems: [], index: 1, limit: "Prev" };
    
    this.GetBrands = this.GetBrands.bind(this);
    this.GetCurrentBrands = this.GetCurrentBrands.bind(this);
    this.Next = this.Next.bind(this);
    this.hideShow = this.hideShow.bind(this);
  }

  componentDidMount() {
    this.GetBrands();
  }

  private async GetBrands() {
    try {
      const items: IBrandItem[] = await this._utils.GetItems(
        "מותגים",
        "Title,ID,EngTitle,Explanation,Picture1",
        null,
        "Title",
        true, 
        null, 
        100
      );
    
      // Parse the Picture1 JSON string into an object or keep it null if parsing fails
      const parsedItems = items.map((item: IBrandItem) => ({
        ...item,
        Picture1: item.Picture1 ? JSON.parse(item.Picture1) : null
      }));
    
      console.log("Brands Items: ", parsedItems);
      this.setState({ allItems: parsedItems }, () => {
        this.GetCurrentBrands(1);
      });
    
    } catch (error) {
      console.error('Error fetching items', error);
    }
  }
  
  

  private GetCurrentBrands(index: number) {
    const currItems = [];
    const length = (index + 5 > this.state.allItems.length ? this.state.allItems.length : index + 5);
    
    for (let i = index - 1; i < length; i++) {
      currItems.push(this.state.allItems[i]);
    }

    this.setState({ currItems });
  }

  private Next(k: number) {
    if ((this.state.index <= 1 && k === -1) ||
        (this.state.index >= this.state.allItems.length - 5 && k === 1)) {
      return;
    }

    const newIndex = this.state.index + k;
    let newLimit = "None";

    if (newIndex <= 1 && k === -1) {
      newLimit = "Prev";
    } else if (newIndex >= this.state.allItems.length - 5 && k === 1) {
      newLimit = "Next";
    }

    this.setState({ index: newIndex, limit: newLimit }, () => {
      this.GetCurrentBrands(newIndex);
    });
  }

  private hideShow(x: string, y: string) {
    const elementX = document.getElementById(x);
    const elementY = document.getElementById(y);
    if (elementX) elementX.style.display = "none";
    if (elementY) elementY.style.display = "inline";
  }

  public render(): React.ReactElement<IMeirBrandsProps> {
    return (
      <section className={styles.meirBrands}>
        <div className={styles.brands}>
          <div className={styles.brandsInner}>
            <div className={styles.arrowRight} onClick={() => this.Next(-1)}></div>
            <div className={styles.inner}>
              <div className={styles.title}>
                <div className={styles.data}>מותגים</div>
              </div>
              <div className={styles.list}>
                {this.state.currItems.map((brand: any) => (
                  <div className={styles.oneItem} key={brand.ID} onClick={() =>
                    this._utils.OpenTab(
                      `/sites/${siteURL}/SitePages/Brand.aspx?Brand=${brand.ID}`
                    )
                  }>
                    {brand.Picture1 && brand.Picture1.serverRelativeUrl ? (
                      <div
                        id={brand.ID}
                        className={styles.theImage}
                        style={{ backgroundImage: `url(${brand.Picture1.serverRelativeUrl})` }}
                        onMouseOver={() => this.hideShow(brand.ID, `${brand.ID}_data`)}
                      ></div>
                    ) : (
                      <div
                        id={brand.ID}
                        className={styles.theImage}
                        style={{ backgroundImage: `url('/sites/${siteURL}/SiteAssets/cut/default.svg')` }} // Fallback image
                        onMouseOver={() => this.hideShow(brand.ID, `${brand.ID}_data`)}
                      ></div>
                    )}
                    <div
                      id={`${brand.ID}_data`}
                      className={styles.theData}
                      onMouseLeave={() => this.hideShow(`${brand.ID}_data`, brand.ID)}
                    >
                      <div className={styles.hebTitle}>{brand.Title}</div>
                      <div className={styles.engTitle}>{brand.EngTitle}</div>
                      <div className={styles.text}>{this._utils.limitChars(brand.Explanation, 90)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.arrowLeft} onClick={() => this.Next(1)}></div>
          </div>
        </div>
      </section>
    );
  }
  
}
