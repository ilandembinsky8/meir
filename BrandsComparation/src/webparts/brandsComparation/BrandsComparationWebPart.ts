import * as React from 'react';
import * as ReactDom from 'react-dom';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'BrandsComparationWebPartStrings';
import BrandsComparation from './components/BrandsComparation';
import { IBrandsComparationProps } from './components/IBrandsComparationProps';

export interface IBrandsComparationWebPartProps {
  description: string;
}

export default class BrandsComparationWebPart extends BaseClientSideWebPart<IBrandsComparationWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IBrandsComparationProps> = React.createElement(
      BrandsComparation,
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
