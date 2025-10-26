import { Page, Locator } from '@playwright/test';
import { Logger } from '../utils/Logger.js'; // Import the custom logging utility

/**
 * BasePage class provides common reusable methods for all page objects.
 * All specific Page Object Models (POMs) should extend this class.
 */
export class BasePage {
  protected readonly page: Page;
  // The Playwright Page object is stored internally for use by all methods
  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate to a given URL and wait for the page to load.
   * Note: This relies on the page load event, not a custom loader wait.
   * @param url The URL to navigate to
   */
  async goto(url: string) {
    Logger.info(`Navigating to ${url}`);
    await this.page.goto(url);
  }

  /**
   * Helper method to return a locator based on its text content.
   * @param text The exact text content to search for
   */
  async getElementByText(text: string) {
    Logger.info(`Returning element by text: ${text}`);
    return this.page.getByText(text);
  }

  /**
   * Click on a given locator.
   * This is a wrapper around the standard Playwright click() method.
   * @param locator The Playwright Locator to click
   */
  async click(locator: Locator) {
    Logger.info(`Clicking on ${locator}`);
    await locator.click();
  }

  /**
   * Check or Uncheck a given locator (e.g., checkbox, radio button).
   * @param locator The Playwright Locator to check/uncheck
   * @param should_be_checked boolean value True if it needs to be checked else false (default is true)
   */
  async check(locator: Locator, should_be_checked: boolean = true) {
    Logger.info(
      `Switch/Checkbox/Radio/Toggle on ${locator} should be checked: ${should_be_checked}`,
    );

    if (should_be_checked) {
      await locator.check();
    } else {
      await locator.uncheck();
    }
  }

  /**
   * Clears the text from a given input locator.
   * @param locator The Playwright Locator of the input field
   */
  async clear(locator: Locator) {
    Logger.info(`Clearing input field: ${locator}`);
    await locator.clear();
  }

  /**
   * Fill text into a given input locator, with optional password masking in logs.
   * @param locator The Playwright Locator of the input field
   * @param text The text to enter
   * @param is_password Flag to enable log masking for security (default: false)
   * @param clear Flag to clear the field before filling (default: true)
   */
  async fill(
    locator: Locator,
    text: string,
    is_password: boolean = false,
    clear: boolean = true,
  ) {
    const EXPOSE_COUNT = 3; // Number of characters to expose for password logging
    let logText: string;

    if (is_password && text.length > EXPOSE_COUNT) {
      // 1. Get the first three characters ("abc")
      const prefix = text.substring(0, EXPOSE_COUNT);

      // 2. Calculate the number of characters to mask
      const maskLength = text.length - EXPOSE_COUNT;

      // 3. Create the mask string (e.g., "**********")
      const mask = '*'.repeat(maskLength);

      // 4. Combine them to show a partially masked password in logs
      logText = prefix + mask;
    } else {
      // If not a password, or if the text is too short, print the text as is (or use '******')
      logText = is_password ? '******' : text;
    }

    if (clear) {
      await this.clear(locator); // Clear the field if requested
    }
    Logger.info(`Enter ${logText} into ${locator}`);
    await locator.fill(text); // Perform the fill action
  }

  /**
   * Waits for a custom application loader/spinner to appear and then disappear.
   * This handles asynchronous data loading on the page.
   * @param loaderSelector CSS/XPath selector for loader element (default: specific image)
   * @param appearTimeout Max time to wait for loader to appear (default: 2s)
   * @param disappearTimeout Max time to wait for loader to disappear (default: 10s)
   */
  async waitForLoader(
    loaderSelector: string = 'img[src="/img/spin.gif"]', // Default loader image selector
    appearTimeout = 2000, // Max wait for loader to appear
    disappearTimeout = 10000, // Max wait for loader to disappear
  ) {
    const loader = this.page.locator(loaderSelector);

    try {
      // Step 1: Wait for loader to appear (if it shows up within timeout)
      await loader.waitFor({ state: 'visible', timeout: appearTimeout });
    } catch {
      // Loader never appeared → safe to continue execution
      return;
    }

    // Step 2: Wait for loader to disappear before interacting with the page
    await loader.waitFor({ state: 'hidden', timeout: disappearTimeout });
  }

  /**
   * Waits for the specified locator to reach a desired state ('visible' or 'hidden').
   * This is a generic wrapper for Playwright's locator.waitFor().
   *
   * @param locator - The Playwright Locator to wait for
   * @param state - The state to wait for: 'visible' or 'hidden' (default: 'visible')
   * @param timeout - Maximum time to wait in milliseconds (default: 5000ms)
   */
  async waitForLocator(
    locator: Locator,
    state: 'visible' | 'hidden' = 'visible',
    timeout = 5000,
  ) {
    Logger.info(`Wait for ${locator} to be visible or hidden`);
    await locator.waitFor({ state, timeout });
  }
}
