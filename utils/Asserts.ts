import { expect, Locator } from '@playwright/test';
import { Logger } from './Logger.js'; // Import the custom logging utility

/**
 * Utility class for common Playwright assertions.
 * This class wraps standard Playwright expect() functions with logging for better report visibility.
 */
export class Asserts {
  /**
   * Assert that a given element's text content matches the exact expected string.
   * Uses Playwright's toHaveText().
   * @param locator The Playwright Locator to check visibility
   * @param expectedText The exact text string expected in the locator
   */
  static async assertText(locator: Locator, expectedText: string) {
    // Log the assertion step for visibility in the test report/console
    Logger.info(
      `Checking if element "${locator}" have text: "${expectedText}"`,
    );
    await expect(locator).toHaveText(expectedText);
  }

  /**
   * Assert that a given element is present in the DOM and visible on the page.
   * Uses Playwright's toBeVisible().
   * @param locator The Playwright Locator to check visibility
   */
  static async assertVisible(locator: Locator) {
    // Log the action before performing the visibility check
    Logger.info(`Checking for visibility of ${locator}`);
    await expect(locator).toBeVisible();
  }

  /**
   * Wrapper method to assert that a locator contains specific text (a substring).
   * Uses Playwright's toContainText().
   * @param locator Playwright Locator to check
   * @param expectedText The text that should be contained within the element's text
   */
  static async assertTextContains(locator: Locator, expectedText: string) {
    // Log the assertion step
    Logger.info(
      `Checking if element "${locator}" contains text: "${expectedText}"`,
    );
    await expect(locator).toContainText(expectedText);
  }

  /**
   * Asserts that a form input has the expected value in its 'value' attribute.
   * Uses Playwright's toHaveValue().
   * @param locator The input field Locator
   * @param expectedValue The value expected in the input field
   */
  static async assertInputValue(locator: Locator, expectedValue: string) {
    // Log the assertion step
    Logger.info(
      `Checking if input element "${locator}" contains value: "${expectedValue}"`,
    );
    await expect(locator).toHaveValue(expectedValue);
  }
}
