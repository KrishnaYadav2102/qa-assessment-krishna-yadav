import { test } from '@playwright/test';
import { AdminPage } from '../../pages/accounts/AdminPage.js';
import { Asserts } from '../../utils/Asserts.js';
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
      'okx-auto',
      'abc',
      'xyzzzzxxcccvv',
      'passphrasekddd',
    );
    await Asserts.assertVisible(
      await adminPage.getElementByText('Account added successfully'),
    );
    // const goTradePage = new GoTradePage(page, USERS.USER19.username);
    // await goTradePage.goto();
    // await goTradePage.validateGoTradePage(USERS.USER19.username);
  });
});
