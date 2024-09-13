import * as React from 'react';
import * as ReactDom from 'react-dom';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'MeirConversationScriptsWebPartStrings';
import MeirConversationScripts from './components/MeirConversationScripts';
import { IMeirConversationScriptsProps } from './components/IMeirConversationScriptsProps';
import { Version } from '@microsoft/sp-core-library';

export interface IMeirConversationScriptsWebPartProps {
  description: string;
}

export default class MeirConversationScriptsWebPart extends BaseClientSideWebPart<IMeirConversationScriptsWebPartProps> {

  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = '';

  public render(): void {
    const element: React.ReactElement<IMeirConversationScriptsProps> = React.createElement(
      MeirConversationScripts,
      {
        description: this.properties.description,
        isDarkTheme: this._isDarkTheme,
        environmentMessage: this._environmentMessage,
        hasTeamsContext: !!this.context.sdks.microsoftTeams,
        userDisplayName: this.context.pageContext.user.displayName
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  // @ts-ignore
  protected get dataVersion(): Version {
    return Version.parse('1.0');
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
