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

  /*
   * Trade panel locators
   */
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

  chk_advanced = this.page.getByText('Advanced');
  cmbbx_advanced = this.page.getByRole('combobox', { name: 'Time In Force' });

  btn_long = this.page.getByTestId('long-button');
  btn_short = this.page.getByTestId('short-button');
  btn_trade = this.page.getByTestId('trade-button');

  /*
   * Order Management section
   */
  btn_workingOrders = this.page.getByRole('button', {
    name: 'Working Orders',
    exact: true,
  });
  btn_orderCancel = this.page.getByRole('button', { name: 'Cancel' });
  btn_orderModify = this.page.getByRole('button', { name: 'Modify' });
  inpt_orderAmount = this.page.getByRole('spinbutton', { name: 'Amount' });
  inpt_orderPrice = this.page.getByRole('spinbutton', { name: 'Price' });

  btn_orderHistory = this.page.getByRole('button', { name: 'Order History' });
  btn_openPositions = this.page.getByRole('button', { name: 'Open Positions' });
  btn_assets = this.page.getByRole('button', { name: 'Assets' });

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

  // Fetches the Time In Force (TIF) option element by name
  async getOrderTIFOption(timeInForce: string) {
    Logger.info(`Returning Time In Force Option: ${timeInForce}`);
    return this.page.getByRole('option', { name: timeInForce });
  }

  // Selects the desired trading strategy by clicking on the corresponding button
  async selectStrategy(strategy: string) {
    Logger.step(`Selecting Order Strategy: ${strategy}`);

    // Select Market Edge strategy
    if (strategy == ORDER_STRATEGY.MARKET_EDGE) {
      await this.click(this.btn_marketEdge);
    }
    // Select Limit Edge strategy
    if (strategy == ORDER_STRATEGY.LIMIT_EDGE) {
      await this.click(this.btn_limitEdge);
    }
    // Select TWAP Edge strategy
    if (strategy == ORDER_STRATEGY.TWAP_EDGE) {
      await this.click(this.btn_twapEdge);
    }
    // Select regular Limit strategy from "More" options
    if (strategy == ORDER_STRATEGY.LIMIT) {
      await this.click(this.btn_more);
      await this.click(this.btn_limit);
    }
    // Select regular Market strategy from "More" options
    if (strategy == ORDER_STRATEGY.MARKET) {
      await this.click(this.btn_more);
      await this.click(this.btn_market);
    }
    // Select TWAP strategy from "More" options
    if (strategy == ORDER_STRATEGY.TWAP) {
      await this.click(this.btn_more);
      await this.click(this.btn_twap);
    }
    // Select VWAP strategy from "More" options
    if (strategy == ORDER_STRATEGY.VWAP) {
      await this.click(this.btn_more);
      await this.click(this.btn_vwap);
    }
    // Select Ratio Trade strategy from "More" options
    if (strategy == ORDER_STRATEGY.RATIO_TRADE) {
      await this.click(this.btn_more);
      await this.click(this.btn_radioTrade);
    }
    // Select Target Position strategy from "More" options
    if (strategy == ORDER_STRATEGY.TARGET_POSITION) {
      await this.click(this.btn_more);
      await this.click(this.btn_targetPosition);
    }
  }

  // Fills in the order duration field and logs the action
  async selectDuration(duration: number, unit: string) {
    Logger.step(`Enter duration: ${duration} ${unit}`);

    // Fill duration input only if value is non-negative
    if (duration >= 0) {
      await this.fill(this.inpt_duration, duration.toString());
    }
    // TODO: Implement dropdown or field selection for duration unit (e.g., seconds, minutes, etc.)
  }

  // Fills in the threshold value for the order
  async selectThreshold(threshold: number, unit: string) {
    Logger.step(`Enter threshold: ${threshold} ${unit}`);

    // Fill threshold input only if value is non-negative
    if (threshold >= 0) {
      await this.fill(this.inpt_threshold, threshold.toString());
    }
    // TODO: Implement dropdown or field selection for threshold unit (e.g., percentage, absolute)
  }

  // Selects an action for handling unfilled VWAP quantities
  async selectActionForUnfilledQuantities(option: string) {
    Logger.step(`Selecting ${option} from Action for Unfilled Quantities`);

    // Choose "Extend/Increase" action
    if (option == VWAP_UNFILLED_ACTION.EXTEND) {
      await this.click(await this.getElementByText('ExtendIncrease'));
    }
    // Choose "Increase Participation" action
    if (option == VWAP_UNFILLED_ACTION.INCREASE_PARTICIPATION) {
      await this.click(await this.getElementByText('Increase Participation'));
    }
    // Choose "Fail" action
    if (option == VWAP_UNFILLED_ACTION.FAIL) {
      await this.click(await this.getElementByText('Fail'));
    }
  }

  // Returns the web element corresponding to the given trading symbol option
  async getSymbolOption(symbol: string) {
    Logger.info(`Return Symbol Option: ${symbol}`);
    return this.page.getByTestId(`symbol-option-${symbol}`);
  }

  // Searches for and selects a trading symbol from the symbol dropdown
  async searchSelectSymbol(symbol: string) {
    Logger.step(`Selecting Trade Symbol: ${symbol.toUpperCase()}`);

    // Convert symbol to uppercase for consistency
    const symbolUppercase = symbol.toUpperCase();

    // Open symbol dropdown
    await this.click(this.btn_synmbolDropDown);

    // Enter the symbol text into the search field
    await this.fill(this.inpt_searchSymbol, symbolUppercase);

    // Click on the matching symbol option
    await this.click(await this.getSymbolOption(symbolUppercase));
  }

  // Selects a Time-In-Force (TIF) option for the order
  async selectOrderTIF(tif: string) {
    Logger.info(`Selecting Order TIF: ${tif}`);

    // Enable advanced order settings
    await this.check(this.chk_advanced);

    // Open the advanced options dropdown
    await this.click(this.cmbbx_advanced);

    // Select the specified TIF option
    await this.click(await this.getOrderTIFOption(tif));
  }

  // Places an order based on the provided order configuration
  async placeOrder(order: Order) {
    Logger.step(`Placing Order: ${JSON.stringify(order)}`);

    // Handle each strategy type by delegating to the corresponding helper function
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

    // TODO: Implement support for Ratio Trade and Target Position strategies
    // if (order.strategy == ORDER_STRATEGY.RATIO_TRADE) {
    //   await this.placeOrderRatioTrade(order);
    // }
    // if (order.strategy == ORDER_STRATEGY.TARGET_POSITION) {
    //   await this.placeOrderTargetPosition(order);
    // }

    // Choose Buy (Long) or Sell (Short) based on order side
    if (order.side == ORDER_SIDE.BUY) {
      await this.click(this.btn_long);
    }
    if (order.side == ORDER_SIDE.SELL) {
      await this.click(this.btn_short);
    }

    // Execute the trade by clicking the trade button
    await this.click(this.btn_trade);
  }

  // Places a Market Edge order with provided details
  async placeOrderMarketEdge(order: MarketEdgeOrder) {
    Logger.info('Placing Market Edge Order');
    // Select the Market Edge strategy
    await this.selectStrategy(order.strategy);

    // Search and select the trading symbol
    await this.searchSelectSymbol(order.symbol);

    // Fill in the quantity if valid
    if (order.quantity >= 0) {
      await this.fill(this.inpt_quantity, order.quantity.toString());
    }

    // Set order duration and unit
    await this.selectDuration(order.duration, order.durationUnit);

    // Fill in decay factor if specified
    if (order.decayFactor >= 0) {
      await this.fill(this.inpt_decayFactor, order.decayFactor.toString());
    }
  }

  // Places a Limit Edge order with optional price and threshold
  async placeOrderLimitEdge(order: LimitEdgeOrder) {
    Logger.info('Placing Limit Edge Order');
    // Default threshold unit to percentage if not provided
    const thresholdUnit =
      order.thresholdUnit ?? ORDER_THRESHOLD_UNIT.PERCENTAGE;

    // Select the Limit Edge strategy
    await this.selectStrategy(order.strategy);

    // Search and select the trading symbol
    await this.searchSelectSymbol(order.symbol);

    // Fill quantity if valid
    if (order.quantity >= 0) {
      await this.fill(this.inpt_quantity, order.quantity.toString());
    }

    // Set duration and unit
    await this.selectDuration(order.duration, order.durationUnit);

    // Fill in price if provided
    if (order.price) {
      await this.fill(this.inpt_price, String(order.price));
    }

    // Fill threshold value if provided
    if (order.threshold !== undefined) {
      await this.selectThreshold(order.threshold, thresholdUnit);
    }
  }

  // Places a TWAP Edge order (time-weighted average price)
  async placeOrderTWAPEdge(order: TWAPEdgeOrder) {
    Logger.info('Placing TWAP Edge Order');
    // Select the TWAP Edge strategy
    await this.selectStrategy(order.strategy);

    // Search and select the trading symbol
    await this.searchSelectSymbol(order.symbol);

    // Fill order quantity if valid
    if (order.quantity >= 0) {
      await this.fill(this.inpt_quantity, order.quantity.toString());
    }

    // Set duration and unit
    await this.selectDuration(order.duration, order.durationUnit);

    // Set interval if provided
    if (order.interval >= 0) {
      await this.fill(this.inpt_interval, order.interval.toString());
    }

    // Fill decay factor if specified
    if (order.decayFactor >= 0) {
      await this.fill(this.inpt_decayFactor, order.decayFactor.toString());
    }
  }

  // Places a standard Limit order
  async placeOrderLimit(order: LimitOrder) {
    Logger.info('Placing Limit Order');
    // Select Limit strategy
    await this.selectStrategy(order.strategy);

    // Search and select the trading symbol
    await this.searchSelectSymbol(order.symbol);

    // Fill order quantity if valid
    if (order.quantity >= 0) {
      await this.fill(this.inpt_quantity, order.quantity.toString());
    }

    // Fill in price (required for limit orders)
    await this.fill(this.inpt_price, order.price.toString());

    // Select Time-In-Force option if provided
    if (order.tif) {
      await this.selectOrderTIF(order.tif);
    }
  }

  // Places a standard Market order
  async placeOrderMarket(order: MarketOrder) {
    Logger.info('Placing Market Order');
    // Select Market strategy
    await this.selectStrategy(order.strategy);

    // Search and select trading symbol
    await this.searchSelectSymbol(order.symbol);

    // Fill quantity if valid
    if (order.quantity >= 0) {
      await this.fill(this.inpt_quantity, order.quantity.toString());
    }
  }

  // Places a TWAP order with specified interval and duration
  async placeOrderTWAP(order: TWAPOrder) {
    Logger.info('Placing TWAP Order');
    // Select TWAP strategy
    await this.selectStrategy(order.strategy);

    // Search and select trading symbol
    await this.searchSelectSymbol(order.symbol);

    // Fill order quantity if valid
    if (order.quantity >= 0) {
      await this.fill(this.inpt_quantity, order.quantity.toString());
    }

    // Set duration and unit
    await this.selectDuration(order.duration, order.durationUnit);

    // Fill interval if specified
    if (order.interval >= 0) {
      await this.fill(this.inpt_interval, order.interval.toString());
    }
  }

  // Places a VWAP order (volume-weighted average price)
  async placeOrderVWAP(order: VWAPOrder) {
    Logger.info('Placing VWAP Order');
    // Select VWAP strategy
    await this.selectStrategy(order.strategy);

    // Search and select trading symbol
    await this.searchSelectSymbol(order.symbol);

    // Fill quantity if valid
    if (order.quantity >= 0) {
      await this.fill(this.inpt_quantity, order.quantity.toString());
    }

    // Set duration and unit
    await this.selectDuration(order.duration, order.durationUnit);

    // Set maximum participation rate if provided
    if (order.maxParticipationRate >= 0) {
      await this.fill(
        this.inpt_maxParticipationRate,
        order.maxParticipationRate.toString(),
      );
    }

    // Select action for unfilled VWAP quantities
    await this.selectActionForUnfilledQuantities(
      order.actionForUnfilledQuantities,
    );
  }

  // Modifies an existing order's amount and price based on its index
  async modifyOrder(index: number, amount: number, price: number) {
    Logger.step(`Modify Order: Amount: ${amount}, price: ${price} at index: ${index}`);

    // Click on the modify button for the specified order (nth(1) may indicate the latest order)
    await this.click(this.btn_orderModify.nth(1));

    // Update order amount
    await this.fill(this.inpt_orderAmount, amount.toString());

    // Update order price
    await this.fill(this.inpt_orderPrice, price.toString());
  }
}
