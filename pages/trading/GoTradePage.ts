import { BasePage } from '../BasePage.js'; // Import the foundational class for Page Object Models
import { Page } from '@playwright/test'; // Import necessary Playwright types
import {
  ORDER_SIDE,
  ORDER_STRATEGY,
  ORDER_THRESHOLD_UNIT,
  ROUTES,
  VWAP_UNFILLED_ACTION,
} from '../../utils/constants.js'; // Import application route constants
import { Asserts } from '../../utils/Asserts.js'; // Import custom assertion utilities
import { Logger } from '../../utils/Logger.js';
import {
  LimitEdgeOrder,
  LimitOrder,
  MarketEdgeOrder,
  MarketOrder,
  Order,
  TWAPEdgeOrder,
  TWAPOrder,
  VWAPOrder,
} from '../../types/order.js'; // Import the custom logging utility

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

  // Trade panel locators
  btn_marketEdge = this.page.getByTestId('GOTRADE_ORDERTYPE_MARKET_EDGE');
  btn_limitEdge = this.page.getByTestId('GOTRADE_ORDERTYPE_LIMIT_EDGE');
  btn_twapEdge = this.page.getByTestId('GOTRADE_ORDERTYPE_TWAP_EDGE');
  btn_more = this.page.getByTestId('GOTRADE_ORDERTYPE_MORE');
  btn_limit = this.page.getByTestId('GOTRADE_ORDERTYPE_LIMIT');
  btn_market = this.page.getByTestId('GOTRADE_ORDERTYPE_MARKET');
  btn_twap = this.page.getByTestId('GOTRADE_ORDERTYPE_TWAP');
  btn_vwap = this.page.getByTestId('GOTRADE_ORDERTYPE_VWAP');
  btn_radioTrade = this.page.getByTestId('GOTRADE_ORDERTYPE_RATIO_TRADE');
  btn_targetPosition = this.page.getByTestId(
    'GOTRADE_ORDERTYPE_TARGET_POSITION',
  );

  btn_synmbolDropDown = this.page.getByTestId('symbols-dropdown');
  inpt_searchSymbol = this.page.getByPlaceholder('Search symbol...');
  inpt_quantity = this.page.getByTestId('quantity');
  inpt_price = this.page.getByTestId('price');
  inpt_duration = this.page.getByTestId('duration');
  inpt_threshold = this.page.getByTestId('threshold');
  inpt_interval = this.page.getByTestId('interval');
  inpt_decayFactor = this.page.getByRole('spinbutton', {
    name: 'Decay Factor',
  });
  inpt_maxParticipationRate = this.page.getByRole('textbox', {
    name: 'Max Participation Rate',
  });

  btn_long = this.page.getByTestId('long-button');
  btn_short = this.page.getByTestId('short-button');
  btn_trade = this.page.getByTestId('trade-button');

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
   * Performs the multistep logout process: clicking the profile button, then the Sign out menu item.
   */
  async logout() {
    Logger.step('Log out user');
    // Step 1: Click the profile button (identified by email) to open the menu
    await this.click(await this.getEmail());
    // Step 2: Click the 'Sign out' menu item
    await this.click(this.menu_item_logout);
  }

  /**
   * Validates that the GoTrade page loaded correctly after login.
   * Checks for the visibility of key navigation components.
   * @param email The user's email (passed here, though already stored in this.email)
   */
  async validateGoTradePage() {
    // Assert successful login by checking for the user email button
    await Asserts.assertVisible(await this.getEmail());

    // Assert the visibility of core navigation links/buttons
    await Asserts.assertVisible(this.link_go_terminal);
    await Asserts.assertVisible(this.btn_markets);
    await Asserts.assertVisible(this.btn_trading);
    await Asserts.assertVisible(this.btn_accounts);
  }

  async validateMetrics() {
    Logger.step(
      `Validate metrics eg. Net Asset Value, Asset Utilization, 24h Turnover etc.`,
    );
    await Asserts.assertVisible(await this.getElementByText('Net Asset Value'));
    await Asserts.assertVisible(
      await this.getElementByText('Asset Utilization'),
    );
    await Asserts.assertVisible(await this.getElementByText('24h Turnover'));
    await Asserts.assertVisible(await this.getElementByText('24h PnL'));
    await Asserts.assertVisible(await this.getElementByText('24h Max Run-Up'));
    await Asserts.assertVisible(
      await this.getElementByText('24h Max Drawdown'),
    );
  }

  async selectStrategy(strategy: string) {
    Logger.step(`Selecting Order Strategy: ${strategy}`);

    if (strategy == ORDER_STRATEGY.MARKET_EDGE) {
      await this.click(this.btn_marketEdge);
    }
    if (strategy == ORDER_STRATEGY.LIMIT_EDGE) {
      await this.click(this.btn_limitEdge);
    }
    if (strategy == ORDER_STRATEGY.TWAP_EDGE) {
      await this.click(this.btn_twapEdge);
    }
    if (strategy == ORDER_STRATEGY.LIMIT) {
      await this.click(this.btn_more);
      await this.click(this.btn_limit);
    }
    if (strategy == ORDER_STRATEGY.MARKET) {
      await this.click(this.btn_more);
      await this.click(this.btn_market);
    }
    if (strategy == ORDER_STRATEGY.TWAP) {
      await this.click(this.btn_more);
      await this.click(this.btn_twap);
    }
    if (strategy == ORDER_STRATEGY.VWAP) {
      await this.click(this.btn_more);
      await this.click(this.btn_vwap);
    }
    if (strategy == ORDER_STRATEGY.RATIO_TRADE) {
      await this.click(this.btn_more);
      await this.click(this.btn_radioTrade);
    }
    if (strategy == ORDER_STRATEGY.TARGET_POSITION) {
      await this.click(this.btn_more);
      await this.click(this.btn_targetPosition);
    }
  }

  async selectDuration(duration: number, unit: string) {
    Logger.step(`Enter duration: ${duration} ${unit}`);
    await this.fill(this.inpt_duration, duration.toString());
    //   TODO: Need to implement unit selection
  }

  async selectThreshold(threshold: number, unit: string) {
    Logger.step(`Enter threshold: ${threshold} ${unit}`);
    await this.fill(this.inpt_threshold, threshold.toString());
    //   TODO: Need to implement unit selection
  }

  async selectActionForUnfilledQuantities(option: string) {
    Logger.step(`Selecting ${option} from Action for Unfilled Quantities`);

    if (option == VWAP_UNFILLED_ACTION.EXTEND) {
      await this.click(await this.getElementByText('ExtendIncrease'));
    }
    if (option == VWAP_UNFILLED_ACTION.INCREASE_PARTICIPATION) {
      await this.click(await this.getElementByText('Increase Participation'));
    }
    if (option == VWAP_UNFILLED_ACTION.FAIL) {
      await this.click(await this.getElementByText('Fail'));
    }
  }

  async getSymbolOption(symbol: string) {
    Logger.info(`Return Symbol Option: ${symbol}`);
    return this.page.getByTestId(`symbol-option-${symbol}`);
  }

  async searchSelectSymbol(symbol: string) {
    Logger.step(`Selecting Trade Symbol: ${symbol.toUpperCase()}`);

    const symbolUppercase = symbol.toUpperCase();
    await this.click(this.btn_synmbolDropDown);
    await this.fill(this.inpt_searchSymbol, symbolUppercase);
    await this.click(await this.getSymbolOption(symbolUppercase));
  }

  async placeOrder(order: Order) {
    Logger.step(`Placing Order: ${JSON.stringify(order)}`);

    if (order.strategy == ORDER_STRATEGY.MARKET_EDGE) {
      await this.placeOrderMarketEdge(order);
    }
    if (order.strategy == ORDER_STRATEGY.LIMIT_EDGE) {
      await this.placeOrderLimitEdge(order);
    }
    if (order.strategy == ORDER_STRATEGY.TWAP_EDGE) {
      await this.placeOrderTWAPEdge(order);
    }
    if (order.strategy == ORDER_STRATEGY.LIMIT) {
      await this.placeOrderLimit(order);
    }
    if (order.strategy == ORDER_STRATEGY.MARKET) {
      await this.placeOrderMarket(order);
    }
    if (order.strategy == ORDER_STRATEGY.TWAP) {
      await this.placeOrderTWAP(order);
    }
    if (order.strategy == ORDER_STRATEGY.VWAP) {
      await this.placeOrderVWAP(order);
    }
    // TODO: Need to implement the following strategies
    // if (order.strategy == ORDER_STRATEGY.RATIO_TRADE) {
    //   await this.placeOrderRatioTrade(order);
    // }
    // if (order.strategy == ORDER_STRATEGY.TARGET_POSITION) {
    //   await this.placeOrderTargetPosition(order);
    // }

    if (order.side == ORDER_SIDE.BUY) {
      await this.click(this.btn_long);
    }
    if (order.side == ORDER_SIDE.SELL) {
      await this.click(this.btn_short);
    }

    await this.click(this.btn_trade);
  }

  async placeOrderMarketEdge(order: MarketEdgeOrder) {
    await this.selectStrategy(order.strategy);
    await this.searchSelectSymbol(order.symbol);
    await this.fill(this.inpt_quantity, order.quantity.toString());
    await this.selectDuration(order.duration, order.durationUnit);
    await this.fill(this.inpt_decayFactor, order.decayFactor.toString());
  }

  async placeOrderLimitEdge(order: LimitEdgeOrder) {
    const thresholdUnit =
      order.thresholdUnit ?? ORDER_THRESHOLD_UNIT.PERCENTAGE;

    await this.selectStrategy(order.strategy);
    await this.searchSelectSymbol(order.symbol);
    await this.fill(this.inpt_quantity, order.quantity.toString());
    await this.selectDuration(order.duration, order.durationUnit);

    if (order.price) {
      await this.fill(this.inpt_price, String(order.price));
    }
    if (order.threshold !== undefined) {
      await this.selectThreshold(order.threshold, thresholdUnit);
    }
  }

  async placeOrderTWAPEdge(order: TWAPEdgeOrder) {
    await this.selectStrategy(order.strategy);
    await this.searchSelectSymbol(order.symbol);
    await this.fill(this.inpt_quantity, order.quantity.toString());
    await this.selectDuration(order.duration, order.durationUnit);
    await this.fill(this.inpt_interval, order.interval.toString());
    await this.fill(this.inpt_decayFactor, order.decayFactor.toString());
  }

  async placeOrderLimit(order: LimitOrder) {
    await this.selectStrategy(order.strategy);
    await this.searchSelectSymbol(order.symbol);
    await this.fill(this.inpt_quantity, order.quantity.toString());
    await this.fill(this.inpt_price, order.price.toString());
  }

  async placeOrderMarket(order: MarketOrder) {
    await this.selectStrategy(order.strategy);
    await this.searchSelectSymbol(order.symbol);
    await this.fill(this.inpt_quantity, order.quantity.toString());
  }

  async placeOrderTWAP(order: TWAPOrder) {
    await this.selectStrategy(order.strategy);
    await this.searchSelectSymbol(order.symbol);
    await this.fill(this.inpt_quantity, order.quantity.toString());
    await this.selectDuration(order.duration, order.durationUnit);
    await this.fill(this.inpt_interval, order.interval.toString());
  }

  async placeOrderVWAP(order: VWAPOrder) {
    await this.selectStrategy(order.strategy);
    await this.searchSelectSymbol(order.symbol);
    await this.fill(this.inpt_quantity, order.quantity.toString());
    await this.selectDuration(order.duration, order.durationUnit);
    await this.fill(
      this.inpt_maxParticipationRate,
      order.maxParticipationRate.toString(),
    );
    await this.selectActionForUnfilledQuantities(
      order.actionForUnfilledQuantities,
    );
  }
}
