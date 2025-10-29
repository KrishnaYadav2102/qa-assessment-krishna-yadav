// pages/OnboardingPopup.ts
import { Page, Locator } from '@playwright/test';
import { BasePage } from '../BasePage.js'; // Import the base class for common methods
import { Asserts } from '../../utils/Asserts.js'; // Import custom assertion utilities
import { Logger } from '../../utils/Logger.js'; // Import the custom logging utility

/**
 * Page Object Model for the Onboarding Popup/Card that appears post-login for new users.
 * Extends BasePage for basic actions like clicking and waiting.
 */
export class OnboardingPopup extends BasePage {
  // Locator for the main container of the entire popup
  readonly popupContainer = this.page.getByTestId('onboarding-card');
  // Locator for the main welcome text header inside the container
  readonly welcomeHeader = this.popupContainer.getByText('Welcome to GoTrade!');
  // Locator for the primary action button to dismiss the popup
  readonly getStartedButton: Locator =
    this.popupContainer.getByText('Get Started');

  /**
   * Constructor initializes the OnboardingPopup object.
   * @param page Playwright Page object
   */
  constructor(page: Page) {
    super(page);
  }

  /**
   * Checks if the onboarding popup is currently visible by waiting for its locator.
   * Implements a timeout to handle cases where the popup does not appear.
   * @returns A promise that resolves to true if the popup is visible, false otherwise.
   */
  async isPopupVisible(): Promise<boolean> {
    // Log intent to check for the popup
    Logger.info('Checking if Onboarding pop-up is visible!');
    try {
      // Try to wait for the popup container to become visible within a 10s timeout
      await this.waitForLocator(this.popupContainer, 'visible', 20000);
      Logger.info('PopUp visible!');
      return true;
    } catch (error) {
      // If the timeout is reached and the popup is not visible, catch the error and return false
      Logger.info(`PopUp not visible!: \n${error}`);
      return false;
    }
  }

  /**
   * Confirms the popup is visible and validates its key text and button elements.
   * Assumes isPopupVisible() has been called and returned true, or handles a failure if called directly.
   */
  async validatePopupContent() {
    Logger.step('Validate Onboarding Popup content');
    // Assert that the container contains the main welcome text
    await Asserts.assertTextContains(
      this.popupContainer,
      'Welcome to GoTrade!',
    );
    // Assert the exact text of the action button
    await Asserts.assertText(this.getStartedButton, 'Get Started');
  }

  /**
   * Clicks the "Get Started" button to close and dismiss the popup.
   * Also waits for the popup container to become hidden to ensure successful closure.
   */
  async clickGetStarted() {
    // Click the button
    await this.getStartedButton.click();

    // Optional: Wait for the popup to disappear
    await this.waitForLocator(this.popupContainer, 'hidden', 5000);
    Logger.info('Clicked "Get Started" and popup closed.');
  }
}
