import * as React from 'react';
import styles from './MeirBanners.module.scss';
import { IMeirBannersProps } from './IMeirBannersProps';
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

sp.setup({
  sp: {
    baseUrl: "https://meir365.sharepoint.com/sites/KBMCT2"
  }
});

export interface IState {
  itemID: number;
  bannerLink: string;
  itemName: string;
}

export default class MeirBanners extends React.Component<IMeirBannersProps, IState> {

  constructor(props: IMeirBannersProps) {
    super(props);
    this.state = { itemID: 1, bannerLink: "", itemName: "" };  
  }

  componentDidMount() {
    this.GetBrandBanner(); 
  }

  private GetQueryString(value: string): string {
    let valString = "";

    let valStringArr = window.location.href.split("?");
    if (valStringArr[1]) valString = valStringArr[1];
    else return "";

    valStringArr = valString.split(value + "=");
    if (valStringArr[1]) valString = valStringArr[1];
    else return "";

    valStringArr = valString.split("&");
    if (valStringArr[0]) {
      return decodeURI(valStringArr[0]);
    } else {
      return decodeURI(valString);
    }
  }
 
  private async GetBrandBanner() {
    var itemID = Number(this.GetQueryString("BrandID"));
    var itemName = this.GetQueryString("Brand");
    this.setState({itemName});
    if(!itemID)
      return;
    try {
      const item = await sp.web.lists.getByTitle("מותגים").items.getById(itemID).select("Banner")();

      debugger;
      const bannerField = item?.Banner;
      if (bannerField && bannerField.Url) {
        this.setState({ bannerLink: bannerField.Url });
      } else {
        this.setState({ bannerLink: "" });  
      }
    } catch (error) {
      console.error("Error fetching Banner by ID:", error);
      this.setState({ bannerLink: "" });  
    }
  }

  public render(): React.ReactElement<IMeirBannersProps> {
    return (
      <section className={styles.meirBanners}>
        <div style={{fontSize: 26, fontWeight: "bold"}}>{this.state.itemName}</div>
        <div>
          {this.state.bannerLink ? (
            <div
              style={{
                width: "100%",
                height: "auto", 
                minHeight: "300px", 
                backgroundImage: `url(${this.state.bannerLink})`,
                backgroundSize: "cover", 
                backgroundPosition: "center", 
                backgroundRepeat: "no-repeat", 
              }}
            ></div>
          ) : (
            <div></div>
          )}
        </div>
      </section>
    );
  }
}
