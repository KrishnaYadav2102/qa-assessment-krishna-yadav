// pages/OnboardingPopup.ts
import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage"; // Assuming you use BasePage
import { Asserts } from "../utils/Asserts"; // To use your custom assertions

export class OnboardingPopup extends BasePage {
  // Locators specific to the popup
  readonly popupContainer = this.page.locator(
    '[data-testid="onboarding-card"]',
  );
  readonly welcomeHeader = this.popupContainer.getByText("Welcome to GoTrade!");
  readonly getStartedButton: Locator =
    this.popupContainer.getByText("Get Started");

  constructor(page: Page) {
    super(page);
  }

  /**
   * Checks if the onboarding popup is currently visible.
   */
  async isPopupVisible(): Promise<boolean> {
    // Use your BasePage method to wait for the container to attach/appear.
    // We use attached/visible to handle cases where it might flicker.
    try {
      await this.waitForLocator(this.popupContainer, "visible", 10000);
      console.log("PopUp visible!");
      return true;
    } catch (error) {
      console.log(`PopUp not visible!: \n${error}`);
      return false;
    }
  }

  /**
   * Confirms the popup is visible and validates its key elements.
   */
  async validatePopupContent() {
    console.log("Validating Onboarding Popup content...");
    await Asserts.assertTextContains(
      this.popupContainer,
      "Welcome to GoTrade!",
    );
    await Asserts.assertText(this.getStartedButton, "Get Started");
  }

  /**
   * Clicks the "Get Started" button to close the popup.
   * @returns A promise that resolves after the button is clicked.
   */
  async clickGetStarted() {
    await this.getStartedButton.click();

    // Optional: Wait for the popup to disappear
    await this.waitForLocator(this.popupContainer, "hidden", 5000);
    console.log('Clicked "Get Started" and popup closed.');
  }
}
