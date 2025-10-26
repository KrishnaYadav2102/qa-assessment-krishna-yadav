import { test } from '@playwright/test';
import { USERS } from '../../utils/constants.js'; // Import user credential constants
import { Asserts } from '../../utils/Asserts.js'; // Import custom assertion utility
import { LoginPage } from '../../pages/authentication/LoginPage.js'; // Import Page Object Model for the Login page
import { GoTradePage } from '../../pages/trading/GoTradePage.js'; // Import Page Object Model for the main trading page
import { OnboardingPopup } from '../../pages/authentication/OnboardingPopup.js'; // Import Page Object for the Onboarding dialog
import loginData from '../../test-data/login.json' with { type: "json" };

// Declare Page Object instance
let loginPage: LoginPage;

/**
 * Test suite for login functionality
 * This suite focuses on authentication and session management.
 */
test.describe('Login > Successful: ', () => {
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
    await goTradePage.validateGoTradePage();
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

/**
 * Test suite for login validation scenarios using dynamic test data.
 */
test.describe('Login > Validation:', () => {
  // Reset storage state for this file to ensure tests start unauthenticated
  test.use({ storageState: { cookies: [], origins: [] } });

  // Loop through each object in the imported JSON data array
  for (const data of loginData) {
    /**
     * Dynamically generated test:
     * Validates expected error messages for various invalid login attempts.
     */
    test(`${data.test_name}`, async ({ page }) => {
      const loginPage = new LoginPage(page);

      // ACT: Navigate to login page
      await loginPage.goto();

      // ACT: Attempt login using the username and password from the current data object
      await loginPage.login(data.username, data.password);

      // ASSERT: Validate that the expected error message from the test data is visible on the page
      await Asserts.assertVisible(page.getByText(data.message));
    });
  }
});