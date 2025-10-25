import { BasePage } from '../BasePage.js'; // Import the base class for Page Object Models
import { Page } from '@playwright/test'; // Import Playwright's core Page type
import { ROUTES } from '../../utils/constants.js'; // Import application route constants
import { Asserts } from '../../utils/Asserts.js'; // Import custom assertion utilities
import { Logger } from '../../utils/Logger.js'; // Import the custom logging utility

/**
 * Page Object Model for the Application Login Page.
 * Encapsulates locators and methods related to user authentication.
 * Extends BasePage for reusable navigation and interaction methods.
 */
export class LoginPage extends BasePage {
  // Locator for username/email input field, found by its accessible name 'Email'
  usernameInput = this.page.getByRole('textbox', { name: 'Email' });

  // Locator for password input field, found by its accessible name
  passwordInput = this.page.getByRole('textbox', {
    name: 'Enter your password',
  });

  // Locator for login button, found by its accessible name 'Sign In'
  loginButton = this.page.getByRole('button', { name: 'Sign In' });

  /**
   * Constructor initializes the LoginPage object
   * @param page Playwright Page object
   */
  constructor(page: Page) {
    super(page); // Call BasePage constructor to initialize the page object
  }

  /**
   * Navigate directly to the Login page using the defined route constant.
   */
  async goto() {
    await super.goto(ROUTES.LOGIN);
  }

  /**
   * Performs the sequence of actions required to log a user in.
   * @param username User's username or email
   * @param password User's password
   */
  async login(username: string, password: string) {
    Logger.step(`Login username: ${username}`);
    // Fill the username field
    await this.fill(this.usernameInput, username);
    // Fill the password field, passing 'true' to mask the value in logs
    await this.fill(this.passwordInput, password, true);
    // Click the login button to submit the form
    await this.click(this.loginButton);
  }

  /**
   * Validates that the user is currently on the login page (i.e., logged out)
   * by checking for the visibility of the primary login form elements.
   */
  async validateUserLoggedOut() {
    Logger.step('Validate User is logged out');
    // Assert the username input is visible
    await Asserts.assertVisible(this.usernameInput);
    // Assert the password input is visible
    await Asserts.assertVisible(this.passwordInput);
    // Assert the login button is visible
    await Asserts.assertVisible(this.loginButton);
  }
}
