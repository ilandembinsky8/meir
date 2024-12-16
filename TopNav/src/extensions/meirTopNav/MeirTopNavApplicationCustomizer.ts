import * as ReactDOM from "react-dom";
import * as React from "react";

import { Log } from '@microsoft/sp-core-library';

import {
  BaseApplicationCustomizer,
  PlaceholderContent,
  PlaceholderName
} from '@microsoft/sp-application-base';

import { Dialog } from '@microsoft/sp-dialog';

import * as strings from 'MeirTopNavApplicationCustomizerStrings';

import { TopMenu } from "../../components/TopMenu";
import { ITopMenuProps } from  "../../components/ITopMenuProps";

// import { sp } from "@pnp/sp";
// import "@pnp/sp/webs";
// import "@pnp/sp/navigation";

import { getSP } from '../../pnpjsConfig/pnpjsConfig';
const LOG_SOURCE: string = 'MeirTopNavApplicationCustomizer';

/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface IMeirTopNavApplicationCustomizerProperties {
  // This is an example; replace with your own property
  testMessage: string;
}

/** A Custom Action which can be run during execution of a Client Side Application */
export default class MeirTopNavApplicationCustomizer
  extends BaseApplicationCustomizer<IMeirTopNavApplicationCustomizerProperties> {



    
    protected async onInit(): Promise<void> {
    

      await super.onInit();
  
      //Initialize our _sp object that we can then use in other packages without having to pass around the context.
      //  Check out pnpjsConfig.ts for an example of a project setup file.
      getSP(this.context);
    
  
  
      
    // public onInit(): Promise<void> {
    //   Log.info(LOG_SOURCE, `Initialized ${strings.Title}`);
      
      // sp.setup({ spfxContext: this.context });   
  
      
      let placeholder: PlaceholderContent;
      placeholder = this.context.placeholderProvider.tryCreateContent(
        PlaceholderName.Top
      )!;
      if (placeholder !== undefined) {
        if (placeholder.domElement) {
          const element: React.ReactElement<ITopMenuProps> =
            React.createElement(TopMenu, {
              context: this.context
            });
  
          // render the react element in the top placeholder.
          ReactDOM.render(element, placeholder.domElement);
        }
      }
    
  
      // if (placeholder) {
      //   if (placeholder.domElement) {
      //     const element: React.ReactElement<IClalitCustomTopNavProps> =
      //       React.createElement(ClalitCustomTopNav, {
      //         context: this.context,
      //       });
  
      //     // render the react element in the top placeholder.
      //     ReactDOM.render(element, placeholder.domElement);
      //   }
      // }
  
      return Promise.resolve();
    }
  }
  