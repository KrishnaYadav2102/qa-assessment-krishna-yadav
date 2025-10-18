import { BasePage } from "./BasePage";
import { Page } from "@playwright/test";
import { ROUTES } from "../utils/Constants";
import { Asserts } from "../utils/Asserts";

export class LoginPage extends BasePage {
  // Locator for username/email input field
  usernameInput = this.page.locator('input[name="email"]');

  // Locator for password input field
  passwordInput = this.page.locator('input[name="password"]');

  // Locator for login button
  loginButton = this.page.getByRole("button", { name: "Sign In" });

  /**
   * Constructor initializes the LoginPage object
   * @param page Playwright Page object
   */
  constructor(page: Page) {
    super(page); // Call BasePage constructor
  }

  /**
   * Navigate to Login page
   */
  async goto() {
    await super.goto(ROUTES.LOGIN);
  }

  /**
   * Performs login action with given username and password
   * @param username User's username or email
   * @param password User's password
   */
  async login(username: string, password: string) {
    await this.fill(this.usernameInput, username); // Fill username
    await this.fill(this.passwordInput, password); // Fill password
    await this.click(this.loginButton); // Click login button
  }

  /**
   * Validates that the user is logged out by checking visibility of login form elements
   */
  async validateUserLoggedOut() {
    await Asserts.assertVisible(this.usernameInput); // Username input should be visible
    await Asserts.assertVisible(this.passwordInput); // Password input should be visible
    await Asserts.assertVisible(this.loginButton); // Login button should be visible
  }
}
