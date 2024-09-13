  
// import { WebPartContext } from "@microsoft/sp-webpart-base";
// import { PageContext } from "@microsoft/sp-page-context";

import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

sp.setup({
  sp: {
    baseUrl: "https://meir365.sharepoint.com/sites/KBMCT2"
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
  

  public async UpdateItem(listName: string, itemId: number, fieldsToUpdate: { [key: string]: any }): Promise<void> {
    try {
      await sp.web.lists.getByTitle(listName).items.getById(itemId).update(fieldsToUpdate);
      console.log(`Item with ID ${itemId} in list '${listName}' updated successfully.`);
    } catch (error) {
      console.error(`Error updating item with ID ${itemId} in list '${listName}':`, error);
      throw error; // Re-throw the error to handle it further up the chain if needed
    }
  }

  public async AddItem (data: any, listTitle: string) : Promise<void> {
    try {
      const addedItem = await sp.web.lists.getByTitle(listTitle).items.add(data);
      console.log("Added to list: ", addedItem);
    } catch (error) {
      console.error("Error adding to list", error);
    } 
 }

 public async RemoveItemFavorites(updateId: number, listName: string): Promise<void> {
  try {
    const items = await sp.web.lists.getByTitle(listName)
      .items.filter(`UpdateID eq ${updateId}`)
      .get();

    if (items.length === 0) {
      throw new Error("Item not found in favorites list.");
    }

    const itemId = items[0].Id;

    // Now, delete the item by its list item ID
    await sp.web.lists.getByTitle(listName).items.getById(itemId).delete();
    console.log(`Item with ID ${itemId} removed from list ${listName}`);
  } catch (error) {
    console.error(`Error removing item from list ${listName}:`, error);
    throw error;
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
