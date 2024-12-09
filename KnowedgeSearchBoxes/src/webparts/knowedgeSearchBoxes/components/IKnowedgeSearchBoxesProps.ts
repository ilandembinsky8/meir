import { WebPartContext } from "@microsoft/sp-webpart-base";    
// import { MSGraphClient } from "@microsoft/sp-http";




export interface IKnowedgeSearchBoxesProps {
  description: string;
  context:WebPartContext;
  
  listId: string;  
  columnInternalName: string;  
  itemLimit: number;  
  searchBoxTitle:string;
  listName: string;

  //use for PropertyFieldCollectionData
  collectionData: any[];  
  collectionUserBoxData: any[];

  lblbtnSearch:string;
  lblbtnClear:string;
  dropdowndirection:string;
  redirectPageUrl:string;
  // graphClient: MSGraphClient;
  ShowsSarchBoxTitle:boolean;
  ShowSectionsBox:boolean;
  KNRequriedFieldtxt:string;

  // ShowsTextBox:boolean;
  // TextBxPrmQuery:string;
  // TextBxPlaceholder:string;
  
}


      