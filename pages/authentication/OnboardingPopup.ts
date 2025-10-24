// pages/OnboardingPopup.ts
import { Page, Locator } from '@playwright/test';
import { BasePage } from '../BasePage.js';
import { Asserts } from '../../utils/Asserts.js';
import { Logger } from '../../utils/Logger.js';

export class OnboardingPopup extends BasePage {
  readonly popupContainer = this.page.getByTestId('onboarding-card');
  readonly welcomeHeader = this.popupContainer.getByText('Welcome to GoTrade!');
  readonly getStartedButton: Locator =
    this.popupContainer.getByText('Get Started');

  constructor(page: Page) {
    super(page);
  }

  /**
   * Checks if the onboarding popup is currently visible.
   */
  async isPopupVisible(): Promise<boolean> {
    // Use your BasePage method to wait for the container to attach/appear.
    // We use attached/visible to handle cases where it might flicker.
    Logger.info('Checking if Onboarding pop-up is visible!');
    try {
      await this.waitForLocator(this.popupContainer, 'visible', 10000);
      Logger.info('PopUp visible!');
      return true;
    } catch (error) {
      Logger.info(`PopUp not visible!: \n${error}`);
      return false;
    }
  }

  /**
   * Confirms the popup is visible and validates its key elements.
   */
  async validatePopupContent() {
    Logger.step('Validate Onboarding Popup content');
    await Asserts.assertTextContains(
      this.popupContainer,
      'Welcome to GoTrade!',
    );
    await Asserts.assertText(this.getStartedButton, 'Get Started');
  }

  /**
   * Clicks the "Get Started" button to close the popup.
   * @returns A promise that resolves after the button is clicked.
   */
  async clickGetStarted() {
    await this.getStartedButton.click();

    // Optional: Wait for the popup to disappear
    await this.waitForLocator(this.popupContainer, 'hidden', 5000);
    Logger.info('Clicked "Get Started" and popup closed.');
  }
}
