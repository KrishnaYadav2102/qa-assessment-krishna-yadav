import { BasePage } from "./BasePage.ts";
import { Page } from "@playwright/test";
import { Asserts } from "../utils/Asserts.ts";
import {ROUTES} from "../utils/Constants.js";

export class GoTradePage extends BasePage {
  private readonly email: string;
  link_go_terminal = this.page.getByRole("link", { name: "GoTerminal" });

  btn_markets = this.page.getByRole("button", { name: "Markets" });
  btn_trading = this.page.getByRole("button", { name: "Trading" });
  btn_accounts = this.page.getByRole("button", { name: "Accounts" });

  menu_item_logout = this.page.getByRole("menuitem", { name: "Sign out" });

  /**
   * Constructor initializes the GoTradePage object
   * @param page Playwright Page object
   */
  constructor(page: Page, email: string) {
    super(page); // Call BasePage constructor
    this.email = email;
  }

  async goto() {
    await super.goto(ROUTES.GOTRADE);
  }

  async getEmail() {
    const headerContainer = this.page.locator("header");
    return headerContainer.getByRole("button", { name: this.email, exact: true });
  }

  async validateGoTradePage(email: string) {
    console.log(`Printing it temporarily to avoid lint error: ${email}`);
    // await Asserts.assertVisible(await this.getEmail(email));
    await Asserts.assertVisible(this.link_go_terminal);
    await Asserts.assertVisible(this.btn_markets);
    await Asserts.assertVisible(this.btn_trading);
    // await Asserts.assertVisible(this.btn_accounts);
  }

  async logout() {
    await this.click(await this.getEmail());
    await this.click(this.menu_item_logout);
  }
}
