import * as React from "react";
//import * as $ from 'jquery';

import { ITopMenuProps } from "./ITopMenuProps";
import { ITopMenuState } from "./ITopMenuState";

import { ApplicationCustomizerContext } from "@microsoft/sp-application-base";

import { SPFI, spfi } from "@pnp/sp";
import { getSP } from "../pnpjsConfig/pnpjsConfig";

import { Caching } from "@pnp/queryable";
import { Item } from "@pnp/sp/items";

import styles from "../Styles/MeirTopNav.module.scss";
//require ('../Styles/MeirTopNav.css');
import { _Item } from "@pnp/sp/items/types";
import { DisplayMode } from "@microsoft/sp-core-library";

export class TopMenu extends React.Component<  ITopMenuProps,ITopMenuState,{}> {
  private _context: ApplicationCustomizerContext;
  private _currentWebUrl: string;
  private _sp: SPFI;
  private MENU_LIBRARY = "קישורים לניווט";
  private _linksStatus:number;//0 closed, 1 opening, 2 open, 3 closing
  private _maxLinksSize = 400;
  private _currentLinksSize = 0;
  private _perc = 0;
  private _isMouseOver = false;
  private _direction = 0;
  private _start1 = 0;
  private _end1 = -40;
  private _intr:any;
  private _loginName:string;
  private _loginId:number;

  constructor(props: ITopMenuProps) {
    super(props);

    this.state = {
      FullName:"",
      items: [],
      bigMenuFromLib: {},
      callScripts: {},
      searches: {},
      modelsAndBrands: {},
      modelsAndBrandsType: {},
      brands: {},
      brandsType: {},
      isUpdated: "",
    };
    this._handleSearchKeyDown = this._handleSearchKeyDown.bind(this);
    this._handleSearchClick = this._handleSearchClick.bind(this);
    this._UpdateSearches = this._UpdateSearches.bind(this);
    this._openCloseBigMenu = this._openCloseBigMenu.bind(this);
    this._OpenMenu = this._OpenMenu.bind(this);
    this._CloseMenu = this._CloseMenu.bind(this);
    this._OpenSearchesMenu = this._OpenSearchesMenu.bind(this);
    this._CloseSearchesMenu = this._CloseSearchesMenu.bind(this);
    
    this._context = this.props.context;
    this._currentWebUrl = this._context.pageContext.web.absoluteUrl;
    this._loginName = this._context.pageContext.user.loginName;
    this._loginId = this._context.pageContext.legacyPageContext.userId;
    //'ilande@mct.co.il'
    this._sp = getSP();
    //this._getMainNav();
    this._createModelList();
    this._createModelBrandList();
    this._readAttachments('מותגים','דגמים');
    this._getSearches('חיפושים עבור משתמש');
    this._readLinksFromList();
    //this._readFromLibrary(_bigMenuLibraryTitle);
    this._OpenMenu = this._OpenMenu.bind(this);
    //this._OpenCloseLinks = this._OpenCloseLinks.bind(this);
    this._openCloseBigMenu = this._openCloseBigMenu.bind(this);
    //this._OpenLinks = this._OpenLinks.bind(this);
    //this._CloseLinks = this._CloseLinks.bind(this);
  }

  async componentDidMount() {
    // const navLocalStorageControlItems =      await this.getNavLocalStorageControlItems();
    // if (!navLocalStorageControlItems.length) return;
    // // this.setState({ LocalStorageNavItems: navLocalStorageControlItems });
    // navLocalStorageControlItems.map((navLocalStorageItem) => {
    //   const newTopNavItems = this.state.TopNavItems.map((navItem) => {
    //     if (navLocalStorageItem.Title === navItem.Title) {
    //       navItem.Url = navLocalStorageItem.Url;
    //       navItem.localStorageParam = navLocalStorageItem.LocalStorageParam;
    //     }
    //   });
    // });
  }

  private _getMainNav = async (): Promise<void> => {
    try {
      const response: any[] = await this._sp.web.navigation.quicklaunch();

      const items: any[] = await Promise.all(response.map(async (item: any, index: number) => {
        return {
          Id: item.Id,
          Title: item.Title || "Unknown",
          Url: item.Url || "Unknown",
          Children: await this._getNavChildren(item.Id),
          HtmlId: 'm'+index,
        };
      }));

      this.setState({ items });
    }catch (err) {
    //Logger.write(`${this.LOG_SOURCE} (_readAllFilesSize) - ${JSON.stringify(err)} - `, LogLevel.Error);
    }
  }

  private _getNavChildren = async (id: number): Promise<any[]>  => {
    try {
      const children = await this._sp?.web.navigation.quicklaunch.getById(id).children();
      return children;
    } catch (err) {
      //Logger.write(`${this.LOG_SOURCE} (_readAllFilesSize) - ${JSON.stringify(err)} - `, LogLevel.Error);
      return [];
    }
  }

  

  private async _fetchAttachments(itemId: number, listName: string): Promise<string[]> {
    const siteURL = "KBMCT2";
    const endpoint = `/sites/${siteURL}/_api/web/lists/getbytitle('${listName}')/items(${itemId})/AttachmentFiles`;

    try {
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Accept': 'application/json;odata=verbose',
        },
      });
      const data = await response.json();
      return data.d.results.map((attachment: { ServerRelativeUrl: string }) => attachment.ServerRelativeUrl);
    } catch (error) {
      console.error(`Error fetching attachments from list "${listName}"`, error);
      return [];
    }
  }

  private _readAttachments = async (brandsListName: string, modelsListName: string): Promise<any> => {
    //debugger;
    try {
      const _brands = this.state.brands;


      const spCache = spfi(this._sp).using(Caching({ store: "session" }));
      const brandsListContent: any[] = await spCache.web.lists
        .getByTitle(brandsListName)
        .items
        .select("Id", "Title", "Attachments")
        .expand("AttachmentFiles")();
      const modelsListContent: any[] = await spCache.web.lists
        .getByTitle(modelsListName)
        .items
        .select("Id", "Title", "Attachments", "BrandId")
        .expand("AttachmentFiles")();

      //const modelsList = await spCache.web.lists.getByTitle(modelsListName).items();
      //const _entityTypeName = list.EntityTypeName;

      const callScripts: { [key: string]: any[] } = {};
      for (let item of brandsListContent) {
        //var _attachments = await this._fetchAttachments(item.Id, listName);
        var _attachments = item.AttachmentFiles;
        if (_attachments != null && _attachments != undefined && _attachments?.length > 0) {
            const _filteredAttachments = _attachments.filter((attachment:any) => attachment.FileName.indexOf('.doc') > -1 || attachment.FileName.indexOf('.pdf') > -1);
            if (_filteredAttachments !== null && _filteredAttachments !== undefined && _filteredAttachments.length > 0) {
              callScripts[item.Title] = _filteredAttachments;
            }
          }
        } 
     for (let item of modelsListContent) {
      //var _attachments = await this._fetchAttachments(item.Id, listName);
      var _attachments = item.AttachmentFiles;
      const brandName = Object.keys(_brands)?.map(key => _brands[key])?.filter((brand: any) => brand.id === item.BrandId)[0]?.Title;
      if (_attachments != null && _attachments != undefined && _attachments?.length > 0) {
        if (brandName === 'Unknown' || brandName === null || brandName === undefined) {
          callScripts[item.Title] = _attachments;
        } else {
          callScripts[item.Title] = _attachments;
        }
      }
      }
      this.setState({ callScripts });
      console.log('** callScripts: ' + this.state.callScripts);
    } catch (err) {
      //Logger.write(`${this.LOG_SOURCE} (_readAllFilesSize) - ${JSON.stringify(err)} - `, LogLevel.Error);
    }
  }

  private _UpdateSearches = async (listName: string): Promise<void> => {
    //debugger;
    const searchInput = document.getElementById("searchInput") as HTMLInputElement;
    const value: any = searchInput?.value;

    // update searches state for the user
    const searches:   { [key: string]: any[] } = {};
    const sortedKeys = Object.keys(this.state.searches).sort((a, b) => parseInt(a) - parseInt(b));
    let searchExists = false;
    let searchKey = -1;
    let maxKey = -1;
    for (let key in this.state.searches) {
      if (parseInt(key) > maxKey) {
        maxKey = parseInt(key);
      }
      if (this.state.searches[key] === value) {
        searchExists = true;
        searchKey = parseInt(key);
      }
    }
    if (!searchExists) {
      if (maxKey > 4) {
        searches[1] = value;
        for (let i = 2; i < 5; i++) {
          searches[i] = this.state.searches[sortedKeys[i]];
        }
      } else {
        searches[1] = value;
        for (let i = 1; i < sortedKeys.length; i++) {
          searches[i+1] = this.state.searches[sortedKeys[i]];
        }
      }
    } else {
      if (this.state.searches[1] !== value)
      {
        for (let i = 0; i < sortedKeys.length; i++) {
          searches[i+1] = this.state.searches[sortedKeys[i]];
        }
        let temp = searches[1];
        searches[1] = value;
        searches[searchKey] = temp;
      } else {
        for (let i = 0; i < sortedKeys.length; i++) {
          searches[i+1] = this.state.searches[sortedKeys[i]];
        }
      }
    }

    this.setState({ searches });

    // delete all searches for the user
    try {
      const spCache = spfi(this._sp).using(Caching({ store: "session" }));
      
      // const listContent: any[] = await spCache.web.lists
      //   .getByTitle(listName)
      //   .items
      //   .select("Id", "Title", "AuthorId", "SearchType", "EntriesNumber")();

      const items = await spCache.web.lists
      .getByTitle(listName)
      .items.filter(`AuthorId eq ${this._loginId}`)
      .select("Id")();

      //const list = await spCache.web.lists.getByTitle(listName).items();
      //const _entityTypeName = list.EntityTypeName;
      //debugger;
      // for (let item of listContent) {
      //   if (item.AuthorId === this._loginId) {
      //     await spCache.web.lists.getByTitle(listName).items.getById(item.Id).delete();
      //   }
      // }

      // Iterate through the items and delete them
      for (const item of items) {
        await spCache.web.lists.getByTitle(listName).items.getById(item.Id).delete();
        console.log(`Deleted item with ID: ${item.Id}`);
      }

    } catch (err) {
      //debugger;
      console.log(err);
      //Logger.write(`${this.LOG_SOURCE} (_readAllFilesSize) - ${JSON.stringify(err)} - `, LogLevel.Error);
    }

    // create new searches for the user
    try {
      const spCache = spfi(this._sp).using(Caching({ store: "session" }));
      
      for (let key in searches) {
        await spCache.web.lists.getByTitle(listName).items.add({
          Title: searches[key],
          AuthorId: this._loginId,
          SearchType: "User",
          EntriesNumber: key,
        });
      }
    } catch (err) {
      //Logger.write(`${this.LOG_SOURCE} (_readAllFilesSize) - ${JSON.stringify(err)} - `, LogLevel.Error);
    }
  }

  private _createModelList = async (): Promise<void> => {
    const listName = 'מותגים';
    try {
      const spCache = spfi(this._sp).using(Caching({ store: "session" }));
      
      const listContent: any[] = await spCache.web.lists
        .getByTitle(listName)
        .items
        .select("Id", "Title")();

      //const list = await spCache.web.lists.getByTitle(listName).items();
      const brands:   { [key: string]: any } = {};
     for (let item of listContent) {
        let link = "Brand.aspx?Brand=" + item.Title + "&BrandID=" + item.Id;
        brands[item.Title] = {"link":link, id:item.Id, Title:item.Title};
      }
      this.setState({ brands });
      //debugger;
      console.log('** searches: ' + this.state.searches);
    } catch (err) {
      //debugger;
      console.log(err);
    }
  }

  private _createModelBrandList = async (): Promise<void> => {
    const listName = 'דגמים';

    try {
      const spCache = spfi(this._sp).using(Caching({ store: "session" }));
      
      const listContent: any[] = await spCache.web.lists
        .getByTitle(listName)
        .items
        .select("Id", "BrandId", "Title", "modelPageLink", "ModelDescription", )();//, "Title", "AuthorId", "SearchType", "EntriesNumber")();

      const list = await spCache.web.lists.getByTitle(listName).items();
      const modelsAndBrands:   { [key: string]: any[] } = {};
     for (let item of listContent) {
        let link = item.modelPageLink.substring(listContent[0].modelPageLink.indexOf("href=\"")+4);
        link = link.substring(0, link.indexOf("\""))
        modelsAndBrands[item.Title] = link;
      }
      this.setState({ modelsAndBrands });
      //debugger;
      console.log('** searches: ' + this.state.searches);
    } catch (err) {
      //debugger;
      console.log(err);
    }
  }

  private _getSearches = async (listName: string): Promise<any> => {
    try {
      const spCache = spfi(this._sp).using(Caching({ store: "session" }));
      
      const listContent: any[] = await spCache.web.lists
        .getByTitle(listName)
        .items
        .select("Id", "Title", "AuthorId", "SearchType", "EntriesNumber")();

      //const list = await spCache.web.lists.getByTitle(listName).items();
      //const _entityTypeName = list.EntityTypeName;
      //debugger;
      const searches:   { [key: string]: any[] } = {};
     for (let item of listContent) {
        if (item.AuthorId === this._loginId) {
          searches[item.EntriesNumber] = item.Title;
        }
      }
      this.setState({ searches });
      //debugger;
      console.log('** searches: ' + this.state.searches);
    } catch (err) {
      //Logger.write(`${this.LOG_SOURCE} (_readAllFilesSize) - ${JSON.stringify(err)} - `, LogLevel.Error);
    }
  }

  private _readFromLibrary = async (libraryTitle:string): Promise<void> => {
    try {
      const spCache = spfi(this._sp).using(Caching({ store: "session" }));
      
      const libraryContent: any[] = await spCache.web.lists
        .getByTitle(libraryTitle)
        .items
        .select("Id", "Title","FileLeafRef", "FileRef")();

        const library = await spCache.web.lists.getByTitle(libraryTitle)();
        const _entityTypeName = library.EntityTypeName;

      const bigMenuFromLib: { [key: string]: any[] } = {};
      for (let item of libraryContent) {
        const fileName = item.FileLeafRef;
        const fileUrl = item.FileRef;
        const folderName = fileUrl.replace(`/${fileName}`, '')
        const shortFileName = fileName.substring(fileName.lastIndexOf('/') + 1);
        let shortFolderName = folderName.substring(folderName.lastIndexOf('/') + 1);
        if (_entityTypeName === shortFolderName){
          shortFolderName = 'Folders';
        }
  
        if (!bigMenuFromLib[shortFolderName]) {
          bigMenuFromLib[shortFolderName] = [];
        }
        const fileItem = {
          fileName: '',
          fileUrl: ''
        };
        fileItem.fileName = shortFileName;
        fileItem.fileUrl = fileUrl;
        bigMenuFromLib[shortFolderName].push(fileItem);
      }
      this.setState({ bigMenuFromLib });
      console.log('** bigMenuFromLib: ' + this.state.bigMenuFromLib);
    } catch (err) {
      //Logger.write(`${this.LOG_SOURCE} (_readAllFilesSize) - ${JSON.stringify(err)} - `, LogLevel.Error);
    }
  }

  private _readLinksFromList = async (): Promise<void> => {
    //debugger;
    try {
      //  debugger;
      // do PnP JS query, some notes:
      //   - .expand() method will retrive Item.File item but only Length property
      //   - .get() always returns a promise
      //   - await resolves proimises making your code act syncronous, ergo Promise<IResponseItem[]> becomes IResponse[]

      //Extending our sp object to include caching behavior, this modification will add caching to the sp object itself
      //this._sp.using(Caching("session"));

      //Creating a new sp object to include caching behavior. This way our original object is unchanged.
      const spCache = spfi(this._sp).using(Caching({ store: "session" }));
      
      const response: any[] = await spCache.web.lists
        .getByTitle(this.MENU_LIBRARY)
        .items();
        //.select("Id", "Title")();

      // use map to convert IResponseItem[] into our internal object IFile[]
      const items: any[] = response.map((item: any) => {
        return {
          // Id: item.field_5,
          // Level: item.field_3 || "Unknown",
          // Display: item.field_2 || "Unknown",
          // Title: item.Title || "Unknown",
          // Parent: item.field_7 || "Unknown",
          // Order: item.field_6 || "Unknown",
          // Url: item.field_4 || "Unknown",
          // Image: item.field_1 || "Unknown",
          // Library: item.field_8  || "Unknown",
          Id: item.Index,
          Level: item.Level || "Unknown",
          Display: item.Display || "Unknown",
          Title: item.Title || "Unknown",
          Parent: item.Parent || "Unknown",
          Order: item.Order || "Unknown",
          Url: item.URLStr || "Unknown",
          Image: item.Picture1 || "Unknown",
          Library: item.Library  || "Unknown",
        };
      });
      
      for (let i = 0; i < items.length; i++) {
        items[i].Children = items.filter((item:any)=> item.Parent === items[i].Id);
      }
 
      // Add the items to the state
      this.setState({ items });
      //debugger;
      const _bigMenuLibraryTitle = items.filter((item:any)=> item.Library !== 'Unknown')[0].Library;
      //this._readFromLibrary(_bigMenuLibraryTitle);
    } catch (err) {
      //Logger.write(`${this.LOG_SOURCE} (_readAllFilesSize) - ${JSON.stringify(err)} - `, LogLevel.Error);
    }
  }
 
    private async _UpdateFullname()
    {
      //this.setState({FullName:"Ido Viron"});
      //await this._readAllFilesSize();
      //console.log(items);

    }

  private _innerMenu(x:string) {
      const _bigMenuFromLib = this.state.bigMenuFromLib;
      var _thePart = 1;
      const _rightBigMenu = document.getElementById("rightBigMenu")
      for (let i = 0; i < _bigMenuFromLib['Folders'].length; i++) {
          document.getElementById("bm" + i + "")?.classList.remove("selected");
          document.getElementById("bm" + i + "")?.classList.remove("selected_"+_rightBigMenu?.classList[0].split("_")[1]);
      }
      document.getElementById("bm" + x + "")?.classList.add("selected_"+_rightBigMenu?.classList[0].split("_")[1]);
      let s = "";
      for (let i = 1; i <= 3; i++) {
          const _part_i = document.getElementById("part" + i + "")
          if (_part_i !== null) {_part_i.innerHTML = "";}
      }
      for (let i = 0; i < _bigMenuFromLib[x].length; i++) {
          let j = i + 1;
          s = s + "<a href='"+_bigMenuFromLib[x][i].fileUrl +"?web=1' target='_blank'>" + _bigMenuFromLib[x][i].fileName + "</a>";//class='oneItem'
          if (j % 11 == 0) {
              const part_thePart = document.getElementById("part" + _thePart + "");
              if (part_thePart !== null) {part_thePart.innerHTML = s;}
              let _part_thePartChildren = part_thePart?.children;
              if (_part_thePartChildren !== null && _part_thePartChildren !== undefined) {
                for (let i = 0; i < _part_thePartChildren.length; i++) {
                  //_part_thePartChildren[i].addEventListener("mouseover", () => this._innerMenu(i));
                  _part_thePartChildren[i].classList.add("oneItem_"+part_thePart?.classList[0].split("_")[1]);
                }
              }
              s = "";
              _thePart++;
          }
      }
      const part_thePart_ = document.getElementById("part" + _thePart + "");
      if (part_thePart_ !== null) {
        part_thePart_.innerHTML = s;
        let _part_thePart_Children = part_thePart_?.children;
        if (_part_thePart_Children !== null && _part_thePart_Children !== undefined) {
          for (let i = 0; i < _part_thePart_Children.length; i++) {
            //_part_thePartChildren[i].addEventListener("mouseover", () => this._innerMenu(i));
            _part_thePart_Children[i].classList.add("oneItem_"+part_thePart_?.classList[0].split("_")[1]);
          }
        }
      }
  }

  private _openCloseBigMenu() {
    const _bigMenuFromLib = this.state.bigMenuFromLib;
      let s = "";
      for (let i = 0; i < _bigMenuFromLib['Folders'].length; i++) {
          s = s + "<div id='bm"+i+"'>"+_bigMenuFromLib['Folders'][i].fileName+"</div>";//onmouseover='this._innerMenu("+i+")'class='oneItem'
      }
      const _rightBigMenu = document.getElementById("rightBigMenu");
      if (_rightBigMenu !== null) {_rightBigMenu.innerHTML = s;}
      let _rightBigMenuChildren = _rightBigMenu?.children;
      if (_rightBigMenuChildren !== null && _rightBigMenuChildren !== undefined) {
        //debugger;
        for (let i = 0; i < _rightBigMenuChildren.length; i++) {
          _rightBigMenuChildren[i].addEventListener("mouseover", () => this._innerMenu(_bigMenuFromLib['Folders'][i].fileName));
          _rightBigMenuChildren[i].classList.add("oneItem_"+_rightBigMenu?.classList[0].split("_")[1]);
        }
      }
      
      for (let i = 1; i <= 3; i++) {
          const _part_i = document.getElementById("part" + i + "");
          if (_part_i !== null) {_part_i.innerHTML = "";}
      }
      //$("#subMenuBig").slideToggle(1000);
  }

  private _closeBigMenu() {
      //$("#subMenuBig").slideUp(0);
  }

    private _OpenMenu(id:string) {
      this._CloseMenu();
      this._CloseSearchesMenu();
      console.log('open');
      const _Items:any = this.state.items;
      const _Scripts:any = this.state.callScripts;
      const submenu = document.getElementById("subMenu");
      this._closeBigMenu();
      //if (submenu !== null && submenu !== undefined) {submenu.style.display = "none"};
      const x = document.getElementById(id);
      let y = 0;
      if (x !== null && x !== undefined) {y =x.offsetLeft - 80;}      
      for (let i = 0; i < _Items.length; i++) {
          //if (_Items[i].HtmlId === id) {
            if ('m' + _Items[i].Id === id) {
              if (_Items[i].Title === 'תסריטי שיחה') {
                debugger;//////////////////////////////////////////////////////////////////
                const _ScriptsKeys:string[] = Object.keys(_Scripts);
                let s = "";
                
                if (_ScriptsKeys !== null && _ScriptsKeys !== undefined && _ScriptsKeys.length > 0) {
                for (let j = 0; j < _ScriptsKeys.length; j++) {
                    if (_Scripts[_ScriptsKeys[j]] !== null){
                      s = s + "<a href='"+ _Scripts[_ScriptsKeys[j]][0].ServerRelativeUrl +"?web=1' target='_blank' style='float:left;width:100%;height:40px;border-bottom:1px solid #D2D8DF'>" + _ScriptsKeys[j] + "</div>"
                    } else {
                      //s = s + "<div style='float:left;width:100%;height:40px;border-bottom:1px solid #D2D8DF'>" + _Items[i].Children[j].Title + "</div>"
                    }     
                }
                if (submenu !== null && submenu !== undefined && y !== null && y !== undefined) {
                  submenu.innerHTML = s;
                  submenu.style.left = y + "px";
                  submenu.style.display = "inline";
                };
              }
              } else if (_Items[i].Title === 'מותגים') {
                let s = "";
                for (let key in this.state.brands) {
                    if (this.state.brands[key].link !== null && this.state.brands[key].link !== undefined && this.state.brands[key].link !== '' && this.state.brands[key].link !== 'http://linkless.header/') {
                      s = s + "<a href='"+ this.state.brands[key].link +"' style='float:left;width:100%;height:40px;border-bottom:1px solid #D2D8DF'>" + this.state.brands[key].Title + "</a>"
                    } else {
                      s = s + "<div style='float:left;width:100%;height:40px;border-bottom:1px solid #D2D8DF'>" + this.state.brands[key].Title + "</div>"
                    }     
                }
                if (submenu !== null && submenu !== undefined && y !== null && y !== undefined) {
                  submenu.innerHTML = s;
                  submenu.style.left = y + "px";
                  submenu.style.display = "inline";
                };
              } else {
                let s = "";
                if (_Items[i].Children === null || _Items[i].Children === undefined || _Items[i].Children.length > 0) {
                for (let j = 0; j < _Items[i].Children.length; j++) {
                    if (_Items[i].Children[j].Url !== null && _Items[i].Children[j].Url !== undefined && _Items[i].Children[j].Url !== '' && _Items[i].Children[j].Url !== 'http://linkless.header/') {
                      s = s + "<a href='"+ _Items[i].Children[j].Url +"' style='float:left;width:100%;height:40px;border-bottom:1px solid #D2D8DF'>" + _Items[i].Children[j].Title + "</a>"
                    } else {
                      s = s + "<div style='float:left;width:100%;height:40px;border-bottom:1px solid #D2D8DF'>" + _Items[i].Children[j].Title + "</div>"
                    }     
                }
                if (submenu !== null && submenu !== undefined && y !== null && y !== undefined) {
                  submenu.innerHTML = s;
                  submenu.style.left = y + "px";
                  submenu.style.display = "inline";
                };
              }
            }
          }
      }
    }
    private _CloseMenu() {
      console.log('close');
      const element = document.getElementById("subMenu");
      if (element !== null) {
        element.style.display = "none";
      }
    }

    private _handleSearchClick() {
      const searchInput = document.getElementById("searchInput") as HTMLInputElement;
        const value: any = searchInput?.value;
        if (value !== null && value !== undefined && value !== '') {
          for (let key in this.state.modelsAndBrands) {
            if (key.toLowerCase().indexOf(value.toLowerCase()) > -1) {
              window.open(this.state.modelsAndBrands[key].toString(), '_blank');
              return;
            }
          }
        }
    }

    private _handleSearchKeyDown(event: React.ChangeEvent<HTMLInputElement>) {
      //if (event.code !== 'Enter' && event.code !== 'NumpadEnter') {
        //this._UpdateSearches('חיפושים עבור משתמש');
        const modelsAndBrandsType:   { [key: string]: any[] } = {};
        const brandsType:   { [key: string]: any[] } = {};
        //const searchInput = document.getElementById("searchInput") as HTMLInputElement;
        //const value: any = searchInput?.value;
        //alert(event.target.value);
        for (let key in this.state.modelsAndBrands) {
          if (key.toLowerCase().indexOf(event.target.value.toLowerCase()) > -1) {
            modelsAndBrandsType[key] = this.state.modelsAndBrands[key];
          }
        }
        
        this.setState({ modelsAndBrandsType });

        for (let key in this.state.brands) {
          if (key.toLowerCase().indexOf(event.target.value.toLowerCase()) > -1) {
            brandsType[key] = this.state.brands[key];
          }
        }
        
        this.setState({ brandsType });
        let isUpdated:string = this.state.isUpdated;
         isUpdated += "1";
         if (isUpdated.length > 10) {isUpdated = "1";}
         this.setState ({isUpdated});
        this._OpenSearchesMenuType();
      //} else {
        // const searchInput = document.getElementById("searchInput") as HTMLInputElement;
        // const value: any = searchInput?.value;
        // if (value !== null && value !== undefined && value !== '') {
        //   for (let key in this.state.modelsAndBrands) {
        //     if (key.toLowerCase().indexOf(value.toLowerCase()) > -1) {
        //       window.open(this.state.modelsAndBrands[key].toString(), '_blank');
        //       return;
        //     }
        //   }
        // }
        
      //}
    }

    private _OpenSearchesMenu() {
        this._CloseSearchesMenu();

        const searchInput = document.getElementById("searchInput") as HTMLInputElement;
        const value: any = searchInput?.value;
        // all models in menu
        if (value === null || value === undefined || value === '') {
          const searchesMenu = document.getElementById("searchesMenu");
        //  this._closeBigMenu();
        //  if (searchesMenu !== null && searchesMenu !== undefined) {searchesMenu.style.display = "none"};
        //  const _brandsAndModels = this.state.modelsAndBrands;
        //  let s = "";
        //  for (let _key in _brandsAndModels) {
        //  if (_brandsAndModels[_key] != null) {
        //    s = s + "<a href='"+ _brandsAndModels[_key] +"' target='_blank' style='float:left;width:100%;height:40px;border-bottom:1px solid #D2D8DF'>" + _key + "</div>"
        //  }
        //  }

          const _searches = this.state.searches;
          let s = "";
          
          for (let _key in _searches) {
            if (_searches[_key] != null) {
              let s_href = _searches[_key].toString();
              s = s + "<a href='"+ s_href +"' target='_blank' style='float:left;width:100%;height:40px;border-bottom:1px solid #D2D8DF'>" + _searches[_key] + "</div>"
            }
          }
            if (searchesMenu !== null && searchesMenu !== undefined) {
            searchesMenu.innerHTML = s;
          //submenu.style.left = y + "px";
          searchesMenu.style.display = "inline";
          }
        } else {
          const modelsAndBrandsType:   { [key: string]: any[] } = {}; 
          for (let key in this.state.modelsAndBrands) {
          if (key.toLowerCase().indexOf(value.toLowerCase()) > -1) {
            modelsAndBrandsType[key] = this.state.modelsAndBrands[key];
          }
        }
        
        this.setState({ modelsAndBrandsType });

        const brandsType:   { [key: string]: any[] } = {}; 
          for (let key in this.state.brands) {
          if (key.toLowerCase().indexOf(value.toLowerCase()) > -1) {
            brandsType[key] = this.state.brands[key];
          }
        }
        
        this.setState({ brandsType });
          this._OpenSearchesMenuType();
        }
    }

    private _OpenSearchesMenuType() {
      this._CloseSearchesMenu();
       const searchesMenu = document.getElementById("searchesMenu");
       this._closeBigMenu();
       if (searchesMenu !== null && searchesMenu !== undefined) {searchesMenu.style.display = "none"};
       const _brands = this.state.brands;
       const _brandsAndModelsType = this.state.modelsAndBrandsType;
       const _brandsType = this.state.brandsType;
       let s = "";
       for (let _key in _brandsType) {
        if (_brandsType[_key] != null) {
          s = s + "<a href='"+ _brandsType[_key] +"' target='_blank' style='float:left;width:100%;height:40px;border-bottom:1px solid #D2D8DF'>" + _key + "</div>"
        }
        }
      
       for (let _key in _brandsAndModelsType) {
       if (_brandsAndModelsType[_key] != null) {
         s = s + "<a href='"+ _brandsAndModelsType[_key] +"' target='_blank' style='float:left;width:100%;height:40px;border-bottom:1px solid #D2D8DF'>" + _key + "</div>"
       }
       }
        if (searchesMenu !== null && searchesMenu !== undefined) {
         searchesMenu.innerHTML = s;
         let isUpdated:string = this.state.isUpdated;
         isUpdated += "1";
         if (isUpdated.length > 10) {isUpdated = "1";}
         this.setState ({isUpdated});
       //submenu.style.left = y + "px";
       searchesMenu.style.display = "inline";
       }
  }

    private _CloseSearchesMenu() {
      const element = document.getElementById("searchesMenu");
      if (element !== null) {
        element.style.display = "none";
      }
    }
    
  //   private _OpenLinks() {
  //     //alert('o' + this.state.LinkMenuStatus)
  //     const _arrow_right = require('../assets/arrow_right.png');
  //     if (this._currentLinksSize >= this._maxLinksSize) {
  //         clearInterval(this._intr);
  //         const _ql13 = document.getElementById("ql3");
  //         if (_ql13 !== null) {_ql13.style.display = "inline";}
  //         const _ql14 = document.getElementById("ql4");
  //         if (_ql14 !== null) {_ql14.style.backgroundImage = "url('"+_arrow_right+"')";}
  //         //const LinkMenuStatus:number = 16;
  //         //this.setState({ LinkMenuStatus });
  //     }
  //     else {
  //         this._currentLinksSize += 10;
  //         const _ql12 = document.getElementById("ql2");
  //         if (_ql12 !== null) {_ql12.style.width = this._currentLinksSize + "px";}
  //         const _ql13 = document.getElementById("ql1");
  //         if (_ql13 !== null) {_ql13.style.width = (190 + this._currentLinksSize) + "px";}
  //     }
  // }

  // private _CloseLinks() {
  //   //alert('c' + this.state.LinkMenuStatus);
  //     if (this._currentLinksSize >= this._maxLinksSize) {
  //         const _ql13 = document.getElementById("ql3");
  //         if (_ql13 !== null) {_ql13.style.display = "none";}
          
  //     }
  //     if (this._currentLinksSize <= 0) {
  //       const _arrow_left = require('../assets/arrow_left.svg');
  //         clearInterval(this._intr);
  //         //const LinkMenuStatus:number = 18;
  //         //this.setState({ LinkMenuStatus });
  //         const _ql14 = document.getElementById("ql4");
  //         if (_ql14 !== null) {_ql14.style.backgroundImage = "url('"+_arrow_left+"')";}
  //         const _ql13 = document.getElementById("ql3")
  //         if (_ql13 !== null) {_ql13.style.display = "none";}
  //     }
  //     else {
  //         this._currentLinksSize -= 10;
  //         const _ql12 = document.getElementById("ql2");
  //         if (_ql12 !== null) {_ql12.style.width = this._currentLinksSize + "px";}
  //         const _ql11 = document.getElementById("ql1");
  //         if (_ql11 !== null) {_ql11.style.width = (190 + this._currentLinksSize) + "px";}
  //     }
  // }

  //   private _OpenCloseLinks() {
  //     //const _LinkMenuStatus:number = this.state.LinkMenuStatus;
  //     //_linksStatus : 0 closed, 1 opening, 2 open, 3 closing
  //     //if (_LinkMenuStatus == 2) {
  //     if (this._currentLinksSize >= this._maxLinksSize) {
  //       //const LinkMenuStatus:number = 3;
  //       //this.setState({ LinkMenuStatus });
  //       this._intr = setInterval(this._CloseLinks, 1);
  //     }
  //     else if (this._currentLinksSize <= 0) {
  //       //const LinkMenuStatus:number = 1;
  //       //this.setState({ LinkMenuStatus });
  //       this._intr = setInterval(this._OpenLinks, 1);
  //     }
  // }

  public render(): React.ReactElement<ITopMenuProps> {
    //const _TopNavLinkColl = this._BuildTopNavLinkColl();
    // const _webInfo = this._getWebTitle();
    const _FullName = this.state.FullName;
    const _Items:any = this.state.items;
    //if (item.Url === null || item.Url === undefined || item.Url === '' || item.Url === 'http://linkless.header/') {
    const _openMenuMethod = this._OpenMenu;
    const _openCloseBigMenuMethod = this._openCloseBigMenu;
    const _href = document.location.href;
    const _showQuickLinks = ((_href.indexOf('SitePages') > 0 && _href.indexOf('Form') < 0) || _href === this._currentWebUrl || _href === this._currentWebUrl+'/') ? 'block' : 'none';
    return (
    
    <div>
      <section className={styles.theMenu}>
      <div className={styles.logoArea}>
        <div className={styles.r100}>
        <img src={require('../assets/logo.svg')} />
            </div>
          <div className={styles.slogen}>
                מערכת ניהול ידע עבור TELEMEETING
        </div>
      </div>
      <div className={styles.menuItems}>
        
      {_Items.filter((item:any)=> item.Title !== 'Unknown' && item.Display.indexOf('תפריט ראשי') > -1 &&(item.Parent === null || item.Parent === 'Unknown')).map(function(item:any, i:number){ 
          return ( 
            <div>
            {
            ((item.Children !== null && item.Children !== undefined && item.Children.length > 0) || (item.Title === 'תסריטי שיחה'))?
            <div id={'m'+ item.Id} onMouseOver={()=>_openMenuMethod('m'+ item.Id)} onMouseLeave={()=>this._CloseMenu()} className={styles.item + ' ' + styles.arrow}>
                {item.Title}
            </div>
            :
            (item.Url === null || item.Url === undefined || item.Url === 'Unknown' || item.Url === 'http://linkless.header/')?(
              <div id={'m'+ item.Id} onMouseOver={()=>_openMenuMethod('m'+ item.Id)} className={styles.item}>
                {item.Title}
              </div>
            ):(
              <a href={item.Url} id={'m'+ item.Id} onMouseOver={()=>_openMenuMethod('m'+ item.Id)} className={styles.item}>
                {item.Title}
            </a>
            )
            }
            </div>
            ); 
            })}
        </div>
        <div id="subMenu" className={styles.subMenu} onMouseLeave={()=>this._CloseMenu()}></div>
        <div className={styles.searchArea}>
            <div className={styles.inner}>
                <div className={styles.magnify} onClick={()=>this._handleSearchClick()}></div>
                <div className={styles.input} onChange={this._handleSearchKeyDown} onClick={()=>this._OpenSearchesMenu()}>
                    <input id="searchInput" type="text" />
                </div>
            </div>
            <div id="searchesMenu" className={styles.searchesMenu} onClick={()=>this._OpenSearchesMenu()} onMouseLeave={()=>this._CloseSearchesMenu()}>
              isUpdated: {this.state.isUpdated}
            </div>
        </div>
    </section>
    </div>




    );
  }
}
{/* */}