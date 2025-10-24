import { BasePage } from '../BasePage.js';
import { Page } from '@playwright/test';
import { ROUTES } from '../../utils/constants.js';
import { Logger } from '../../utils/Logger.js';

export class AdminPage extends BasePage {
  btn_addAccount = this.page.getByTestId('venues-button-addaccount');
  inpt_accountName = this.page.getByTestId('account-name-input');
  inpt_apiKey = this.page.getByTestId('input-api-key');
  inpt_apiSecret = this.page.getByTestId('input-api-secret');
  inpt_passPhrase = this.page.getByTestId('passphrase-input');
  swtch_testMode = this.page.getByTestId('test-mode-switch');

  /**
   * Constructor initializes the AdminPage object
   * @param page Playwright Page object
   */
  constructor(page: Page) {
    super(page);
  }

  async goto() {
    await super.goto(ROUTES.ADMIN);
  }

  // async validateGoTradePage(email: string) {
  //   console.log(`Printing it temporarily to avoid lint error: ${email}`);
  //   // await Asserts.assertVisible(await this.getEmail(email));
  //   await Asserts.assertVisible(this.link_go_terminal);
  //   await Asserts.assertVisible(this.btn_markets);
  //   await Asserts.assertVisible(this.btn_trading);
  //   // await Asserts.assertVisible(this.btn_accounts);
  // }

  async addAccount(
    accountName: string,
    apiKey: string,
    apiSecret: string,
    passPhrase: string,
  ) {
    Logger.step(`Add Account: ${accountName}`);
    await this.click(this.btn_addAccount);
    await this.fill(this.inpt_accountName, accountName);
    await this.fill(this.inpt_apiKey, apiKey);
    await this.fill(this.inpt_apiSecret, apiSecret, true);
    await this.fill(this.inpt_passPhrase, passPhrase, true);
    await this.click(this.swtch_testMode);
    await this.click(this.btn_addAccount);
  }
}
