import { test } from '@playwright/test';
import { USERS } from '../utils/constants.js'; // Import user credential constants
import { Asserts } from '../utils/Asserts.js'; // Import custom assertion utility
import { LoginPage } from '../pages/authentication/LoginPage.js'; // Import Page Object Model for the Login page
import { GoTradePage } from '../pages/trading/GoTradePage.js'; // Import Page Object Model for the main trading page
import { OnboardingPopup } from '../pages/authentication/OnboardingPopup.js'; // Import Page Object for the Onboarding dialog

// Declare Page Object instance
let loginPage: LoginPage;

/**
 * Test suite for login functionality
 * This suite focuses on authentication and session management.
 */
test.describe('Login Tests', () => {
  // Configuration: Ensure tests in this file start unauthenticated
  test.use({ storageState: { cookies: [], origins: [] } });

  /**
   * Test: Login with valid credentials for an existing user
   * Verifies successful login and navigation to the trading page.
   */
  test('User login for existing user with valid credentials', async ({
    page,
  }) => {
    // Initialize Page Objects
    loginPage = new LoginPage(page);
    // Initialize GoTradePage with the expected username for validation
    const goTradePage = new GoTradePage(page, USERS.USER19.username);
    const onboardingPopup = new OnboardingPopup(page);

    // ACT: Navigate to login page
    await loginPage.goto();

    // ACT: Perform login with valid username and password
    await loginPage.login(USERS.USER19.username, USERS.USER19.password);

    // CHECK: Handle the post-login onboarding flow if it appears
    if (await onboardingPopup.isPopupVisible()) {
      await onboardingPopup.validatePopupContent(); // Verify content of the popup
      await onboardingPopup.clickGetStarted(); // Dismiss the popup
    }

    // ASSERT: Validate successful navigation and page elements after login
    await goTradePage.validateGoTradePage(USERS.USER19.username);
  });

  /**
   * Test: Login with incorrect password for existing user
   * Verifies that the application prevents login with an incorrect password.
   */
  test('User login for existing user with incorrect password', async ({
    page,
  }) => {
    loginPage = new LoginPage(page);

    // ACT: Navigate to login page
    await loginPage.goto();

    // ACT: Attempt login with valid username but wrong password
    await loginPage.login(USERS.USER19.username, 'wrong_password');

    // ASSERT: Verify that the expected error message is displayed
    await Asserts.assertVisible(page.getByText('The password is invalid'));
  });

  /**
   * Test: Login with non-existing user
   * Verifies that the application prevents login for an unknown user.
   */
  test('User login for non-existing user', async ({ page }) => {
    loginPage = new LoginPage(page);

    // ACT: Navigate to login page
    await loginPage.goto();

    // ACT: Attempt login with a username that doesn't exist
    await loginPage.login('non-existing-user@goquant.io', 'wrong_password');

    // ASSERT: Verify the "user not found" error message
    await Asserts.assertVisible(
      page.getByText('The user was not found in the system'),
    );
  });

  /**
   * Test: Invalid Email format
   * Verifies client-side or front-end validation for email format.
   */
  test('User login with Invalid Email format', async ({ page }) => {
    loginPage = new LoginPage(page);

    // ACT: Navigate to login page
    await loginPage.goto();

    // ACT: Attempt login with an improperly formatted email address
    await loginPage.login('invalid-email-format', 'wrong_password');

    // ASSERT: Verify the email format validation error message
    await Asserts.assertVisible(page.getByText('Please provide a valid email'));
  });

  /**
   * Test: Blank email
   * Verifies validation for an empty username/email field.
   */
  test('User login with blank Email', async ({ page }) => {
    loginPage = new LoginPage(page);

    // ACT: Navigate to login page
    await loginPage.goto();

    // ACT: Attempt login with a blank username/email field
    await loginPage.login('', 'wrong_password');

    // ASSERT: Verify the minimum length/blank field validation error message
    await Asserts.assertVisible(
      page.getByText('Username must be at least 5 characters.'),
    );
  });

  /**
   * Test: Blank password
   * Verifies validation for an empty password field.
   */
  test('User login with blank password', async ({ page }) => {
    loginPage = new LoginPage(page);

    // ACT: Navigate to login page
    await loginPage.goto();

    // ACT: Attempt login with a blank password
    await loginPage.login(USERS.USER19.username, '');

    // ASSERT: Verify the password validation error message (same as incorrect password, often)
    await Asserts.assertVisible(page.getByText('The password is invalid'));
  });

  /**
   * Test: Logout functionality for a logged-in user
   * Verifies that clicking the logout link properly terminates the session.
   */
  test('User logout', async ({ page }) => {
    // Initialize necessary Page Objects
    const loginPage = new LoginPage(page);
    const goTradePage = new GoTradePage(page, USERS.USER19.username);
    const onboardingPopup = new OnboardingPopup(page);

    // SETUP: Login first to establish a session
    await loginPage.goto();
    await loginPage.login(USERS.USER19.username, USERS.USER19.password);

    // SETUP: Handle the onboarding popup if it appears
    if (await onboardingPopup.isPopupVisible()) {
      await onboardingPopup.validatePopupContent();
      await onboardingPopup.clickGetStarted();
    }

    // ACT: Click the logout link/button
    await goTradePage.logout();

    // ASSERT: Validate that the page has returned to the login state/page
    await loginPage.validateUserLoggedOut();
  });
});
