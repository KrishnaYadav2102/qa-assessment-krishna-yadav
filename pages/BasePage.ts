import { Page, Locator } from '@playwright/test';
import { Logger } from '../utils/Logger.js';

/**
 * BasePage class provides common reusable methods for all page objects.
 * Handles navigation, element interactions, assertions, and loader waits.
 */
export class BasePage {
  protected readonly page: Page;
  // The Playwright Page object is shared across all methods
  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate to a given URL and wait for the loader to disappear.
   * @param url The URL to navigate to
   */
  async goto(url: string) {
    Logger.info(`Navigating to ${url}`);
    await this.page.goto(url);
  }

  async getElementByText(text: string) {
    Logger.info(`Returning element by text: ${text}`);
    return this.page.getByText(text);
  }

  /**
   * Click on a given locator.
   * @param locator The Playwright Locator to click
   */
  async click(locator: Locator) {
    Logger.info(`Clicking on ${locator}`);
    await locator.click();
  }

  /**
   * Fill text into a given input locator.
   * @param locator The Playwright Locator of the input field
   * @param text The text to enter
   */
  async fill(locator: Locator, text: string, is_password: boolean = false) {
    const EXPOSE_COUNT = 3;
    let logText: string;

    if (is_password && text.length > EXPOSE_COUNT) {
      // 1. Get the first three characters ("abc")
      const prefix = text.substring(0, EXPOSE_COUNT);

      // 2. Calculate the number of characters to mask
      const maskLength = text.length - EXPOSE_COUNT;

      // 3. Create the mask string (e.g., "**********")
      const mask = '*'.repeat(maskLength);

      // 4. Combine them
      logText = prefix + mask;
    } else {
      // If not a password, or if the text is too short, print the text as is (or use '******')
      logText = is_password ? '******' : text;
    }

    Logger.info(`Enter ${logText} into ${locator}`);
    await locator.fill(text);
  }

  /**
   * Waits for a loader/spinner to appear and then disappear.
   * If no loader appears within `appearTimeout`, it silently continues.
   * @param loaderSelector CSS/XPath selector for loader element
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
   * Waits for the specified locator to reach a desired state.
   *
   * @param locator - The Playwright Locator to wait for
   * @param state - The state to wait for: 'visible' or 'hidden' (default: 'visible')
   * @param timeout - Maximum time to wait in milliseconds (default: 5000ms)
   *
   * Usage:
   *   await waitForLocator(page.locator('#submitBtn'));           // Waits for visibility
   *   await waitForLocator(page.locator('#loader'), 'hidden');   // Waits for loader to disappear
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
