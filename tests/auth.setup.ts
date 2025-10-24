import { test as setup } from "@playwright/test";
import path from "path";
import { USERS } from "../utils/constants.ts";
import { LoginPage } from "../pages/LoginPage.ts";
import {OnboardingPopup} from "../pages/OnboardingPopup.ts";
import {fileURLToPath} from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const authFile = path.join(__dirname, "../playwright/.auth/user.json");

/**
 * Setup test to authenticate a user and save authentication state.
 * This allows reusing the login state across multiple tests without logging in every time.
 */
setup("authenticate", async ({ page }) => {
  // Initialize the LoginPage object
  const loginPage = new LoginPage(page);
  const onboardingPopup = new OnboardingPopup(page);

  // Navigate to login page
  await loginPage.goto();

  // Use LoginPage's login() method
  await loginPage.login(USERS.USER19.username, USERS.USER19.password);

  // Dismiss the onboarding popup if it appears
  if (await onboardingPopup.isPopupVisible()) {
    await onboardingPopup.clickGetStarted();
  }

  // Save authenticated browser state to a JSON file
  // This can be loaded in other tests to bypass login
  await page.context().storageState({ path: authFile });
  console.log(`Authentication state saved to: ${authFile}`);
});
