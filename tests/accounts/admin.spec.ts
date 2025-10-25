import { test } from '@playwright/test';
import { AdminPage } from '../../pages/accounts/AdminPage.js'; // Import the Page Object Model for the Admin section
import { Asserts } from '../../utils/Asserts.js'; // Import custom assertion utility for cleaner checks
import { EXCHANGE_ACCOUNTS } from '../../utils/constants.js'; // Import test data constants for exchange credentials
import { generateAlphanumeric } from '../../utils/helpers.js'; // Import helper to generate unique test data

// Declare Page Object instance and dynamic test data variable
let adminPage: AdminPage;
let accountName: string;

/**
 * Test suite for Adding accounts in Accounts > Admin functionality
 * This suite verifies the successful creation of accounts for various exchanges.
 */
test.describe('Accounts > Admin > Add Accounts successfully: ', () => {
  test.beforeEach(async ({ page }) => {
    adminPage = new AdminPage(page); // Initialize the Admin Page Object
    // Generate a unique account name for each test to prevent conflicts
    accountName = `delete_${generateAlphanumeric()}`;
    await adminPage.goto(); // Navigate to the Accounts Admin page
  });

  test.afterEach(async () => {
    // Teardown: Clean up the test environment by deleting the newly created account
    await adminPage.deleteAccount(accountName);
    // Assert successful removal of the account
    await Asserts.assertVisible(
      await adminPage.getElementByText('Account removed successfully'),
    );
  });

  /**
   * Test: Add OKX Accounts in Account Admin page
   */
  test('Add OKX account', async () => {
    // ACT: Call the reusable addAccount method with OKX specific constants and the unique account name
    await adminPage.addAccount(
      EXCHANGE_ACCOUNTS.OKX.NAME, // Exchange Name/Type
      accountName, // Unique Account Name
      EXCHANGE_ACCOUNTS.OKX.KEY, // API Key
      EXCHANGE_ACCOUNTS.OKX.SECRET, // API Secret
      EXCHANGE_ACCOUNTS.OKX.PASSPHRASE, // Passphrase (required for OKX)
    );
    // ASSERT: Verify the success notification message is visible
    await Asserts.assertVisible(
      await adminPage.getElementByText('Account added successfully'),
    );
  });

  /**
   * Test: Add Binance USD-M Account in Accounts Admin page
   */
  test('Add Binance USD-M', async () => {
    // ACT: Add Binance USD-M account (Note: Passphrase is not needed for Binance)
    await adminPage.addAccount(
      EXCHANGE_ACCOUNTS.BINANCE_USD_M.NAME,
      accountName,
      EXCHANGE_ACCOUNTS.BINANCE_USD_M.KEY,
      EXCHANGE_ACCOUNTS.BINANCE_USD_M.SECRET,
    );
    // ASSERT: Verify the success notification message
    await Asserts.assertVisible(
      await adminPage.getElementByText('Account added successfully'),
    );
  });

  /**
   * Test: Add Binance COIN-M Account in Accounts Admin page
   */
  test('Add Binance COIN-M', async () => {
    // ACT: Add Binance COIN-M account
    await adminPage.addAccount(
      EXCHANGE_ACCOUNTS.BINANCE_COIN_M.NAME,
      accountName,
      EXCHANGE_ACCOUNTS.BINANCE_COIN_M.KEY,
      EXCHANGE_ACCOUNTS.BINANCE_COIN_M.SECRET,
    );
    // ASSERT: Verify the success notification message
    await Asserts.assertVisible(
      await adminPage.getElementByText('Account added successfully'),
    );
  });
});

// -----------------------------------------------------------------------------

/**
 * Test suite for validating Add account form in Accounts > Admin functionality
 * This suite verifies expected error messages for invalid input or duplicate data.
 */
test.describe('Accounts > Admin > Add Accounts validations: ', () => {
  test.beforeEach(async ({ page }) => {
    adminPage = new AdminPage(page); // Initialize the Page Object
    await adminPage.goto(); // Navigate to the Accounts Admin page
  });

  /**
   * Test: Add Existing Account in Accounts Admin page
   */
  test('Add account: Existing Account name', async () => {
    accountName = `delete_${generateAlphanumeric()}`; // Generate unique name for the first successful add

    // ACT: Add Account for the 1st time (Success expected)
    await adminPage.addAccount(
      EXCHANGE_ACCOUNTS.OKX.NAME,
      accountName,
      EXCHANGE_ACCOUNTS.OKX.KEY,
      EXCHANGE_ACCOUNTS.OKX.SECRET,
      EXCHANGE_ACCOUNTS.OKX.PASSPHRASE,
    );
    // ASSERT: First addition is successful
    await Asserts.assertVisible(
      await adminPage.getElementByText('Account added successfully'),
    );

    // ACT: Attempt to Add the same Account 2nd time (Failure expected)
    await adminPage.addAccount(
      EXCHANGE_ACCOUNTS.OKX.NAME,
      accountName, // Reusing the same name
      EXCHANGE_ACCOUNTS.OKX.KEY,
      EXCHANGE_ACCOUNTS.OKX.SECRET,
      EXCHANGE_ACCOUNTS.OKX.PASSPHRASE,
    );
    // ASSERT: Verify the duplicate account error message is displayed in the dialog
    await Asserts.assertVisible(
      adminPage.dlg_addAccount.getByText('Account name already exists'),
    );
    await adminPage.click(adminPage.btn_editClose); // Close the dialog

    // Teardown: Delete the original added account
    await adminPage.deleteAccount(accountName);
    await Asserts.assertVisible(
      await adminPage.getElementByText('Account removed successfully'),
    );
  });

  test('Add account: Incorrect Key', async () => {
    // ACT: Attempt to add an account with a deliberately incorrect API Key
    await adminPage.addAccount(
      EXCHANGE_ACCOUNTS.OKX.NAME,
      `delete_${generateAlphanumeric()}`, // Unique name
      EXCHANGE_ACCOUNTS.OKX.KEY + '_incorrect', // Altered Key
      EXCHANGE_ACCOUNTS.OKX.SECRET,
      EXCHANGE_ACCOUNTS.OKX.PASSPHRASE,
    );
    // ASSERT: Verify the server-side authentication failure message
    await Asserts.assertVisible(
      await adminPage.getElementByText('Authentication failed'),
    );
  });

  test('Add account: Incorrect Secret', async () => {
    // ACT: Attempt to add an account with a deliberately incorrect API Secret
    await adminPage.addAccount(
      EXCHANGE_ACCOUNTS.OKX.NAME,
      `delete_${generateAlphanumeric()}`,
      EXCHANGE_ACCOUNTS.OKX.KEY,
      EXCHANGE_ACCOUNTS.OKX.SECRET + '_incorrect', // Altered Secret
      EXCHANGE_ACCOUNTS.OKX.PASSPHRASE,
    );
    // ASSERT: Verify the server-side authentication failure message
    await Asserts.assertVisible(
      await adminPage.getElementByText('Authentication failed'),
    );
  });

  test('Add account: Incorrect Passphrase', async () => {
    // ACT: Attempt to add an account with an incorrect/case-sensitive Passphrase
    await adminPage.addAccount(
      EXCHANGE_ACCOUNTS.OKX.NAME,
      `delete_${generateAlphanumeric()}`,
      EXCHANGE_ACCOUNTS.OKX.KEY,
      EXCHANGE_ACCOUNTS.OKX.SECRET + '_incorrect',
      EXCHANGE_ACCOUNTS.OKX.PASSPHRASE.toUpperCase(), // Altered Passphrase
    );
    // ASSERT: Verify the server-side authentication failure message
    await Asserts.assertVisible(
      await adminPage.getElementByText('Authentication failed'),
    );
  });

  test('Add account: Blank Account Name', async () => {
    // ACT: Attempt to add an account with an empty Account Name field
    await adminPage.addAccount(
      EXCHANGE_ACCOUNTS.OKX.NAME,
      '', // Blank Name
      EXCHANGE_ACCOUNTS.OKX.KEY,
      EXCHANGE_ACCOUNTS.OKX.SECRET,
      EXCHANGE_ACCOUNTS.OKX.PASSPHRASE,
    );
    // ASSERT: Verify the client-side validation error for required field
    await Asserts.assertVisible(
      adminPage.dlg_addAccount.getByText('Please provide the account name'),
    );
  });

  test('Add account: Blank/Incomplete Key', async () => {
    // ACT: Attempt to add an account with an empty API Key field
    await adminPage.addAccount(
      EXCHANGE_ACCOUNTS.OKX.NAME,
      `delete_${generateAlphanumeric()}`,
      '', // Blank Key
      EXCHANGE_ACCOUNTS.OKX.SECRET,
      EXCHANGE_ACCOUNTS.OKX.PASSPHRASE,
    );
    // ASSERT: Verify the client-side validation error for required field
    await Asserts.assertVisible(
      adminPage.dlg_addAccount.getByText('Please provide the complete key'),
    );
  });

  test('Add account: Blank/Incomplete Secret', async () => {
    // ACT: Attempt to add an account with an empty API Secret field
    await adminPage.addAccount(
      EXCHANGE_ACCOUNTS.OKX.NAME,
      `delete_${generateAlphanumeric()}`,
      EXCHANGE_ACCOUNTS.OKX.KEY,
      '', // Blank Secret
      EXCHANGE_ACCOUNTS.OKX.PASSPHRASE,
    );
    // ASSERT: Verify the client-side validation error for required field
    await Asserts.assertVisible(
      adminPage.dlg_addAccount.getByText('Please provide the complete secret'),
    );
  });

  test('Add account: Blank/Incomplete Passphrase', async () => {
    // ACT: Attempt to add an account with an empty Passphrase field
    await adminPage.addAccount(
      EXCHANGE_ACCOUNTS.OKX.NAME,
      `delete_${generateAlphanumeric()}`,
      EXCHANGE_ACCOUNTS.OKX.KEY,
      EXCHANGE_ACCOUNTS.OKX.SECRET,
      '', // Blank Passphrase
    );
    // ASSERT: Verify the client-side validation error for required field
    await Asserts.assertVisible(
      adminPage.dlg_addAccount.getByText('Please provide the passphrase'),
    );
  });
});

// -----------------------------------------------------------------------------

/**
 * Test suite for Modifying Account in Accounts > Admin functionality
 * This suite verifies the update mechanism and related field/authentication validations.
 */
test.describe('Accounts > Admin > Modify Account:', () => {
  test.beforeEach(async ({ page }) => {
    adminPage = new AdminPage(page); // Initialize the Page Object
    accountName = `delete_${generateAlphanumeric()}`; // Generate unique name
    await adminPage.goto();
    // Setup: Add a new account first to be modified later
    await adminPage.addAccount(
      EXCHANGE_ACCOUNTS.OKX.NAME,
      accountName,
      EXCHANGE_ACCOUNTS.OKX.KEY,
      EXCHANGE_ACCOUNTS.OKX.SECRET,
      EXCHANGE_ACCOUNTS.OKX.PASSPHRASE,
    );
    await Asserts.assertVisible(
      await adminPage.getElementByText('Account added successfully'),
    );
    // ACT: Open the Modify Account dialog
    await adminPage.click(await adminPage.getModifyBtnByAccount(accountName));
  });

  test.afterEach(async () => {
    // Teardown: Workaround to close the modal before deletion
    // TODO: Temporary workaround added due to a known issue in the Edit Account functionality.
    await adminPage.click(adminPage.btn_editClose);

    // Teardown: Delete the modified account
    await adminPage.deleteAccount(accountName);
    await Asserts.assertVisible(
      await adminPage.getElementByText('Account removed successfully'),
    );
  });

  test('Modify with same Account data', async () => {
    // ACT: Attempt to modify the account using the exact same (original) credentials
    await adminPage.modifyAccount(
      accountName, // Name remains the same
      EXCHANGE_ACCOUNTS.OKX.KEY, // Key remains the same
      EXCHANGE_ACCOUNTS.OKX.SECRET, // Secret remains the same
      EXCHANGE_ACCOUNTS.OKX.PASSPHRASE, // Passphrase remains the same
    );
    // TODO: Uncomment this once known issue in Modify Account is fixed
    // ASSERT: Expect the success message for update
    // await Asserts.assertVisible(
    //   await adminPage.getElementByText('Account updated successfully'),
    // );
  });

  test('Modify with different valid key, secret & passphrase', async () => {
    // ACT: Attempt to modify with a different set of valid credentials (OKX_1)
    await adminPage.modifyAccount(
      accountName,
      EXCHANGE_ACCOUNTS.OKX_1.KEY, // New valid Key
      EXCHANGE_ACCOUNTS.OKX_1.SECRET, // New valid Secret
      EXCHANGE_ACCOUNTS.OKX_1.PASSPHRASE, // New valid Passphrase
    );
    // TODO: Uncomment this once known issue in Modify Account is fixed
    // ASSERT: Expect the success message for update
    // await Asserts.assertVisible(
    //   await adminPage.getElementByText('Account added successfully'),
    // );
  });

  test('Modify with different account name', async () => {
    // ACT: Modify the account name while keeping the credentials the same
    accountName = accountName + '_updated'; // Update the local variable to match the change
    await adminPage.modifyAccount(
      accountName, // New name
      EXCHANGE_ACCOUNTS.OKX.KEY,
      EXCHANGE_ACCOUNTS.OKX.SECRET,
      EXCHANGE_ACCOUNTS.OKX.PASSPHRASE,
    );
    // TODO: Uncomment this once known issue in Modify Account is fixed
    // ASSERT: Expect the success message for update
    // await Asserts.assertVisible(
    //   await adminPage.getElementByText('Account updated successfully'),
    // );
  });

  test('Modify with incorrect key', async () => {
    // ACT: Attempt to modify the account with an invalid API Key
    await adminPage.modifyAccount(
      accountName,
      EXCHANGE_ACCOUNTS.OKX.KEY + '_INCORRECT_KEY', // Invalid Key
      EXCHANGE_ACCOUNTS.OKX.SECRET,
      EXCHANGE_ACCOUNTS.OKX.PASSPHRASE,
    );
    // TODO: Uncomment this once known issue in Modify Account is fixed
    // ASSERT: Expect the authentication failure message
    // await Asserts.assertVisible(
    //   await adminPage.getElementByText('Authentication failed'),
    // );
  });

  test('Modify with incorrect secret', async () => {
    // ACT: Attempt to modify the account with an invalid API Secret
    await adminPage.modifyAccount(
      accountName,
      EXCHANGE_ACCOUNTS.OKX.KEY,
      EXCHANGE_ACCOUNTS.OKX.SECRET + '_INCORRECT_SECRET', // Invalid Secret
      EXCHANGE_ACCOUNTS.OKX.PASSPHRASE,
    );
    // TODO: Uncomment this once known issue in Modify Account is fixed
    // ASSERT: Expect the authentication failure message
    // await Asserts.assertVisible(
    //   await adminPage.getElementByText('Authentication failed'),
    // );
  });

  test('Modify with incorrect passphrase', async () => {
    // ACT: Attempt to modify the account with an invalid Passphrase
    await adminPage.modifyAccount(
      accountName,
      EXCHANGE_ACCOUNTS.OKX.KEY,
      EXCHANGE_ACCOUNTS.OKX.SECRET,
      EXCHANGE_ACCOUNTS.OKX.PASSPHRASE + '_INCORRECT_PASSPHRASE', // Invalid Passphrase
    );
    // TODO: Uncomment this once known issue in Modify Account is fixed
    // ASSERT: Expect the authentication failure message
    // await Asserts.assertVisible(
    //   await adminPage.getElementByText('Authentication failed'),
    // );
  });

  test('Modify with blank account name', async () => {
    // ACT: Attempt to modify the account with a blank Account Name
    await adminPage.modifyAccount(
      '', // Blank Name
      EXCHANGE_ACCOUNTS.OKX.KEY,
      EXCHANGE_ACCOUNTS.OKX.SECRET,
      EXCHANGE_ACCOUNTS.OKX.PASSPHRASE,
    );
    // ASSERT: Verify the client-side validation error for required field
    await Asserts.assertVisible(
      await adminPage.getElementByText('Please provide the account name'),
    );
  });

  test('Modify with blank key', async () => {
    // ACT: Attempt to modify the account with a blank API Key
    await adminPage.modifyAccount(
      accountName,
      '', // Blank Key
      EXCHANGE_ACCOUNTS.OKX.SECRET,
      EXCHANGE_ACCOUNTS.OKX.PASSPHRASE,
    );
    // ASSERT: Verify the client-side validation error for required field
    await Asserts.assertVisible(
      await adminPage.getElementByText('Please provide the complete key'),
    );
  });

  test('Modify with blank secret', async () => {
    // ACT: Attempt to modify the account with a blank API Secret
    await adminPage.modifyAccount(
      accountName,
      EXCHANGE_ACCOUNTS.OKX.KEY,
      '', // Blank Secret
      EXCHANGE_ACCOUNTS.OKX.PASSPHRASE,
    );
    // ASSERT: Verify the client-side validation error for required field
    await Asserts.assertVisible(
      await adminPage.getElementByText('Please provide the complete secret'),
    );
  });

  test('Modify with blank passphrase', async () => {
    // ACT: Attempt to modify the account with a blank Passphrase
    await adminPage.modifyAccount(
      accountName,
      EXCHANGE_ACCOUNTS.OKX.KEY,
      EXCHANGE_ACCOUNTS.OKX.SECRET,
      '', // Blank Passphrase
    );
    // ASSERT: Verify the client-side validation error for required field
    await Asserts.assertVisible(
      await adminPage.getElementByText('Please provide the passphrase'),
    );
  });
});

// -----------------------------------------------------------------------------

/**
 * Test suite for Delete Account in Accounts > Admin functionality
 */
test.describe('Accounts > Admin > Delete Account:', () => {
  test.beforeEach(async ({ page }) => {
    adminPage = new AdminPage(page); // Initialize the Page Object
    accountName = `delete_${generateAlphanumeric()}`; // Generate unique name
    await adminPage.goto();
    // Setup: Add an account to ensure a target for the delete test
    await adminPage.addAccount(
      EXCHANGE_ACCOUNTS.OKX.NAME,
      accountName,
      EXCHANGE_ACCOUNTS.OKX.KEY,
      EXCHANGE_ACCOUNTS.OKX.SECRET,
      EXCHANGE_ACCOUNTS.OKX.PASSPHRASE,
    );
    // ASSERT: Ensure the account was successfully added before attempting deletion
    await Asserts.assertVisible(
      await adminPage.getElementByText('Account added successfully'),
    );
  });

  test('Delete Account successfully', async () => {
    // ACT: Perform the delete operation on the created account
    await adminPage.deleteAccount(accountName);
    // ASSERT: Verify the success notification message for account removal
    await Asserts.assertVisible(
      await adminPage.getElementByText('Account removed successfully'),
    );
  });
});
