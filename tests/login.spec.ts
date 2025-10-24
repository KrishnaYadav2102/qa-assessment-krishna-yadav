import { test } from '@playwright/test';
import { USERS } from '../utils/constants.js';
import { Asserts } from '../utils/Asserts.js';
import { LoginPage } from '../pages/authentication/LoginPage.js';
import { GoTradePage } from '../pages/trading/GoTradePage.js';
import { OnboardingPopup } from '../pages/authentication/OnboardingPopup.js';

/**
 * Test suite for login functionality
 */
test.describe('Login Tests', () => {
  // Reset storage state for this file to avoid being authenticated
  test.use({ storageState: { cookies: [], origins: [] } });

  /**
   * Test: Login with valid credentials for an existing user
   */
  test('User login for existing user with valid credentials', async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);
    const goTradePage = new GoTradePage(page, USERS.USER19.username);
    const onboardingPopup = new OnboardingPopup(page);

    // Navigate to login page
    await loginPage.goto();

    // Perform login with valid username and password
    await loginPage.login(USERS.USER19.username, USERS.USER19.password);

    // Check and dismiss the popup if it appears
    if (await onboardingPopup.isPopupVisible()) {
      await onboardingPopup.validatePopupContent();
      await onboardingPopup.clickGetStarted();
    }

    await goTradePage.validateGoTradePage(USERS.USER19.username);
  });

  /**
   * Test: Login with incorrect password for existing user
   */
  test('User login for existing user with incorrect password', async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);

    // Navigate to login page
    await loginPage.goto();

    // Attempt login with valid username but wrong password
    await loginPage.login(USERS.USER19.username, 'wrong_password');

    // Assert that error message is visible
    // Using LoginPage wrapper method assertVisible
    await Asserts.assertVisible(page.getByText('The password is invalid'));
  });

  /**
   * Test: Login with non-existing user
   */
  test('User login for non-existing user', async ({ page }) => {
    const loginPage = new LoginPage(page);

    // Navigate to login page
    await loginPage.goto();

    // Attempt login with a username that doesn't exist
    await loginPage.login('non-existing-user@goquant.io', 'wrong_password');

    // Assert that error message is visible
    await Asserts.assertVisible(
      page.getByText('The user was not found in the system'),
    );
  });

  /**
   * Test: Invalid Email format
   */
  test('User login with Invalid Email format', async ({ page }) => {
    const loginPage = new LoginPage(page);

    // Navigate to login page
    await loginPage.goto();

    // Attempt login with a username that doesn't exist
    await loginPage.login('invalid-email-format', 'wrong_password');

    // Assert that error message is visible
    await Asserts.assertVisible(page.getByText('Please provide a valid email'));
  });

  /**
   * Test: Blank email
   */
  test('User login with blank Email', async ({ page }) => {
    const loginPage = new LoginPage(page);

    // Navigate to login page
    await loginPage.goto();

    // Attempt login with a username that doesn't exist
    await loginPage.login('', 'wrong_password');

    // Assert that error message is visible
    await Asserts.assertVisible(
      page.getByText('Username must be at least 5 characters.'),
    );
  });

  /**
   * Test: Blank password
   */
  test('User login with blank password', async ({ page }) => {
    const loginPage = new LoginPage(page);

    // Navigate to login page
    await loginPage.goto();

    // Attempt login with a username that doesn't exist
    await loginPage.login(USERS.USER19.username, '');

    // Assert that error message is visible
    await Asserts.assertVisible(page.getByText('The password is invalid'));
  });

  /**
   * Test: Logout functionality for a logged-in user
   */
  test('User logout', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const goTradePage = new GoTradePage(page, USERS.USER19.username);
    const onboardingPopup = new OnboardingPopup(page);

    // Login first
    await loginPage.goto();
    await loginPage.login(USERS.USER19.username, USERS.USER19.password);

    // Check and dismiss the popup if it appears
    if (await onboardingPopup.isPopupVisible()) {
      await onboardingPopup.validatePopupContent();
      await onboardingPopup.clickGetStarted();
    }

    // Click logout link
    await goTradePage.logout();

    // Validate that login page is displayed after logout
    await loginPage.validateUserLoggedOut();
  });
});
