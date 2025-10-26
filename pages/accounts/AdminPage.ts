import { BasePage } from '../BasePage.js'; // Import the base class for Page Object Models
import { Page } from '@playwright/test'; // Import Playwright's core types
import { EXCHANGE_ACCOUNTS, ROUTES } from '../../utils/constants.js'; // Import routes and exchange credentials constants
import { Logger } from '../../utils/Logger.js'; // Import the custom logging utility

/**
 * Page Object Model for the Accounts Admin page.
 * This page handles adding, modifying, and deleting exchange accounts.
 * Extends BasePage for core functionality.
 */
export class AdminPage extends BasePage {
  // Main button to open the "Add Account" dialog
  btn_addAccount = this.page.getByTestId('venues-button-addaccount');

  /*
   * Add Account Dialogue Locators
   */
  drpdn_exchangeSelector = this.page.getByTestId(
    'dropdown-trigger:exchange-selector', // Trigger to open the exchange dropdown
  );
  inpt_exchangeSearch = this.page.getByTestId('exchange-search-input'); // Input field for searching exchanges
  optn_exchangeOkx = this.page.getByTestId('exchange-option-OKX'); // Option for OKX exchange
  optn_exchangeBinanceUsdM = this.page.getByTestId(
    'exchange-option-BINANCEUSDM', // Option for Binance USD-M exchange
  );
  optn_exchangeBinanceCoinM = this.page.getByTestId(
    'exchange-option-BINANCECOINM', // Option for Binance COIN-M exchange
  );
  inpt_accountName = this.page.getByTestId('account-name-input'); // Input field for the account name
  inpt_apiKey = this.page.getByTestId('input-api-key'); // Input field for the API Key
  inpt_apiSecret = this.page.getByTestId('input-api-secret'); // Input field for the API Secret
  inpt_passPhrase = this.page.getByTestId('passphrase-input'); // Input field for the Passphrase (e.g., for OKX)
  swtch_testMode = this.page.getByTestId('test-mode-switch'); // Toggle for Test Mode
  btn_submitAccount = this.page.getByTestId('button-submit-account'); // Submit button to create the account
  dlg_addAccount = this.page.getByTestId('add-account-dialog'); // Container for the Add Account dialog

  /*
   * Modify Account Dialogue Locators (used after clicking 'Modify')
   */
  inpt_editAccountName = this.page.getByRole('textbox', {
    name: 'OKX Account Name', // Textbox for account name in the edit modal
  });
  inpt_editApiKey = this.page.getByRole('textbox', { name: 'OKX Key' }); // Textbox for API Key in the edit modal
  inpt_editApiSecret = this.page.getByRole('textbox', {
    name: 'Enter your OKX secret key', // Textbox for API Secret in the edit modal
  });
  inpt_editPassPhrase = this.page.getByRole('textbox', {
    name: 'Enter your OKX passphrase', // Textbox for Passphrase in the edit modal
  });
  swtch_editTestMode = this.page.getByRole('switch', { name: 'Test Mode' }); // Toggle for Test Mode in the edit modal
  btn_editSubmitAccount = this.page.getByRole('button', {
    name: 'Edit Account', // Submit button for modifying the account
  });
  btn_editClose = this.page.getByRole('button', { name: 'Close', exact: true }); // Close button for the edit/modify dialog

  /*
   * Delete Account Dialogue Locators
   */
  inpt_deleteConfirmation = this.page.getByTestId(
    'delete-account-dialog-delete-confirmation', // Input field requiring 'DELETE' text confirmation
  );
  btn_delete = this.page.getByTestId('delete-account-dialog-delete'); // Final button to confirm deletion

  /**
   * Constructor initializes the AdminPage object
   * @param page Playwright Page object
   */
  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate directly to the Admin page.
   */
  async goto() {
    await super.goto(ROUTES.ADMIN);
  }

  /**
   * Gets the Locator for the delete button corresponding to a specific account name.
   * Assumes account names are converted to lowercase for the data-testid attribute.
   * @param accountName The unique name of the account
   */
  async getDeleteBtnByAccount(accountName: string) {
    return this.page.getByTestId(`delete-account-${accountName.toLowerCase()}`);
  }

  /**
   * Gets the Locator for the table row corresponding to a specific exchange account.
   * This is a utility method used internally to scope searches for buttons (like Modify/Delete).
   * @param accountName The unique name of the account to search for
   * @returns A Playwright Locator representing the table row
   */
  async getAccountRow(accountName: string) {
    return this.page
      .getByRole('row') // Find all rows in the table
      // Filter the rows to find the one whose text content includes the account name (converted to lowercase for matching)
      .filter({ hasText: `${accountName.toLowerCase()}` });
  }

  /**
   * Gets the Locator for the modify button corresponding to a specific account name.
   * Finds the table row that contains the account name and then finds the 'Modify' button within that row.
   * @param accountName The unique name of the account
   * @returns A Playwright Locator for the 'Modify' button
   */
  async getModifyBtnByAccount(accountName: string) {
    // Use the helper method to get the specific account's row
    const accountRow = await this.getAccountRow(accountName);
    // Find the 'Modify' button restricted to that specific row
    return accountRow.getByRole('button', { name: 'Modify' });
  }

  /**
   * Selects the target exchange in the 'Add Account' dialog if it's not the default (OKX).
   * @param exchangeName The name of the exchange to select
   */
  async selectAccount(exchangeName: string) {
    // If the exchange is OKX, assume it's the default and skip selection
    if (exchangeName == EXCHANGE_ACCOUNTS.OKX.NAME) return;

    // Open the dropdown, search, and click the relevant option
    await this.click(this.drpdn_exchangeSelector);
    await this.fill(this.inpt_exchangeSearch, exchangeName);

    if (exchangeName == EXCHANGE_ACCOUNTS.BINANCE_USD_M.NAME) {
      await this.click(this.optn_exchangeBinanceUsdM);
    }
    if (exchangeName == EXCHANGE_ACCOUNTS.BINANCE_COIN_M.NAME) {
      await this.click(this.optn_exchangeBinanceCoinM);
    }
  }

  /**
   * Full sequence for adding a new exchange account.
   */
  async addAccount(
    exchangeName: string,
    accountName: string,
    apiKey: string,
    apiSecret: string,
    passPhrase: string = '',
  ) {
    Logger.step(`Add Account: ${accountName} for Exchange: ${exchangeName}`);
    await this.click(this.btn_addAccount); // Open the dialog
    await this.selectAccount(exchangeName); // Select the exchange
    await this.fill(this.inpt_accountName, accountName); // Fill account name
    await this.fill(this.inpt_apiKey, apiKey); // Fill API key
    await this.fill(this.inpt_apiSecret, apiSecret, true); // Fill API secret (masked)

    if (passPhrase !== '') {
      await this.fill(this.inpt_passPhrase, passPhrase, true); // Fill passphrase if provided (masked)
    }
    await this.check(this.swtch_testMode, true); // Ensure Test Mode is checked
    await this.click(this.btn_submitAccount); // Submit the form
  }

  /**
   * Full sequence for modifying an existing exchange account.
   * Assumes the modify dialog is already open.
   */
  async modifyAccount(
    accountName: string,
    apiKey: string,
    apiSecret: string,
    passPhrase: string = '',
  ) {
    Logger.step(`Modifying Account: ${accountName}`);
    await this.fill(this.inpt_editAccountName, accountName); // Fill (potentially new) account name
    await this.fill(this.inpt_editApiKey, apiKey); // Fill (potentially new) API key
    await this.fill(this.inpt_editApiSecret, apiSecret, true); // Fill (potentially new) API secret (masked)

    if (passPhrase !== '') {
      await this.fill(this.inpt_editPassPhrase, passPhrase, true); // Fill (potentially new) passphrase (masked)
    }
    await this.check(this.swtch_editTestMode, true); // Ensure Test Mode is checked
    await this.click(this.btn_editSubmitAccount); // Submit the modification
  }

  /**
   * Full sequence for deleting an exchange account.
   */
  async deleteAccount(accountName: string) {
    Logger.step(`Deleting Account: ${accountName}`);
    const deleteAccountBtn = await this.getDeleteBtnByAccount(accountName); // Get the specific delete button

    if (await deleteAccountBtn.isVisible()) {
      await this.click(deleteAccountBtn); // Click the delete button
      await this.fill(this.inpt_deleteConfirmation, 'DELETE'); // Fill the confirmation text
      await this.click(this.btn_delete); // Click the final delete button
    } else {
      Logger.warn(
        `Account not found! Either account is not added or its listed in another page: ${accountName}`,
      );
    }
  }
}
