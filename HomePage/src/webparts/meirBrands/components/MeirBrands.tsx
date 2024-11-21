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
  leftArrowClass: string;
  rightArrowClass: string;
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
    this.state = {
      allItems: [],
      currItems: [],
      index: 1,
      limit: "Prev",
      leftArrowClass: "arrow_left" ,  
      rightArrowClass:  "arrow_right_grey"  
    };
    
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
    
      const parsedItems = items.map((item: IBrandItem) => ({
        ...item,
        Picture1: item.Picture1 ? this.SetPic(item.ID, item.Picture1) : null
      }));
    
      debugger;
      console.log("Brands Items: ", parsedItems);
      this.setState({ allItems: parsedItems }, () => {
        this.GetCurrentBrands(1);
      });
    
    } catch (error) {
      console.error('Error fetching items', error);
    }
  }

  private SetPic(id: any, pic: string) {
    const picObject = JSON.parse(pic);
    const fileName = picObject.fileName;

    var site = '117513fa-1454-464e-9f1c-36d06c716776,2cf4f04d-18d0-4eb6-b9e2-28c4c4903a02';
    var list = 'c2daef00-b3f0-444f-8a09-2d32a93d8bdd';
    var picUrl = "https://meir365.sharepoint.com/sites/KBMCT2/_api/v2.1/sites('" + site + 
    "')/lists('" + list +
    "')/items('" + id + "')/attachments('" + fileName +
    "')/thumbnails/0/c400x400/content?prefer=noredirect%2Cclosestavailablesize";
    
    return picUrl;
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
    let newLeftArrowClass = "arrow_left";  // Default active class
    let newRightArrowClass = "arrow_right";  // Default active class

    // Check if we're at the start or end of the list
    if (newIndex <= 1) {
      newLimit = "Prev";
      newRightArrowClass = "arrow_right_grey";  // Disable right arrow      
    } 
    if (newIndex >= this.state.allItems.length - 5) {
      newLimit = "Next";
      newLeftArrowClass = "arrow_left_grey";  // Disable left arrow
    }

    this.setState({
      index: newIndex,
      limit: newLimit,
      leftArrowClass: newLeftArrowClass,
      rightArrowClass: newRightArrowClass
    }, () => {
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
    const leftArrowClass = this.state.leftArrowClass === 'arrow_left_grey' ? styles.arrowLeftGrey : styles.arrowLeft;
    const rightArrowClass = this.state.rightArrowClass === 'arrow_right_grey' ? styles.arrowRightGrey : styles.arrowRight;
  
    return (
      <section className={styles.meirBrands}>
        <div className={styles.brands}>
          <div className={styles.brandsInner}>
            {/* Apply the computed class for the left arrow */}
            <div className={`${styles.arrowRight} ${rightArrowClass}`} onClick={() => this.Next(-1)}></div>
            <div className={styles.inner}>
              <div className={styles.title}>
                <div className={styles.data}>מותגים</div>
              </div>
              <div className={styles.list}>
                {this.state.currItems.map((brand: any) => (
                  <div className={styles.oneItem} key={brand.ID} onClick={() =>
                    this._utils.OpenTab(
                      `/sites/${siteURL}/SitePages/Brand.aspx?Brand=${brand.Title}&BrandID=${brand.ID}`
                    )
                  }>
                    {brand.Picture1 ? (
                    <div
                    id={brand.ID}
                    className={styles.theImage}
                    style={{
                      backgroundImage: `url("${encodeURI(brand.Picture1)}")`
                    }}
                    onMouseOver={() => this.hideShow(brand.ID, `${brand.ID}_data`)}
                  >
                  </div>
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
            {/* Apply the computed class for the right arrow */}
            <div className={`${styles.arrowLeft} ${leftArrowClass}`} onClick={() => this.Next(1)}></div>
          </div>
        </div>
      </section>
    );
  }
  
  
}
