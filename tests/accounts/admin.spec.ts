import { test } from "@playwright/test";
import { GoTradePage } from "../../pages/GoTradePage.js";
import { USERS } from "../../utils/Constants.ts";
// import { Asserts } from "../utils/Asserts";

/**
 * Test suite for Accounts > Admin functionality
 */
test.describe("Accounts > Admin", () => {
  /**
   * Test: Add Accounts in Accounts Admin page
   */
  test("Add accounts in Accounts Admin page", async ({
    page,
  }) => {
    const goTradePage = new GoTradePage(page, USERS.USER19.username);
    await goTradePage.goto();
    await goTradePage.validateGoTradePage(USERS.USER19.username);
  });
});