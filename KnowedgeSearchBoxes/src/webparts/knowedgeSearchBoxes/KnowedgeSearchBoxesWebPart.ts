import * as React from "react";
import * as ReactDom from "react-dom";
import { Version } from "@microsoft/sp-core-library";
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneDropdown,
  IPropertyPaneDropdownOption,
  PropertyPaneToggle
} from "@microsoft/sp-property-pane";

import {
  PropertyFieldCollectionData,
  CustomCollectionFieldType,
} from "@pnp/spfx-property-controls/lib/PropertyFieldCollectionData";

import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";

import * as strings from "KnowedgeSearchBoxesWebPartStrings";
import KnowedgeSearchBoxes from "./components/KnowedgeSearchBoxes";
import { IKnowedgeSearchBoxesProps } from "./components/IKnowedgeSearchBoxesProps";

import { SPService } from "./Service/SPService";
import { sp } from "@pnp/sp";

// import { ListPicker, IListPickerProps } from "@pnp/spfx-controls-react/lib/ListPicker";
// import { MSGraphClient } from '@microsoft/sp-http';
// import { Providers, SharePointProvider } from '@microsoft/mgt-spfx';


import {
  SPHttpClient,
  SPHttpClientConfiguration,
  SPHttpClientResponse,
  ODataVersion,
  ISPHttpClientConfiguration,
} from "@microsoft/sp-http";
import { IODataList } from "@microsoft/sp-odata-types";
import { ThemeSettingName } from "@uifabric/styling";
import { times } from "lodash";

export interface IKnowedgeSearchBoxesWebPartProps {
  description: string;
  listId: string;
  columnInternalName: string;
  itemLimit: number;
  searchBoxTitle: string;
  listName: string;
  listFields: string[];

  collectionData: any[];
  collectionUserBoxData:any[];
  lblbtnSearch:string;
  lblbtnClear:string;
  dropdowndirection:string;
  redirectPageUrl:string;
  ShowsSarchBoxTitle:boolean;
  ShowSectionsBox:boolean;
  KNRequriedFieldtxt:string;

  // ShowsTextBox:boolean;
  // TextBxPrmQuery:string;
  // TextBxPlaceholder:string;
  
}

export default class KnowedgeSearchBoxesWebPart extends BaseClientSideWebPart<IKnowedgeSearchBoxesWebPartProps> {
  //Drop down Property Declaration/Definition
  private lists: IPropertyPaneDropdownOption[];
  private listsContentTypes: IPropertyPaneDropdownOption[];

  //his variable determines whether the list dropdown is enabled or not. Until the web part retrieves the information about the lists available in the current site, the dropdown should be disabled.
  private listsDropdownDisabled: boolean = true;

  private _services: SPService = null;
  private _listFields: IPropertyPaneDropdownOption[] = [];
  // private graphClient: MSGraphClient;
  

  private fetchLists(url: string): Promise<any> {
    return this.context.spHttpClient
      .get(url, SPHttpClient.configurations.v1)
      .then((response: SPHttpClientResponse) => {
        if (response.ok) {
          return response.json();
        } else {
          console.log(
            "WARNING - failed to hit URL " +
              url +
              ". Error = " +
              response.statusText
          );
          return null;
        }
      });
  }

  private fetchOptions(): Promise<IPropertyPaneDropdownOption[]> {
    //rest api - retrieve all lists in current sp site
    var url =
      this.context.pageContext.web.absoluteUrl +
      `/_api/web/lists?$filter=Hidden eq false and IsCatalog eq false`;

    return this.fetchLists(url).then((response) => {
      var options: Array<IPropertyPaneDropdownOption> =
        new Array<IPropertyPaneDropdownOption>();
        
        // 14-12 this section added to show list form antoher site
        options.push({ key: "0", text: "[-CrossSiteList-]" });
      response.value.map((list: IODataList) => {
        //console.log("Found list with title = " + list.Title);
        options.push({ key: list.Id, text: list.Title });
      });

      return options;
    });
  }

  

  public async getListFields() {
    if (this.properties.listName) {
      let allFields = await this._services.getFields(this.properties.listName);
      (this._listFields as []).length = 0;
      this._listFields.push(
        ...allFields.map((field) => ({
          key: field.InternalName,
          text: field.Title,
        }))
      );
    }
  }


  public onInit(): Promise<void> {
    return super.onInit().then(_ => {
      sp.setup({ spfxContext: this.context });
  
      try {
        this.fetchOptions().then((response) => {
          console.table(response);
          this.lists = response;
          this.listsDropdownDisabled = false;
        });
      } catch (error) {
        console.error('KnowedgeSearchBoxesWebPart -Onint - An error occurred while fetching options:', error);
        // Handle
      }
      });  
    }
  

  // public onInit(): Promise<void> {  
  //   return super.onInit().then(_ => {  
  //     sp.setup({ spfxContext: this.context });
      
  //     // this._services = new SpfxService(this.context);  
      
  //     this.fetchOptions().then((response) => 
  //       {
  //         console.log(response);
  //         this.lists = response;
  //         this.listsDropdownDisabled = false;

  //       });  
      

  //   });  
  // }  


  // public onInit(): Promise<void> {
  //   // if (!Providers.globalProvider) {
  //   //   Providers.globalProvider = new SharePointProvider(this.context);
  //   // }
  //   return new Promise<void>((resolve: () => void, reject: (error: any) => void): void => {
  //     this.context.msGraphClientFactory
  //       .getClient()
  //       .then((client: MSGraphClient): void => {
  //         this.graphClient = client;
  //         resolve();
  //       }, err => reject(err));


  //       sp.setup({ spfxContext: this.context });
  //       this.fetchOptions().then((response) => 
  //       {
  //         console.log(response);
  //         this.lists = response;
  //         this.listsDropdownDisabled = false;

  //       });   
        
  //   });
  // }


  
  // public onInit(): Promise<void> {
   
  //    return super.onInit().then((_) => {
  //       sp.setup({ spfxContext: this.context });
  //       this.fetchOptions().then((response) => 
  //       {
  //         this.lists = response;
  //         this.listsDropdownDisabled = false;
  //         // now refresh the property pane, now that the promise has been resolved..
  //         //this.onDispose();
  //       });       
  //   });
  // }

  public render(): void {
    const element: React.ReactElement<IKnowedgeSearchBoxesProps> =
      React.createElement(KnowedgeSearchBoxes, {
        description: this.properties.description,
        context: this.context,
        listId: this.properties.listId,
        columnInternalName: this.properties.columnInternalName,
        itemLimit: this.properties.itemLimit,
        searchBoxTitle: this.properties.searchBoxTitle,
        listName: this.properties.listName,
        collectionData: this.properties.collectionData,
        collectionUserBoxData:this.properties.collectionUserBoxData,
        lblbtnSearch:this.properties.lblbtnSearch,
        lblbtnClear:this.properties.lblbtnClear,
        dropdowndirection:this.properties.dropdowndirection,
        redirectPageUrl:this.properties.redirectPageUrl,
        // graphClient:this.graphClient,
        ShowsSarchBoxTitle:this.properties.ShowsSarchBoxTitle,
        ShowSectionsBox:this.properties.ShowSectionsBox,
        KNRequriedFieldtxt:this.properties.KNRequriedFieldtxt,
        // ShowsTextBox:this.properties.ShowsTextBox,
        // TextBxPrmQuery:this.properties.TextBxPrmQuery,
        // TextBxPlaceholder:this.properties.TextBxPlaceholder,
        
      });

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }
  // @ts-ignore
  protected get dataVersion(): Version {
    return Version.parse("1.0");
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {  
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription,
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField("description", {
                  label: strings.DescriptionFieldLabel,
                }),
                PropertyPaneTextField("lblbtnSearch", {
                  label: strings.lblbtnSearch,
                }),
                PropertyPaneTextField("lblbtnClear", {
                  label: strings.lblbtnClear,
                }),    
                PropertyPaneDropdown('dropdowndirection', {
                  label:strings.lbldropdowndirection,
                  options: [
                    { key: 'LTR', text: 'LTR - Left to Right' },
                    { key: 'RTL', text: 'RTL = Right to Left' }
                  ]
                }),  
                PropertyPaneTextField("redirectPageUrl", {
                  label: strings.lblredirectPageUrl,
                }),
                PropertyPaneTextField("KNRequriedFieldtxt", {
                  label: strings.KNRequriedFieldlbl,
                }),


                
                PropertyPaneToggle('ShowsSarchBoxTitle', {
                  label: 'Show Search Box Title',  
                  onText: 'On',  
                  offText: 'Off',
              }),
                PropertyFieldCollectionData("collectionData", {
                  key: "collectionData",
                  label: "Collection data",
                  panelHeader: "Collection data panel header",
                  manageBtnLabel: "Manage collection data",
                  value: this.properties.collectionData,
                  enableSorting:true,
                  fields: [
                    {
                      id: "ListName",
                      title: "Select List",
                      type: CustomCollectionFieldType.dropdown,
                      options: this.lists,
                      required: true,
                    },
                    {
                      id: "ColumnFieldName",
                      title: "Column Internal Name",
                      type: CustomCollectionFieldType.string,
                      defaultValue:"Title",
                    },
                    // {
                    //   id: "ItemLimit",
                    //   title: "ItemLimit",
                    //   type: CustomCollectionFieldType.number,
                    //   required: true,
                    // },
                    {
                      id: "serachBoxPlaceHolder",
                      title: "PlaceHolder",
                      type: CustomCollectionFieldType.string,
                      required: false,
                    },
                    {
                      id: "QueryParam",
                      title: "Parameter Query Name",
                      type: CustomCollectionFieldType.string,
                      required: true,
                    },
                    {
                      id: "searchBoxTitle",
                      title: "Search Box Title",
                      type: CustomCollectionFieldType.string,
                      required: false,
                    },
                    {
                      id: "cascadedByBoxNumber",
                      title: "Cascaded By Box Number",
                      type: CustomCollectionFieldType.number,
                      required: false,
                    },
                    {
                      id: "cascadedByInternalColName",
                      title: "Cascaded By Internal Column",
                      type: CustomCollectionFieldType.string,
                      required: false,
                    },
                    {
                      id: "ContentTypeID",
                      title: "Content Type Name",
                      type: CustomCollectionFieldType.string,
                      required: false,
                    },
                    {
                      id: "CrossSiteListWebUrl",
                      title: "Cross Site Url",
                      type: CustomCollectionFieldType.string,
                      required: false,
                    },
                    {
                      id: "CrossSiteListGuid",
                      title: "Cross List Guid",
                      type: CustomCollectionFieldType.string,
                      required: false,
                    },       
                    {
                      id: "IsRequired",
                      title: "Is Required",
                      type: CustomCollectionFieldType.boolean,
                      // required: false,
                    },                
                    
                  ],
                  disabled: false,
                }),

              // use for meuhedet
              //   PropertyPaneToggle('ShowSectionsBox', {
              //     label: 'Show Section Box',  
              //     onText: 'On',  
              //     offText: 'Off',
              // }),


              ],
            },
          ],
        },
   
      ],
    };
  }
}
