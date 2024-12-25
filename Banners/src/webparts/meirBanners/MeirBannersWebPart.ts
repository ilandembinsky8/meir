import * as React from 'react';
import * as ReactDom from 'react-dom';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'MeirBannersWebPartStrings';
import MeirBanners from './components/MeirBanners';
import { IMeirBannersProps } from './components/IMeirBannersProps';

export interface IMeirBannersWebPartProps {
  description: string;
}

export default class MeirBannersWebPart extends BaseClientSideWebPart<IMeirBannersWebPartProps> {

 
  public render(): void {
    const element: React.ReactElement<IMeirBannersProps> = React.createElement(
      MeirBanners,
      {
        description: this.properties.description     
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
