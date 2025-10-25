import { test as setup } from '@playwright/test';
import path from 'path'; // Node.js utility for handling file paths
import { USERS } from '../utils/constants.js'; // Import user credential constants
import { fileURLToPath } from 'node:url'; // Utility to convert module URL to file path
import { LoginPage } from '../pages/authentication/LoginPage.js'; // Import Page Object Model for Login
import { OnboardingPopup } from '../pages/authentication/OnboardingPopup.js'; // Import Page Object Model for the onboarding dialog
import { Logger } from '../utils/Logger.js'; // Import custom logging utility

// --- Path and Setup Constants ---

// Get the directory name of the current file using ES Modules syntax
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Define the path where the authentication state JSON file will be saved
const authFile = path.join(__dirname, '../playwright/.auth/user.json');

/**
 * Setup test to authenticate a user and save authentication state.
 * This file runs once before all other tests that depend on the saved state.
 */
setup('authenticate', async ({ page }) => {
  // Log the beginning of the authentication process
  Logger.step('Authenticate & save it in auth.json file');
  // Initialize Page Objects
  const loginPage = new LoginPage(page);
  const onboardingPopup = new OnboardingPopup(page);

  // ACT: Navigate to login page
  await loginPage.goto();

  // ACT: Perform login using a valid user from constants
  await loginPage.login(USERS.USER19.username, USERS.USER19.password);

  // CHECK: Handle the post-login onboarding flow
  if (await onboardingPopup.isPopupVisible()) {
    await onboardingPopup.clickGetStarted(); // Dismiss the popup
  }

  // ACTION: Save authenticated browser state to a JSON file
  // This step is crucial for allowing subsequent tests to bypass the login process
  await page.context().storageState({ path: authFile });
  // Log the successful saving of the authentication state
  Logger.info(`Authentication state saved to: ${authFile}`);
});
