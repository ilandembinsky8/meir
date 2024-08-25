  
// import { WebPartContext } from "@microsoft/sp-webpart-base";
// import { PageContext } from "@microsoft/sp-page-context";

import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

sp.setup({
  sp: {
    baseUrl: "https://knowedge.sharepoint.com/sites/Innovation"
  }
});

export class Utils  {

  constructor() {}
  
  public async GetItems(
    listName: string,
    columns: string,
    expand: string | null,
    orderCol: string | null, 
    orderType: boolean | null, 
    filters: string | null, 
    top: number
  ): Promise<any[]> {
    try {
      let query = sp.web.lists.getByTitle(listName).items.select(columns).top(top);
  
      if (expand) {
        query = query.expand(expand);
      }

      if (orderCol && orderType !== null) {
        query = query.orderBy(orderCol, orderType);
      }
  
      if (filters) {
        query = query.filter(filters);
      }
  
      const items = await query.get();
      return items;
    } catch (e) {
      console.error('Error - get query', e);
      throw e; 
    }
  }
  
  public limitChars(text: string, num: number) {
    if(!text || !num || text.length <= num)
        return text;
    
    var newStr = "";
    var i;
    for(i=0; i<num; i++)
        newStr += text[i];
    
    return(newStr + "...");
  }

  public formatDate(dateString: string) {
   const date = new Date(dateString);

   const day = date.getUTCDate();
   const month = date.toLocaleString('he-IL', { month: 'long' });
   const dayOfWeek = date.toLocaleString('he-IL', { weekday: 'short' });
 
   return `${dayOfWeek} ${day} ב${month}`;
  }

  public OpenPopUp(url: string, width: number, height: number) {

    var _width = 600;
    var _height = 600;

    if(width != 0)
      _width = width;
    if(height != 0)
      _height = height;

    const left = (window.innerWidth - _width) / 2;
    const top = (window.innerHeight - _height) / 2;

    const popupFeatures = `width=${_width},height=${_height},left=${left},top=${top},scrollbars=yes,resizable=yes`;

    window.open(url, '_blank', popupFeatures);
  }

  public OpenTab(url: string) {
    window.open(url, '_blank');
  }

  // public DesignDate(date: string) {
  //   if(!date)
  //     return ""; //&nbsp
  //   var newDate1 = date.split("T");
  //   if(newDate1)
  //       newDate1 = date.split("T")[0];
  //   if(newDate1) {
  //       var dateSplited = newDate1.split("-");
  //       return dateSplited[2] + "-" + dateSplited[1] + "-" + dateSplited[0]; 
  //   }
  //   return ""; //&nbsp
  // }

  public IsInArray(arr: any, val: string) {
    var retVal = false;
    var i;
    for(i=0; i<arr.length;i++)
    {
      if(arr[i] == val)
        retVal = true;
    }
    return retVal;
  }
}