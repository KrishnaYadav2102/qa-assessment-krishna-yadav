import { BasePage } from '../BasePage.js'; // Import the foundational class for Page Object Models
import { Page } from '@playwright/test'; // Import necessary Playwright types
import { ROUTES } from '../../utils/constants.js'; // Import application route constants
import { Asserts } from '../../utils/Asserts.js'; // Import custom assertion utilities
import { Logger } from '../../utils/Logger.js'; // Import the custom logging utility

/**
 * Page Object Model for the main GoTrade page (the landing page after login).
 * Extends BasePage for common functionalities like navigation, clicks, and waits.
 */
export class GoTradePage extends BasePage {
  private readonly email: string; // User's email, used to find the profile button

  // Locators for key navigation elements
  link_go_terminal = this.page.getByRole('link', { name: 'GoTerminal' });
  btn_markets = this.page.getByRole('button', { name: 'Markets' });
  btn_trading = this.page.getByRole('button', { name: 'Trading' });
  btn_accounts = this.page.getByRole('button', {
    name: 'Accounts',
    exact: true,
  });
  // Locator for the sign-out option within the profile dropdown menu
  menu_item_logout = this.page.getByRole('menuitem', { name: 'Sign out' });

  /**
   * Constructor initializes the GoTradePage object
   * @param page Playwright Page object
   * @param email The user's email, required for validation and logout functionality
   */
  constructor(page: Page, email: string) {
    super(page); // Call BasePage constructor to initialize the page object
    this.email = email; // Store the user email for later use
  }

  /**
   * Navigates directly to the GoTrade page using the defined route.
   */
  async goto() {
    await super.goto(ROUTES.GO_TRADE);
  }

  /**
   * Retrieves the locator for the user's profile button (which typically displays the email).
   * This button is necessary to open the logout menu.
   */
  async getEmail() {
    Logger.info(`Getting element button by email ${this.email}`);
    const headerContainer = this.page.locator('header'); // Scope the search to the header for robustness
    // Find the button with the user's exact email in the header
    return headerContainer.getByRole('button', {
      name: this.email,
      exact: true,
    });
  }

  /**
   * Validates that the GoTrade page loaded correctly after login.
   * Checks for the visibility of key navigation components.
   * @param email The user's email (passed here, though already stored in this.email)
   */
  async validateGoTradePage(email: string) {
    // This logger call is a placeholder, demonstrating that the email parameter is unused locally
    Logger.step(`Printing it temporarily to avoid lint error: ${email}`);

    // Assert successful login by checking for the user email button
    await Asserts.assertVisible(await this.getEmail());

    // Assert the visibility of core navigation links/buttons
    await Asserts.assertVisible(this.link_go_terminal);
    await Asserts.assertVisible(this.btn_markets);
    await Asserts.assertVisible(this.btn_trading);
    await Asserts.assertVisible(this.btn_accounts);
  }

  /**
   * Performs the multistep logout process: clicking the profile button, then the Sign out menu item.
   */
  async logout() {
    Logger.step('Log out user');
    // Step 1: Click the profile button (identified by email) to open the menu
    await this.click(await this.getEmail());
    // Step 2: Click the 'Sign out' menu item
    await this.click(this.menu_item_logout);
  }
}
