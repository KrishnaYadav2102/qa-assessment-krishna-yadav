import { test } from '@playwright/test';
import { AdminPage } from '../../pages/accounts/AdminPage.js';
import { Asserts } from '../../utils/Asserts.js';
import { EXCHANGE_ACCOUNTS } from '../../utils/constants.js';
import {generateAlphanumeric} from "../../utils/helpers.js";
// import { Asserts } from "../utils/Asserts";

/**
 * Test suite for Accounts > Admin functionality
 */
test.describe('Accounts > Admin', () => {
  /**
   * Test: Add Accounts in Accounts Admin page
   */
  test('Add accounts in Accounts Admin page', async ({ page }) => {
    const adminPage = new AdminPage(page);

    await adminPage.goto();
    await adminPage.addAccount(
      EXCHANGE_ACCOUNTS.OKX.EXCHANGE,
      `delete_${generateAlphanumeric()}`,
      EXCHANGE_ACCOUNTS.OKX.KEY,
      EXCHANGE_ACCOUNTS.OKX.SECRET,
      EXCHANGE_ACCOUNTS.OKX.PASSPHRASE,
    );
    await Asserts.assertVisible(
      await adminPage.getElementByText('Account added successfully'),
    );
  });

  /**
   * Test: Add Existing Account in Accounts Admin page
   */
  test('Add Existing accounts in Accounts Admin page', async ({ page }) => {
    const adminPage = new AdminPage(page);

    await adminPage.goto();
    await adminPage.addAccount(
      EXCHANGE_ACCOUNTS.OKX.EXCHANGE,
      'user19@goquant.io',
      EXCHANGE_ACCOUNTS.OKX.KEY,
      EXCHANGE_ACCOUNTS.OKX.SECRET,
      EXCHANGE_ACCOUNTS.OKX.PASSPHRASE,
    );
    await Asserts.assertVisible(
      adminPage.dlg_addAccount.getByText('Account name already exists')
    );
  });
});
