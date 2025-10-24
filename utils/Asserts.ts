import { expect, Locator } from '@playwright/test';
import { Logger } from './Logger.js';

export class Asserts {
  /**
   * Assert that a given element is visible on the page.
   * @param locator The Playwright Locator to check visibility
   */
  static async assertText(locator: Locator, expectedText: string) {
    Logger.info(
      `Checking if element "${locator}" have text: "${expectedText}"`,
    );
    await expect(locator).toHaveText(expectedText);
  }

  /**
   * Assert that a given element is visible on the page.
   * @param locator The Playwright Locator to check visibility
   */
  static async assertVisible(locator: Locator) {
    Logger.info(`Checking for visibility of ${locator}`);
    await expect(locator).toBeVisible();
  }

  /**
   * Wrapper method to assert that a locator contains specific text
   * @param locator Playwright Locator to check
   * @param expectedText The text that should be contained
   */
  static async assertTextContains(locator: Locator, expectedText: string) {
    Logger.info(
      `Checking if element "${locator}" contains text: "${expectedText}"`,
    );
    await expect(locator).toContainText(expectedText);
  }

  /**
   * Asserts that a form input has the expected value
   * @param locator The input field Locator
   * @param expectedValue The value expected in the input
   */
  static async assertInputValue(locator: Locator, expectedValue: string) {
    Logger.info(
      `Checking if input element "${locator}" contains value: "${expectedValue}"`,
    );
    await expect(locator).toHaveValue(expectedValue);
  }
}
