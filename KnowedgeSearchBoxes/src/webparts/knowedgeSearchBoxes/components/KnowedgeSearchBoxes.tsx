import * as React from "react";
import styles from "./KnowedgeSearchBoxes.module.scss";
import { IKnowedgeSearchBoxesProps } from "./IKnowedgeSearchBoxesProps";
import { escape, groupBy } from "@microsoft/sp-lodash-subset";
import {
  IKnowedgeSearchBoxesState,
  Ioption,
} from "./IKnowedgeSearchBoxesState";
import Select from "react-select";
import { ListItemPicker } from '@pnp/spfx-controls-react/lib/ListItemPicker';
// import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";

import { IconButton, PrimaryButton ,TextField} from "office-ui-fabric-react";

import { IFieldInfo } from "@pnp/sp/fields/types";
import { sp } from "@pnp/sp";
import "@pnp/sp/fields";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { Item } from "@pnp/sp/items";

import { SPHttpClient, SPHttpClientConfiguration, SPHttpClientResponse, ODataVersion, ISPHttpClientConfiguration } from '@microsoft/sp-http';
import { IODataUser, IODataWeb } from '@microsoft/sp-odata-types';



import { Validate } from "@microsoft/sp-core-library";


// import AcBox from "./AcBox";
// import { IAcBoxProps } from './IAcBoxProps';
import { first } from "lodash";



export default class KnowedgeSearchBoxes extends React.Component<  IKnowedgeSearchBoxesProps,  IKnowedgeSearchBoxesState,  {}> {
  constructor(    props: IKnowedgeSearchBoxesProps,    state: IKnowedgeSearchBoxesState  ) 
  {
    super(props);
    sp.setup({ spfxContext: this.props.context });
   
    
    // this.state = ({ options: [], selectedvalue: null, selectedvalues: [] })
    // this.state = { selectedValues: [] };
    this.state = {
      //selectedValues1: [{ key: 9, name: "Carrot - Test" }],
      selectedValues1: [],
      selectedValues2: [],
      selectedValues3: [],
      selectedValues4: [],
      selectedValues5: [],
      selectedValues6: [],
      selectedValues7: [],
      selectedValues8: [],
      selectedValues9: [],
      selectedValues10: [],
      selectedValuesPeople1: [],
      selectedValuesPeople2: [],
      selectedValuesPeople3: [],
      selectedValuesPeople4: [],
      selectedValuesPeople5: [],
      selectedValuesPeople6: [],
      selectedValuesPeople7: [],
      selectedValuesPeople8: [],
      selectedValuesPeople9: [],
      selectedValuesPeople10: [],
      groupID:'',
      members:[],
      AcBoxSelectedOption:null,
      KnowedgeTextFieldVal:"",
      
    };
    //this.PopulateQueryParams();
    this.PopulateQueryParams = this.PopulateQueryParams.bind(this);
    this.submitClicked = this.submitClicked.bind(this);

     this.handleCallbakGetAcBoxSelectedOption = this.handleCallbakGetAcBoxSelectedOption.bind(this);

     this.setPeroplePickreshadowRootStyle();

     this.textBoxChanged = this.textBoxChanged.bind(this);

  }

  private delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private async setPeroplePickreshadowRootStyle() {
    await this.delay(100);

    let elmsPeoplePicker = document.getElementsByTagName("mgt-people-picker");
    for(let i=0;i < elmsPeoplePicker.length;i++){

      // let firstElm = elmsPeoplePicker[0];
      let firstElm = elmsPeoplePicker[i];
      
      
      let pPicker = elmsPeoplePicker[i].shadowRoot.children[0] as HTMLElement;
      pPicker.style.border = '1px solid rgb(3, 120, 124)';
      pPicker.style.minWidth = '180px';
      pPicker.style.padding = '0';
      pPicker.style.height = '30px';
      pPicker.style.lineHeight = '30px';
      
      let customStyledPicker = document.querySelectorAll('[class^="customStyledPicker"]')[i];
      
      let flyout = firstElm.shadowRoot['children'][0].children[0].children[0].children[1] as HTMLElement;
      if(flyout)
      {
        let _rightCalcFloat:number = window.innerWidth -  customStyledPicker.getBoundingClientRect().x - 26 ;
        let _rightCalc = _rightCalcFloat + "px";
        
        if(this.props.dropdowndirection == "RTL")
        {
          flyout.style.position = 'absolute';
        }
       
         flyout.style.right =  _rightCalc;
        
        // flyout.style.position = 'absolute';
      }

      
      let  inputField1 = firstElm.shadowRoot['children'][0].getElementsByClassName('search-box')[0] as HTMLElement;
      inputField1.style.margin = '0px';

      // let  inputField2 = inputField1.getElementsByClassName('search-box__input')[0] as HTMLElement;

      

      // inputField2.style.fontSize = "1.1rem";
      // inputField2.style.font = "fbt-Regular";
      // inputField2.style.paddingRight = "5px";
      // inputField2.style.outline = "none";


      // inputField2.className = 'knPersonField';      

      // let shadow = elmsPeoplePicker[i].shadowRoot;
      // var style = document.createElement( 'style' );      
      // style.innerHTML += '.people-picker { border-radius: 12px; border:0} .people-picker:hover{border:0} ';
      // style.innerHTML += '.knPersonField { font-size:1.1rem; font-family: fbt-Regular;padding-right: 5px;border: 0;outline:none} .knPersonField:focus{outline:none} .knPersonField::placeholder{color: #0064a7;  font-family: fbt-Regular;}';
      // style.innerHTML += '.selected-list__person-wrapper { height:46px }';
      // style.innerHTML += '.people-picker-input { font-size:1.1rem; font-family: fbt-Regular;padding-right: 5px;border: 0;outline:none} .people-picker-input:focus{outline:none} .knPersonField::placeholder{color: #0064a7;  font-family: fbt-Regular;}';
      // style.innerHTML += '.search-box__input { height:45px;font-size:1.1rem!important; font-family: fbt-Regular!important; padding-right: 5px;border: 0!important;outline:none!important} .search-box__input:focus{outline:none!important} .search-box__input::placeholder{color: #0064a7!important;  font-family: fbt-Regular!important;}';
      
      // elmsPeoplePicker[i].shadowRoot.appendChild( style );
      


    }
    // let elem = document.getElementById("knowedgeUserSearchBoxId");
    // const shadow = elem.shadowRoot;

    // var style = document.createElement( 'style' )
    // style.innerHTML = '.people-picker { border-radius: 12px; }';
    // elem.shadowRoot.appendChild( style )


    // let childInput: HTMLElement = shadow.getElementById("people-picker-input");    
    // childInput.focus();
  }

  private _onSelectionChanged = (e: any) => {
    let selusers: string[] = [];
    if (e.detail && e.detail.length > 0) {
        e.detail.map(user => {
            selusers.push(user.userPrincipalName);
        });
    }
    // console.log(selusers);
    
}
  
  // public onInit(): Promise<void> {
  //   graph.setup({
  //     spfxContext: this.context
  //   });
    
  
  //   return Promise.resolve();
  // }

  // public async getAzureGroupId(groupName) {
    
  
  public _UrlBuild = "";
  
  
  //onSelectedItem={this.onSelectedItem.bind(this,(rnNumber+1) )  }

  private onSelectedItem = (e,data: { key: string; name: string }[]): void => {
    var stateDynmic = "selectedValues" + e;
         
      var key = "selectedValues" + e;     
      var obj  = {};
      obj[key] = data;
      this.setState(obj);  
  }

  private onSelectedPerson = (boxNum,e) => {    
    
    
    // console.log(e.target.selectedPeople);

    var key = "selectedValuesPeople" + boxNum;
    var obj  = {};
    // clear state
    obj[key] = [];
    this.setState(obj);  

    if(e.target.selectedPeople.length > 0 && e.target.selectedPeople[0].id != undefined)
    {
      //obj[key] = e.target.selectedPeople;
      //obj[key] = e.target.selectedPeople[0].id;
      //obj[key] = e.target.selectedPeople[0];
      obj[key] = e.target.selectedPeople;
    }
    this.setState(obj);  
    
  }

  //**29-10-22 Clalit -- Itzik --- */
  private textBoxChanged(event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) {
    
    // console.log(newValue);
    //searchValue
    
    // const value = event.target;
    //  console.log(value);
    //this.setState({ searchValue: value });
    this.setState({KnowedgeTextFieldVal:newValue});
    

  }  


  private async  getCntTypes() {  
    try {  
  

      const spHttpClient: SPHttpClient = this.props.context.spHttpClient;      
      const currentWebUrl: string = this.props.context.pageContext.web.absoluteUrl;
      const cntURL = "lists('043797f6-c79f-44be-82b4-6ae62f6aa955')/contenttypes";
      
      var _ContentTypesArr:string[] = [];
      //GET current web info
      spHttpClient.get(`${currentWebUrl}/_api/web/` + cntURL, SPHttpClient.configurations.v1).then((response: SPHttpClientResponse) => {
      
        response.json().then((data:any[])=>{
          
          data["value"].forEach(function(item,key){         
            var _itemName = item["Name"];
            
          //   if(_itemName !== "פריט" || _itemName !== "תיקיה")
          //   {
          //     _ContentTypesArr.push(item["Name"]);
          // }
          _ContentTypesArr.push(item["Name"]);
            
          
          });
          //alert(_ContentTypesArr);

          
          //const _contentTypes:any[] = data;
       });
       
       
      });
        
    }  
    catch (err) {  
        Promise.reject(err);  
    }  
}  


  private PopulateQueryParams()
  {


    const url : any = new URL(window.location.href);
    let paramVal = "";

    // if(this.props.collectionData == null)

    //**29-10-22 Clalit -- Itzik --- */
    {/* Only for clalit -- 31-10-22 ** Itzik -- moved to another repository GIT- know_clalit */}
    // if(this.props.ShowsTextBox)
    // {
    //   if(this.props.TextBxPrmQuery)
    //   {
    //     if(this.props.TextBxPrmQuery.length > 0 ) 
    //     {
    //       const txtBxQueryValue = url.searchParams.get(this.props.TextBxPrmQuery);
    //       if(txtBxQueryValue != null)
    //       {
    //         this.setState({KnowedgeTextFieldVal:txtBxQueryValue})
    //       }
          
    //     } 
    //   }

    // }


    if(this.props.collectionData == null && this.props.collectionUserBoxData == null)
    {return;}


    if(this.props.collectionData != null )
    {
      let colldataCount = this.props.collectionData.length;
    
      let n = 1;

      if (colldataCount > 0) {
        this.props.collectionData.map((val,rnNumber) => {
          rnNumber++;

          if(url.searchParams.get(val.QueryParam) != null)
          {
            
            const object1 = {
              key: url.searchParams.get(val.QueryParam+"ID"),
              name: url.searchParams.get(val.QueryParam)
            };
              // print keys of object
            //    console.log(Object.keys(object1));
              var key = "selectedValues" + rnNumber;     
              var obj  = {};
              obj[key] = [object1];
              this.setState(obj); 

          }
        });
      }



    }
    

    if(this.props.collectionUserBoxData != null )
    {
      let collectionUserBoxDataCount = this.props.collectionUserBoxData.length;
    
      let n = 1;

      if (collectionUserBoxDataCount > 0) {
        this.props.collectionUserBoxData.map((val,rnNumber) => {
          rnNumber++;

          if(url.searchParams.get(val.QueryParam+"ID") != null)
          {
            
            const object1 = url.searchParams.get(val.QueryParam+"ID");
            
              var key = "selectedValuesPeople" + rnNumber;     
              var obj  = {};
              obj[key] = url.searchParams.get(val.QueryParam+"ID");
              this.setState(obj); 

          }
        });
      }

    }

  }

private async UpdatePopularPages( op:any,url:string){


  var item = await sp.web.lists.getByTitle("דפים פופולאריים").select("Title", "signInToPageNum", "ID").items.filter("Title eq '" 
  + op.label + "'").orderBy("Created", false).get(); 
      
  if(item.length > 0)
  {
    const i = await sp.web.lists.getByTitle("דפים פופולאריים").items.getById(item[0].ID).update({
      signInToPageNum: (item[0].signInToPageNum + 1)
    }).then(i => {
      console.log(i + " - Updated Successfully");
      window.location.href = url;
    });
  } 
  
  else{
    this.CreateItem(op.label, 1, url, op.value);
  }
  
}


private async CreateItem(title, entriesNum, url, value) {

  await sp.web.lists.getByTitle("דפים פופולאריים").items.add({

    Title:title,
    signInToPageNum: entriesNum,
    searchValue: value,
    URL: {
      "__metadata": { type: "SP.FieldUrlValue" },
      Description: title,
      Url: url
  },
  }).then(i => {
    console.log(i + " - Created Successfully");
    window.location.href = url;
  });
}





  private ClearClicked = (): void => {
    window.location.href = window.location.pathname;
  }
 
  private submitClicked = (): void => {
    
    if(!this.IsBoxesRquiredHasValue())
    {
      //alert("אין ערכים");

      return;
    }
    

    if(this.state.AcBoxSelectedOption && this.props.ShowSectionsBox)
    {
        var op:any = this.state.AcBoxSelectedOption;
        

        let url = "https://meuhedet.sharepoint.com/sites/Main/SitePages/" + op.page + ".aspx?" + op.filter + "=" +
        op.value + "&" + op.filter + "ID=" + op.Id;  


        // ** added  25-4-22 -- by itzik
        if(op.basicService == "כן")
        {
          url = "https://meuhedet.sharepoint.com/sites/Main/SitePages/" + "basicService" + ".aspx?" + op.filter + "=" +
          op.value + "&" + op.filter + "ID=" + op.Id;  
        }
                

        if(this.props.collectionUserBoxData != undefined)
        {
          let collectionUserBoxDataCount = this.props.collectionUserBoxData.length;
          let nPerson = 1;
          if (collectionUserBoxDataCount > 0) {
            this.props.collectionUserBoxData.map((val,rnNumber) => {
              //if there is value in this search box
              // var st1 = this.state["selectedValuesPeople" + (rnNumber+1)];
              if (this.state["selectedValuesPeople" + (rnNumber+1)].length > 0) 
              {
                url = url + "&";
                url = url + val.QueryParam + "=" +  encodeURIComponent(this.state["selectedValuesPeople" + (rnNumber+1)][0].displayName) + "&" + val.QueryParam + "ID=" + this.state["selectedValuesPeople" + (rnNumber+1)][0].id;
                if(collectionUserBoxDataCount > 1 && nPerson < collectionUserBoxDataCount){
                  nPerson++;
                }           
              }        
            });
          }
        }
        
        if(this.props.collectionData != undefined)
        {
          let colldataCount = this.props.collectionData.length;
          let n = 1;
          if (colldataCount > 0) {
            this.props.collectionData.map((val,rnNumber) => {              
              //if there is value in this search box
              if (this.state["selectedValues" + (rnNumber+1)].length > 0) 
              {
                url = url + "&";                
                url = url + val.QueryParam + "=" +  encodeURIComponent(this.state["selectedValues" + (rnNumber+1)][0].name) + "&" + val.QueryParam + "ID=" + this.state["selectedValues" + (rnNumber+1)][0].key;
                if(colldataCount > 1 && n < colldataCount){
                  n++;
                }           
              }        
            });
          }
        }


        if(url.length > 0){
          this.UpdatePopularPages(op,url);
          // window.location.href = url;
        }

    }
    else{
      // alert('search Regulare Search Box');
      let redirectPageUrllen = 0;
    
      if(this.props.collectionUserBoxData == undefined && this.props.collectionData == undefined){
        return;
      }
      //if user type url page 
      if(this.props.redirectPageUrl != null)
      {
        redirectPageUrllen= this.props.redirectPageUrl.length;
      }     
      
      if(this.props.collectionUserBoxData != undefined)
      {
        let collectionUserBoxDataCount = this.props.collectionUserBoxData.length;
        let nPerson = 1;
        if (collectionUserBoxDataCount > 0) {
          this.props.collectionUserBoxData.map((val,rnNumber) => {
            //if there is value in this search box
            // var st1 = this.state["selectedValuesPeople" + (rnNumber+1)];
            if (this.state["selectedValuesPeople" + (rnNumber+1)].length > 0) 
            {
              if(this._UrlBuild.length > 0)
              {
                this._UrlBuild = this._UrlBuild + "&";
              }
              //this._UrlBuild = this._UrlBuild + val.QueryParam + "ID=" + this.state["selectedValuesPeople" + (rnNumber+1)][0].id;
              
              this._UrlBuild = this._UrlBuild + val.QueryParam + "=" +  encodeURIComponent(this.state["selectedValuesPeople" + (rnNumber+1)][0].displayName) + "&" + val.QueryParam + "ID=" + this.state["selectedValuesPeople" + (rnNumber+1)][0].id;
              if(collectionUserBoxDataCount > 1 && nPerson < collectionUserBoxDataCount){
                //this._UrlBuild = this._UrlBuild + "&";
                nPerson++;
              }           
            }        
          });
        }
      }
      
      if(this.props.collectionData != undefined)
      {
        let colldataCount = this.props.collectionData.length;
        let n = 1;
        if (colldataCount > 0) {
          this.props.collectionData.map((val,rnNumber) => {
            //alert("val.QueryParam " + val.QueryParam);
            //if there is value in this search box
            if (this.state["selectedValues" + (rnNumber+1)].length > 0) 
            {
              if(this._UrlBuild.length > 0)
              {
                this._UrlBuild = this._UrlBuild + "&";
              }
              this._UrlBuild = this._UrlBuild + val.QueryParam + "=" +  encodeURIComponent(this.state["selectedValues" + (rnNumber+1)][0].name) + "&" + val.QueryParam + "ID=" + this.state["selectedValues" + (rnNumber+1)][0].key;
              if(colldataCount > 1 && n < colldataCount){
                //this._UrlBuild = this._UrlBuild + "&";
                n++;
              }           
            }        
          });
        }
      }
        
    //**29-10-22 Clalit -- Itzik --- */
    // if(this.state.KnowedgeTextFieldVal.length > 0)
    // {
    //   if(this._UrlBuild.length > 0)
    //   {        
    //     if(this.props.TextBxPrmQuery && this.state.KnowedgeTextFieldVal)
    //     {
    //           this._UrlBuild = this._UrlBuild + "&" + this.props.TextBxPrmQuery + "=" + this.state.KnowedgeTextFieldVal;
    //     }
    //   }
    //   else{
    //     this._UrlBuild =  this.props.TextBxPrmQuery + "=" + this.state.KnowedgeTextFieldVal;
    //   }
    // }
    //**END --- 29-10-22 Clalit -- Itzik --- */

      if(this._UrlBuild.length == 0 )
      {
        window.location.href = window.location.pathname ;
        return;
      }
        

      if(redirectPageUrllen == 0){
        window.location.href = window.location.pathname + "?" + this._UrlBuild;
      }
      
      if(redirectPageUrllen > 0){
        window.location.href = this.props.redirectPageUrl + "?" + this._UrlBuild;
      }
      
    }
  }

  private IsBoxesRquiredHasValue():boolean{
      let IsBoxesRquiredHasValue = true;
      
      if(this.props.collectionData)
      {
        this.props.collectionData.map((val,rnNumber) => {
          //if IsRequired True then check if searchBox Has value
          if(val.IsRequired)
          {
            var key = "selectedValues" + (rnNumber+1); 
            if(this.state[key].length  == 0)
            {
              IsBoxesRquiredHasValue = false;
              document.getElementById("KNRequriedField" + rnNumber).style.display = 'block';
            }
          }
        });
      }
      

      return IsBoxesRquiredHasValue;
  }
  public componentDidMount(){
    console.log("KnowedgeSearchBoxes - componentDidMount() " );
    this.PopulateQueryParams();
    //this.getAzureGroupId();

  }

  private _getFilterQuery(colname:string,boxNum:number):string {
    
    //filter="MyCustomer/Id eq '34'"

    var _ItemId = this.state["selectedValues" + boxNum];
    if(_ItemId.length == 0)
      return "";
    var _txtQuery = colname+"/Id eq '" + _ItemId[0].key + "'";
    return _txtQuery;
  }

  
  private _getCrossSiteListWebUrl(val:any){
    let currentWebUrl: string = this.props.context.pageContext.web.absoluteUrl;
    // if is cross site then use Cross Site URL
    if(val.ListName == "0")
    {
      currentWebUrl = val.CrossSiteListWebUrl;
    }
    return currentWebUrl;

  }

  private _getCrossSiteListGuid(val:any){
    let _listGuid: string = val.ListName;

    if(val.ListName == "0")
    {
      _listGuid = val.CrossSiteListGuid;
    }
    return _listGuid;

  }

  private _getPeoplePickerItems(items: any[]) {
    
    // console.log('Items:', items);
  }

  

  private handleCallbakGetAcBoxSelectedOption(AcBoxSelectedOption: any[]): void {
    
    if(AcBoxSelectedOption)
    {
      this.setState({AcBoxSelectedOption:AcBoxSelectedOption});
    }
    else{

      this.setState({AcBoxSelectedOption:null});
    }
  }
 
  
  
  public render(): React.ReactElement<IKnowedgeSearchBoxesProps> {
    const KnowedgeTextFieldVal = this.state.KnowedgeTextFieldVal;
    return (
      <React.Fragment>
      <div className={styles.knowedgeSearchBoxes} style={{ 
        direction: this.props.dropdowndirection == "RTL" ? "rtl" : "ltr"
        
        }}>
          

        {/* if user type columnInternalName then show control  */}
        {/* {this.props.columnInternalName && this.props.itemLimit  &&  this.props.listName && */}

        <div>
          <div className={styles.serachBoxAutoComplete}>
            
          {/* <PeoplePicker type={PersonType.any} placeholder="Select users or groups!"
                selectionChanged={this._onSelectionChanged} selectionMode="single" /> */}



           

            {this.props.collectionData &&
              this.props.collectionData.map((val,rnNumber) => {
                return (
                  <div className={styles.ListItemPickerSearchAuto} style={{ 
                    float: this.props.dropdowndirection == "RTL" ? "right" : "left"
                    
                    }}>


                    {this.props.ShowsSarchBoxTitle &&
                      <span className={styles.searchBoxTitle}>
                        {val.searchBoxTitle} 
                      </span>
                    }
                    
                    {val.cascadedByBoxNumber && val.cascadedByInternalColName &&  (val.ContentTypeID == undefined ||val.ContentTypeID.length == 0) &&
                    
                      <ListItemPicker
                      className={styles.ListItemPickerCss}
                      // listId={val.ListName}
                      listId={this._getCrossSiteListGuid(val)}
                      columnInternalName={val.ColumnFieldName}
                      keyColumnInternalName="Id"
                       //filter="MyCustomer/Id eq '34'"
                       filter={this._getFilterQuery(val.cascadedByInternalColName,val.cascadedByBoxNumber)}
                      itemLimit={1}
                      substringSearch={true}
                      enableDefaultSuggestions={true}
                      placeholder={val.serachBoxPlaceHolder}
                      //onSelectedItem = { (event) => this.setState({ [{val.QueryParam}]: event.target.value }) }
                      //onSelectedItem={this["onSelectedItem" + rnNumber+1]}
                      onSelectedItem={this.onSelectedItem.bind(this,(rnNumber+1) )  }
                      context={this.props.context}
                      suggestionsHeaderText={val.searchBoxTitle}
                      webUrl={this._getCrossSiteListWebUrl(val)}
                      defaultSelectedItems={
                        this.state["selectedValues" + (rnNumber+1)]
                      }
                      //defaultSelectedItems={[{key: 4, name: "Itzikj"}]}
                    />
                    
                   }
                   
                   {(val.cascadedByBoxNumber == undefined || val.cascadedByBoxNumber.length  == 0) && (val.cascadedByInternalColName == undefined || val.cascadedByInternalColName.length == 0) &&  (val.ContentTypeID == undefined ||val.ContentTypeID.length == 0) &&
                   
                    <ListItemPicker
                    className={styles.ListItemPickerCss}
                          // listId={val.ListName}
                          // listId="1ad8766e-27f3-4fc4-b286-2b9a66ff14f7"
                          listId={this._getCrossSiteListGuid(val)}
                          columnInternalName={val.ColumnFieldName}
                          keyColumnInternalName="Id"
                          itemLimit={1}
                          substringSearch={true}
                          placeholder={val.serachBoxPlaceHolder}
                          onSelectedItem={this.onSelectedItem.bind(this,(rnNumber+1) )  }
                          context={this.props.context}
                          suggestionsHeaderText={val.searchBoxTitle}
                          // webUrl="https://meuhedet.sharepoint.com/sites/Main"
                          webUrl={this._getCrossSiteListWebUrl(val)}
                          defaultSelectedItems={
                            this.state["selectedValues" + (rnNumber+1)]                  }
                          //defaultSelectedItems={[{key: 4, name: "Itzikj"}]}
                          enableDefaultSuggestions={true}


                        />

                        
                   }

                   {/* FilterBy ContentType */}
                   {val.cascadedByBoxNumber && val.cascadedByInternalColName && val.ContentTypeID &&
                      <ListItemPicker
                      // listId={val.ListName}
                      listId={this._getCrossSiteListGuid(val)}
                      columnInternalName={val.ColumnFieldName}
                      keyColumnInternalName="Id"
                       //filter="MyCustomer/Id eq '34'"
                       filter={this._getFilterQuery(val.cascadedByInternalColName,val.cascadedByBoxNumber) + " ContentType eq '" + val.ContentTypeID + "'"}
                      itemLimit={1}
                      substringSearch={true}
                      enableDefaultSuggestions={true}
                      placeholder={val.serachBoxPlaceHolder}
                      //onSelectedItem = { (event) => this.setState({ [{val.QueryParam}]: event.target.value }) }
                      //onSelectedItem={this["onSelectedItem" + rnNumber+1]}
                      onSelectedItem={this.onSelectedItem.bind(this,(rnNumber+1) )  }
                      context={this.props.context}  
                      suggestionsHeaderText={val.searchBoxTitle}
                      webUrl={this._getCrossSiteListWebUrl(val)}
                      defaultSelectedItems={
                        this.state["selectedValues" + (rnNumber+1)]
                      }
                      
                      //defaultSelectedItems={[{key: 4, name: "Itzikj"}]}
                    />
                    
                   }
                   
                   {(val.cascadedByBoxNumber == undefined || val.cascadedByBoxNumber.length  == 0) && (val.cascadedByInternalColName == undefined || val.cascadedByInternalColName.length == 0) && val.ContentTypeID &&
                   
                   <ListItemPicker
                        // listId={val.ListName}
                        listId={this._getCrossSiteListGuid(val)}
                        columnInternalName={val.ColumnFieldName}
                        keyColumnInternalName="Id"
                        itemLimit={1}
                        filter={" ContentType eq '" + val.ContentTypeID + "'"}
                        substringSearch={true}
                        placeholder={val.serachBoxPlaceHolder}
                        onSelectedItem={this.onSelectedItem.bind(this,(rnNumber+1) )  }
                        context={this.props.context}
                        suggestionsHeaderText={val.searchBoxTitle}
                        webUrl={this._getCrossSiteListWebUrl(val)}
                        defaultSelectedItems={
                          this.state["selectedValues" + (rnNumber+1)]                  }
                        enableDefaultSuggestions={true}
                        //defaultSelectedItems={[{key: 4, name: "Itzikj"}]}
                      />
                   }

                      <label id={"KNRequriedField" + (rnNumber)} className={styles.KNRequriedField}>{this.props.KNRequriedFieldtxt}</label>

                  </div>
                  
                );
              })}



            {this.props.collectionUserBoxData &&
                this.props.collectionUserBoxData.map((val,rnNumber) => {
                  return (
                    
                    // <div className={styles.ListItemPickerSearchAuto} style={{ float: this.props.dropdowndirection == "RTL" ? "right" : "left"  }}>
                    <div className={styles.customStyledPicker} style={{ float: this.props.dropdowndirection == "RTL" ? "right" : "left"  }}>
                      
                      {this.props.ShowsSarchBoxTitle &&
                        <span className={styles.searchBoxTitle}>  {val.SeachBoxTitle}  </span>
                    }

                 
                  </div>
                    
                  );
            })}  
          {/* Only for clalit -- 29-10-22 ** Itzik */}
          {/* Only for clalit -- 31-10-22 ** Itzik -- moved to another repository GIT- know_clalit */}
            {/* <div style={{float:this.props.dropdowndirection == "RTL" ? "right":"left",display:this.props.ShowsTextBox ? 'block':'none'}}>
              <TextField placeholder={this.props.TextBxPlaceholder} value={KnowedgeTextFieldVal} className="KnowedgeTextFieldId" 
              onChange={this.textBoxChanged} 
              />
            </div> */}


              {/* <div id="knowedgeSearchBoxesButtons" style={{marginTop:"20px",width:"100%",float:"right"}}> */}
              <div id="knowedgeSearchBoxesButtons" style={{marginTop:"20px",width:"100%",float:this.props.dropdowndirection == "RTL" ? "right":"left"}}>
                  <PrimaryButton id="KNbtnSearch" text={this.props.lblbtnSearch} className={
                  this.props.dropdowndirection == "RTL" ? styles.btnSearchRTL : styles.btnSearch              
                  } onClick={this.submitClicked}  /> 

                  <PrimaryButton id="KNbtnClear" text={this.props.lblbtnClear} className={styles.btnClear} onClick={this.ClearClicked} style={{ 
                    float: this.props.dropdowndirection == "RTL" ? "right" : "left"        }} />
              </div>

          </div>


          
          
        
        </div>
      </div>
      </React.Fragment>
    );
  }
}
