import { BasePage } from '../BasePage.js';
import { Page } from '@playwright/test';
import { EXCHANGE_ACCOUNTS, ROUTES } from '../../utils/constants.js';
import { Logger } from '../../utils/Logger.js';

export class AdminPage extends BasePage {
  btn_addAccount = this.page.getByTestId('venues-button-addaccount');

  /*
   * Add Account Dialogue
   */
  drpdn_exchangeSelector = this.page.getByTestId(
    'dropdown-trigger:exchange-selector',
  );
  inpt_exchangeSearch = this.page.getByTestId('exchange-search-input');
  optn_exchangeOkx = this.page.getByTestId('exchange-option-OKX');
  optn_exchangeBinanceUsdM = this.page.getByTestId(
    'exchange-option-BINANCEUSDM',
  );
  optn_exchangeBinanceCoinM = this.page.getByTestId(
    'exchange-option-BINANCECOINM',
  );
  inpt_accountName = this.page.getByTestId('account-name-input');
  inpt_apiKey = this.page.getByTestId('input-api-key');
  inpt_apiSecret = this.page.getByTestId('input-api-secret');
  inpt_passPhrase = this.page.getByTestId('passphrase-input');
  swtch_testMode = this.page.getByTestId('test-mode-switch');
  btn_submitAccount = this.page.getByTestId('button-submit-account');
  dlg_addAccount = this.page.getByTestId('add-account-dialog');

  /*
   * Modify Account Dialogue
   */
  inpt_editAccountName = this.page.getByRole('textbox', {
    name: 'OKX Account Name',
  });
  inpt_editApiKey = this.page.getByRole('textbox', { name: 'OKX Key' });
  inpt_editApiSecret = this.page.getByRole('textbox', {
    name: 'Enter your OKX secret key',
  });
  inpt_editPassPhrase = this.page.getByRole('textbox', {
    name: 'Enter your OKX passphrase',
  });
  swtch_editTestMode = this.page.getByRole('switch', { name: 'Test Mode' });
  btn_editSubmitAccount = this.page.getByRole('button', {
    name: 'Edit Account',
  });
  btn_editClose = this.page.getByRole('button', { name: 'Close', exact: true });

  /*
   * Delete Account Dialogue
   */
  inpt_deleteConfirmation = this.page.getByTestId(
    'delete-account-dialog-delete-confirmation',
  );
  btn_delete = this.page.getByTestId('delete-account-dialog-delete');

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

  async getDeleteBtnByAccount(accountName: string) {
    return this.page.getByTestId(`delete-account-${accountName.toLowerCase()}`);
  }

  async getModifyBtnByAccount(accountName: string) {
    return this.page
      .getByRole('row')
      .filter({ hasText: `${accountName.toLowerCase()}` })
      .getByRole('button', { name: 'Modify' });
  }

  // async validateAccountsPage() {
  //   console.log(`Printing it temporarily to avoid lint error: ${email}`);
  //   // await Asserts.assertVisible(await this.getEmail(email));
  //   await Asserts.assertVisible(this.link_go_terminal);
  //   await Asserts.assertVisible(this.btn_markets);
  //   await Asserts.assertVisible(this.btn_trading);
  //   // await Asserts.assertVisible(this.btn_accounts);
  // }

  async selectAccount(exchangeName: string) {
    if (exchangeName == EXCHANGE_ACCOUNTS.OKX.NAME) return;

    await this.click(this.drpdn_exchangeSelector);
    await this.fill(this.inpt_exchangeSearch, exchangeName);

    if (exchangeName == EXCHANGE_ACCOUNTS.BINANCE_USD_M.NAME) {
      await this.click(this.optn_exchangeBinanceUsdM);
    }
    if (exchangeName == EXCHANGE_ACCOUNTS.BINANCE_COIN_M.NAME) {
      await this.click(this.optn_exchangeBinanceCoinM);
    }
  }

  async addAccount(
    exchangeName: string,
    accountName: string,
    apiKey: string,
    apiSecret: string,
    passPhrase: string = '',
  ) {
    Logger.step(`Add Account: ${accountName} for Exchange: ${exchangeName}`);
    await this.click(this.btn_addAccount);
    await this.selectAccount(exchangeName);
    await this.fill(this.inpt_accountName, accountName);
    await this.fill(this.inpt_apiKey, apiKey);
    await this.fill(this.inpt_apiSecret, apiSecret, true);

    if (passPhrase !== '') {
      await this.fill(this.inpt_passPhrase, passPhrase, true);
    }
    await this.check(this.swtch_testMode, true);
    await this.click(this.btn_submitAccount);
  }

  async modifyAccount(
    accountName: string,
    apiKey: string,
    apiSecret: string,
    passPhrase: string = '',
  ) {
    Logger.step(`Modifying Account: ${accountName}`);
    await this.fill(this.inpt_editAccountName, accountName);
    await this.fill(this.inpt_editApiKey, apiKey);
    await this.fill(this.inpt_editApiSecret, apiSecret, true);

    if (passPhrase !== '') {
      await this.fill(this.inpt_editPassPhrase, passPhrase, true);
    }
    await this.check(this.swtch_editTestMode, true);
    await this.click(this.btn_editSubmitAccount);
  }

  async deleteAccount(accountName: string) {
    Logger.step(`Deleting Account: ${accountName}`);
    const deleteAccountBtn = await this.getDeleteBtnByAccount(accountName);

    if (await deleteAccountBtn.isVisible()) {
      await this.click(deleteAccountBtn);
      await this.fill(this.inpt_deleteConfirmation, 'DELETE');
      await this.click(this.btn_delete);
    } else {
      Logger.warn(
        `Account not found! Either account is not added or its listed in another page: ${accountName}`,
      );
    }
  }
}
