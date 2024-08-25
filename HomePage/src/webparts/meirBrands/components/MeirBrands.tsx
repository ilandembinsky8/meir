import * as React from 'react';
import styles from './MeirBrands.module.scss';
import { IMeirBrandsProps } from './IMeirBrandsProps';

const siteURL = "KBMCT2"; // Change this as needed

const brands = [
  {
    id: "a11",
    imageUrl: `/sites/${siteURL}/SiteAssets/cut/volvo.png`,
    hebTitle: "וולוו",
    engTitle: "VOLVO",
    text: "וולוו הנה אחד ממותגי הרכב המובילים, הותיקים והמוכרים בעולם כולו, החברה נוסדה בשוודיה ב 1927 ומאז חרטה על דיגלה את ערכי הבטיחות "},
  {
    id: "a21",
    imageUrl: `/sites/${siteURL}/SiteAssets/cut/honda_car.png`,
    hebTitle: "הונדה מכוניות",
    engTitle: "Honda Cars",
    text: "ליבם סולגק. בראיט ולחת צורק מונחף, בגורמי מגמש. תרבנך וסתעד לכנו סתשם השמה - לתכי מורגם בורק? לתיג ישבעס."
  },
  {
    id: "a31",
    imageUrl: `/sites/${siteURL}/SiteAssets/cut/honda_cycle.png`,
    hebTitle: "הונדה אופנועים",
    engTitle: "Honda Motorcycle",
    text: "ליבם סולגק. בראיט ולחת צורק מונחף, בגורמי מגמש. תרבנך וסתעד לכנו סתשם השמה - לתכי מורגם בורק? לתיג יבעס."
  },
  {
    id: "a41",
    imageUrl: `/sites/${siteURL}/SiteAssets/cut/polestar.svg`,
    hebTitle: "פולסטאר",
    engTitle: "Polestar",
    text: "ליבם סולגק. בראיט ולחת צורק מונחף, בגורמי מגמש. תרבנך וסתעד לכנו סתשם השמה - לתכי מורגם בורק? לתיג ישבעס."
  },
  {
    id: "a51",
    imageUrl: `/sites/${siteURL}/SiteAssets/cut/linkco.png`,
    hebTitle: "לינק אנד קו",
    engTitle: "Link&co",
    text: "ליבם סולגק. בראיט ולחת צורק מונחף, בגורמי מגמש. תרבנך וסתעד לכנו סתשם השמה - לתכי מורגם בורק? לתיג ישבעס."
  },
  {
    id: "a61",
    imageUrl: `/sites/${siteURL}/SiteAssets/cut/meu.png`,
    hebTitle: "מיו",
    engTitle: "Meu",
    text: "ליבם סולגק. בראיט ולחת צורק מונחף, בגורמי מגמש. תרבנך וסתעד לכנו סתשם השמה - לתכי מורגם בורק? לתיג ישבעס."
  },
  {
    id: "a71",
    imageUrl: `/sites/${siteURL}/SiteAssets/cut/volvo.png`,
    hebTitle: "חדש וולוו",
    engTitle: "VOLVO",
    text: "ליבם סולגק. בראיט ולחת צורק מונחף, בגורמי מגמש. תרבנך וסתעד לכנו סתשם השמה - לתכי מורגם בורק? לתיג ישבעס."
  },
  {
    id: "a81",
    imageUrl: `/sites/${siteURL}/SiteAssets/cut/honda_car.png`,
    hebTitle: "הונדה מכוניות חדש",
    engTitle: "Honda Cars",
    text: "ליבם סולגק. בראיט ולחת צורק מונחף, בגורמי מגמש. תרבנך וסתעד לכנו סתשם השמה - לתכי מורגם בורק? לתיג ישבעס."
  },
  {
    id: "a91",
    imageUrl: `/sites/${siteURL}/SiteAssets/cut/honda_cycle.png`,
    hebTitle: " חדש הונדה אופנועים",
    engTitle: "Honda Motorcycle",
    text: "ליבם סולגק. בראיט ולחת צורק מונחף, בגורמי מגמש. תרבנך וסתעד לכנו סתשם השמה - לתכי מורגם בורק? לתיג ישבעס."
  },
  {
    id: "a101",
    imageUrl: `/sites/${siteURL}/SiteAssets/cut/polestar.svg`,
    hebTitle: " חדש פולסטאר",
    engTitle: "Polestar",
    text: "ליבם סולגק. בראיט ולחת צורק מונחף, בגורמי מגמש. תרבנך וסתעד לכנו סתשם השמה - לתכי מורגם בורק? לתיג ישבעס."
  }
];

export interface IBrandsState {
  allItems: any[];
  currItems: any[];
  index: number;
  limit: string;
}

export default class MeirBrands extends React.Component<IMeirBrandsProps, IBrandsState> {

  constructor(props: IMeirBrandsProps) {
    super(props);
    this.state = { allItems: [], currItems: [], index: 1, limit: "Prev" };
    
    this.GetBrands = this.GetBrands.bind(this);
    this.GetCurrentBrands = this.GetCurrentBrands.bind(this);
    this.Next = this.Next.bind(this);
    this.hideShow = this.hideShow.bind(this);
  }

  componentDidMount() {
    this.GetBrands();
  }

  private GetBrands() {
    this.setState({ allItems: brands }, () => {
      this.GetCurrentBrands(1);
    });
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
                  <div className={styles.oneItem} key={brand.id}>
                    <div
                      id={brand.id}
                      className={styles.theImage}
                      style={{ backgroundImage: `url(${brand.imageUrl})` }}
                      onMouseOver={() => this.hideShow(brand.id, `${brand.id}_data`)}
                    ></div>
                    <div
                      id={`${brand.id}_data`}
                      className={styles.theData}
                      onMouseLeave={() => this.hideShow(`${brand.id}_data`, brand.id)}
                    >
                      <div className={styles.hebTitle}>{brand.hebTitle}</div>
                      <div className={styles.engTitle}>{brand.engTitle}</div>
                      <div className={styles.text}>{brand.text}</div>
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
