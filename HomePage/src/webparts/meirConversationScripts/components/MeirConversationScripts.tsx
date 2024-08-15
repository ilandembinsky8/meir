import * as React from 'react';
import styles from './MeirConversationScripts.module.scss';
import { IMeirConversationScriptsProps } from './IMeirConversationScriptsProps';

const siteURL = "Meir-Demo"; //KBMCT1

export default class MeirConversationScripts extends React.Component<IMeirConversationScriptsProps, { selectedOption: string }> {
  constructor(props: IMeirConversationScriptsProps) {
    super(props);
    this.state = {
      selectedOption: '' // Empty string to indicate no option has been selected yet
    };
  }

  private handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    this.setState({ selectedOption: event.target.value });
  }

  public render(): React.ReactElement<IMeirConversationScriptsProps> {
    const options = ['NIU', 'Segway-Ninebot', 'Volvo Selekt','רנו משאיות','פולסטאר'];

    return (
      <section className={styles.meirConversationScripts}>
        <div className={styles.updateArea}>
          <div className={styles.links}>
            <div className={styles.linksList}>

              <div className={styles.oneItem}>
                <div className={styles.imageArea}>
                  <div
                    className={styles.theImage}
                    style={{ backgroundImage: `url('/sites/${siteURL}/SiteAssets/cut/chat.svg')` }}
                  ></div>
                </div>
                <div className={styles.data}>
                  <div className={styles.title}>תסריטי שיחה</div>
                  <div className={styles.text}>
                    {/* Display the selected option or a placeholder text */}
                    {this.state.selectedOption ? `תסריט שיחה עבור מותג: ${this.state.selectedOption}` : 'תסריטי שיחה עם נציגי מכירות'}
                  </div>
                  <select
                    className={styles.selectBox}
                    onChange={this.handleSelectChange}
                    value={this.state.selectedOption}
                  >
                    <option value="" disabled>
                      בחר/י מותג
                    </option>
                    {options.map((option, index) => (
                      <option key={index} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>
    );
  }
}
