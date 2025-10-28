import { test } from '@playwright/test';
import {
  DURATION_UNIT,
  ORDER_SIDE,
  ORDER_STRATEGY,
  SYMBOL,
  ORDER_THRESHOLD_UNIT,
  USERS,
  VWAP_UNFILLED_ACTION,
  ORDER_TIF,
} from '../../../utils/constants.js';
import { GoTradePage } from '../../../pages/trading/GoTradePage.js';
import {
  LimitEdgeOrder,
  LimitOrder,
  MarketEdgeOrder,
  MarketOrder,
  TWAPEdgeOrder,
  TWAPOrder,
  VWAPOrder,
} from '../../../types/order.js';
import { Asserts } from '../../../utils/Asserts.js';

let goTradePage: GoTradePage;

test.describe('GoTrade > UI validations: ', async () => {
  test.beforeEach(async ({ page }) => {
    goTradePage = new GoTradePage(page, USERS.USER19.username); // Initialize the GoTrade Page Object
    await goTradePage.goto(); // Navigate to the GoTrade page
  });

  test.afterEach(async () => {});

  test('Metrics Validations', async () => {});

  test('Trade Validations', async () => {});

  test('Order book Validations', async () => {});

  test('Last Trade Validations', async () => {});
});

// ===========================================================
// TEST SUITE: GoTrade Spot - Strategies
// Covers placing different Spot strategy orders including
// Market Edge, Limit Edge, TWAP, VWAP, Market, and Limit orders.
// Validates successful order placement and acceptance message.
// ===========================================================
test.describe('GoTrade > Spot > Strategies: ', async () => {
  // Run before each test — initialize page object and navigate to GoTrade page
  test.beforeEach(async ({ page }) => {
    goTradePage = new GoTradePage(page, USERS.USER19.username); // Initialize the GoTrade Page Object for USER19
    await goTradePage.goto(); // Navigate to the GoTrade page before each test
  });

  // Validate placing a Market Edge Sell Order
  test('Market Edge Order: Sell', async () => {
    const order: MarketEdgeOrder = {
      strategy: ORDER_STRATEGY.MARKET_EDGE, // Market Edge strategy
      symbol: SYMBOL.ETH_USDT, // ETH/USDT pair
      quantity: 0.01, // Order quantity
      side: ORDER_SIDE.SELL, // Sell order
      duration: 10, // Duration for the strategy
      durationUnit: DURATION_UNIT.SECONDS, // Duration unit (seconds)
      decayFactor: 1, // Decay factor for Market Edge
    };
    await goTradePage.placeOrder(order); // Place the order on UI
    await Asserts.assertVisible(
      await goTradePage.getElementByText('Order Accepted'), // Verify order confirmation
    );
  });

  // Validate placing a Limit Edge Sell Order
  test('Limit Edge Order: Sell', async () => {
    const order: LimitEdgeOrder = {
      strategy: ORDER_STRATEGY.LIMIT_EDGE, // Limit Edge strategy
      symbol: SYMBOL.ETH_USDT,
      quantity: 0.01,
      price: 10000, // Limit price
      side: ORDER_SIDE.SELL,
      duration: 10,
      durationUnit: DURATION_UNIT.SECONDS,
      threshold: 2, // Edge threshold percentage
      thresholdUnit: ORDER_THRESHOLD_UNIT.PERCENTAGE,
    };
    await goTradePage.placeOrder(order); // Place Limit Edge order
    await Asserts.assertVisible(
      await goTradePage.getElementByText('Order Accepted'), // Verify order accepted
    );
  });

  // Validate placing a TWAP Edge Buy Order
  test('TWAP Edge Order: Buy', async () => {
    const order: TWAPEdgeOrder = {
      strategy: ORDER_STRATEGY.TWAP_EDGE, // TWAP Edge strategy
      symbol: SYMBOL.ETH_USDT,
      quantity: 0.01,
      side: ORDER_SIDE.BUY, // Buy order
      duration: 10,
      durationUnit: DURATION_UNIT.SECONDS,
      interval: 2, // Time interval between executions
      decayFactor: 1, // Decay factor
    };
    await goTradePage.placeOrder(order); // Place TWAP Edge order
    await Asserts.assertVisible(
      await goTradePage.getElementByText('Order Accepted'),
    );
  });

  // Validate placing a simple Limit Buy Order
  test('Limit Order: Buy', async () => {
    const order: LimitOrder = {
      strategy: ORDER_STRATEGY.LIMIT, // Regular Limit order
      symbol: SYMBOL.ETH_USDT,
      quantity: 0.01,
      side: ORDER_SIDE.BUY,
      price: 10000, // Limit price
    };
    await goTradePage.placeOrder(order); // Place Limit order
    await Asserts.assertVisible(
      await goTradePage.getElementByText('Order Accepted'),
    );
  });

  // Validate placing a simple Market Buy Order
  test('Market Order: Buy', async () => {
    const order: MarketOrder = {
      strategy: ORDER_STRATEGY.MARKET, // Market order
      symbol: SYMBOL.ETH_USDT,
      quantity: 0.01,
      side: ORDER_SIDE.BUY,
    };
    await goTradePage.placeOrder(order); // Place Market order
    await Asserts.assertVisible(
      await goTradePage.getElementByText('Order Accepted'),
    );
  });

  // Validate placing a TWAP Buy Order (without Edge)
  test('TWAP Order: Buy', async () => {
    const order: TWAPOrder = {
      strategy: ORDER_STRATEGY.TWAP, // TWAP (Time Weighted Average Price) strategy
      symbol: SYMBOL.ETH_USDT,
      quantity: 0.01,
      side: ORDER_SIDE.BUY,
      duration: 10,
      durationUnit: DURATION_UNIT.SECONDS,
      interval: 2, // Interval between sub-orders
    };
    await goTradePage.placeOrder(order); // Place TWAP order
    await Asserts.assertVisible(
      await goTradePage.getElementByText('Order Accepted'),
    );
  });

  // Validate placing a VWAP Buy Order
  test('VWAP Order: Buy', async () => {
    const order: VWAPOrder = {
      strategy: ORDER_STRATEGY.VWAP, // VWAP (Volume Weighted Average Price) strategy
      symbol: SYMBOL.ETH_USDT,
      quantity: 0.01,
      side: ORDER_SIDE.BUY,
      duration: 10,
      durationUnit: DURATION_UNIT.SECONDS,
      maxParticipationRate: 2, // Maximum allowed participation rate
      actionForUnfilledQuantities: VWAP_UNFILLED_ACTION.EXTEND, // Define action for leftover quantities
    };
    await goTradePage.placeOrder(order); // Place VWAP order
    await Asserts.assertVisible(
      await goTradePage.getElementByText('Order Accepted'), // Verify successful placement
    );
  });
});

// ===========================================================
// TEST SUITE: GoTrade Spot - Field Validations
// Covers input validation for Quantity, Duration, Decay Factor,
// and other numeric fields across various order types.
// ===========================================================
test.describe('GoTrade > Spot > Field Validations Qty, Duration, Decay factor: ', async () => {

  // Common setup before each test
  test.beforeEach(async ({ page }) => {
    goTradePage = new GoTradePage(page, USERS.USER19.username); // Initialize GoTrade page with test user
    await goTradePage.goto(); // Navigate to trading interface before each validation test
  });

  // --- Test: Quantity = 0 ---
  test('Market Edge: Quantity = 0', async () => {
    // Validate that quantity cannot be zero
    const order: MarketEdgeOrder = {
      strategy: ORDER_STRATEGY.MARKET_EDGE,
      symbol: SYMBOL.ETH_USDT,
      quantity: 0.0,
      side: ORDER_SIDE.BUY,
      duration: 10,
      durationUnit: DURATION_UNIT.SECONDS,
      decayFactor: 1,
    };
    await goTradePage.placeOrder(order);
    await Asserts.assertVisible(await goTradePage.getElementByText('Quantity must be greater than 0'));
  });

  // --- Test: Quantity exceeds account balance ---
  test('Market Edge: Quantity > Account/Holding Balance', async () => {
    // Validate that placing an order larger than available balance should fail
    const order: MarketEdgeOrder = {
      strategy: ORDER_STRATEGY.MARKET_EDGE,
      symbol: SYMBOL.ETH_USDT,
      quantity: 9999999999, // Unrealistically high quantity
      side: ORDER_SIDE.BUY,
      duration: 10,
      durationUnit: DURATION_UNIT.SECONDS,
      decayFactor: 1,
    };
    await goTradePage.placeOrder(order);

    // TODO: Bug: Order is being accepted despite exceeding available balance
    await Asserts.assertVisible(await goTradePage.getElementByText('Order Accepted'));
  });

  // --- Test: Blank Quantity (no input) ---
  test('Market Edge: Quantity = blank', async () => {
    const order: MarketEdgeOrder = {
      strategy: ORDER_STRATEGY.MARKET_EDGE,
      symbol: SYMBOL.ETH_USDT,
      quantity: -1, // Sending -1 simulates no input in the UI
      side: ORDER_SIDE.BUY,
      duration: 10,
      durationUnit: DURATION_UNIT.SECONDS,
      decayFactor: 1,
    };
    await goTradePage.placeOrder(order);
    await Asserts.assertVisible(await goTradePage.getElementByText('Quantity must be greater than 0'));
  });

  // --- Test: Duration = 0 ---
  test('Market Edge: duration = 0', async () => {
    // Duration cannot be zero
    const order: MarketEdgeOrder = {
      strategy: ORDER_STRATEGY.MARKET_EDGE,
      symbol: SYMBOL.ETH_USDT,
      quantity: 0.01,
      side: ORDER_SIDE.BUY,
      duration: 0,
      durationUnit: DURATION_UNIT.SECONDS,
      decayFactor: 1,
    };
    await goTradePage.placeOrder(order);
    await Asserts.assertVisible(await goTradePage.getElementByText('Duration must be greater than 0'));
  });

  // --- Test: Duration = extremely large number ---
  test('Market Edge: duration = very large number eg. 999999999999999 months', async () => {
    // Validate that excessively large durations should ideally be restricted
    const order: MarketEdgeOrder = {
      strategy: ORDER_STRATEGY.MARKET_EDGE,
      symbol: SYMBOL.ETH_USDT,
      quantity: 0.01,
      side: ORDER_SIDE.BUY,
      duration: 999999999999999,
      durationUnit: DURATION_UNIT.MONTHS,
      decayFactor: 1,
    };
    await goTradePage.placeOrder(order);
    // TODO: System currently accepts this; validation should ideally restrict unrealistic durations
    await Asserts.assertVisible(await goTradePage.getElementByText('Order Accepted'));
  });

  // --- Test: Blank Duration (no input) ---
  test('Market Edge: duration = blank', async () => {
    const order: MarketEdgeOrder = {
      strategy: ORDER_STRATEGY.MARKET_EDGE,
      symbol: SYMBOL.ETH_USDT,
      quantity: 0.01,
      side: ORDER_SIDE.BUY,
      duration: -1, // Sending -1 simulates no duration entered in UI
      durationUnit: DURATION_UNIT.SECONDS,
      decayFactor: 1,
    };
    await goTradePage.placeOrder(order);
    await Asserts.assertVisible(await goTradePage.getElementByText('Duration must be greater than 0'));
  });

  // --- Test: Decay Factor = 0 ---
  test('Market Edge: Decay Factor = 0', async () => {
    // Decay factor must be at least 0.01
    const order: MarketEdgeOrder = {
      strategy: ORDER_STRATEGY.MARKET_EDGE,
      symbol: SYMBOL.ETH_USDT,
      quantity: 0.01,
      side: ORDER_SIDE.BUY,
      duration: 10,
      durationUnit: DURATION_UNIT.SECONDS,
      decayFactor: 0,
    };
    await goTradePage.placeOrder(order);
    await Asserts.assertVisible(await goTradePage.getElementByText('Decay factor must be greater than or equal to 0.01'));
  });

  // --- Test: Extremely large Decay Factor ---
  test('Market Edge: Decay Factor = very large number eg. 999999999999999', async () => {
    // Large values might still be accepted; should evaluate whether a limit is needed
    const order: MarketEdgeOrder = {
      strategy: ORDER_STRATEGY.MARKET_EDGE,
      symbol: SYMBOL.ETH_USDT,
      quantity: 0.01,
      side: ORDER_SIDE.BUY,
      duration: 10,
      durationUnit: DURATION_UNIT.SECONDS,
      decayFactor: 999999999999999,
    };
    await goTradePage.placeOrder(order);
    await Asserts.assertVisible(await goTradePage.getElementByText('Order Accepted'));
  });

  // --- Test: Blank Decay Factor ---
  test('Market Edge: Decay Factor = blank', async () => {
    const order: MarketEdgeOrder = {
      strategy: ORDER_STRATEGY.MARKET_EDGE,
      symbol: SYMBOL.ETH_USDT,
      quantity: 0.01,
      side: ORDER_SIDE.BUY,
      duration: 10,
      durationUnit: DURATION_UNIT.SECONDS,
      decayFactor: -1, // -1 simulates blank value in the UI
    };
    await goTradePage.placeOrder(order);
    // TODO: Bug: Decay factor is mandatory, should not accept blank values
    await Asserts.assertVisible(await goTradePage.getElementByText('Decay factor must be greater than or equal to 0.01'));
  });

  // --- Test: Limit Edge Price = 0 ---
  test('Limit Edge: Price = 0', async () => {
    // Price should not be zero for limit-type orders
    const order: LimitEdgeOrder = {
      strategy: ORDER_STRATEGY.LIMIT_EDGE,
      symbol: SYMBOL.ETH_USDT,
      quantity: 0.01,
      price: 0,
      side: ORDER_SIDE.BUY,
      duration: 10,
      durationUnit: DURATION_UNIT.SECONDS,
      threshold: 2,
      thresholdUnit: ORDER_THRESHOLD_UNIT.PERCENTAGE,
    };
    await goTradePage.placeOrder(order);
    // TODO: Bug: System currently accepts zero price; should be validated
    await Asserts.assertVisible(await goTradePage.getElementByText('Order Accepted'));
  });

  // --- Test: Limit Edge Price = negative value ---
  test('Limit Edge: Price = -ve', async () => {
    // Negative prices should not be allowed
    const order: LimitEdgeOrder = {
      strategy: ORDER_STRATEGY.LIMIT_EDGE,
      symbol: SYMBOL.ETH_USDT,
      quantity: 0.01,
      price: -10000,
      side: ORDER_SIDE.BUY,
      duration: 10,
      durationUnit: DURATION_UNIT.SECONDS,
      threshold: 2,
      thresholdUnit: ORDER_THRESHOLD_UNIT.PERCENTAGE,
    };
    await goTradePage.placeOrder(order);
    // TODO: Bug: Negative price still accepted; validation missing
    await Asserts.assertVisible(await goTradePage.getElementByText('Order Accepted'));
  });

  // --- Test: Limit Edge Threshold = 0 ---
  test('Limit Edge: Threshold = 0', async () => {
    // Threshold of 0% should be invalid
    const order: LimitEdgeOrder = {
      strategy: ORDER_STRATEGY.LIMIT_EDGE,
      symbol: SYMBOL.ETH_USDT,
      quantity: 0.01,
      price: 10000,
      side: ORDER_SIDE.BUY,
      duration: 10,
      durationUnit: DURATION_UNIT.SECONDS,
      threshold: 0,
      thresholdUnit: ORDER_THRESHOLD_UNIT.PERCENTAGE,
    };
    await goTradePage.placeOrder(order);
    // TODO: Bug: 0% threshold accepted; should be rejected
    await Asserts.assertVisible(await goTradePage.getElementByText('Order Accepted'));
  });

  // --- Test: TWAP Edge Interval = 0 ---
  test('TWAP Edge: Interval = 0', async () => {
    // Interval between executions must be greater than zero
    const order: TWAPEdgeOrder = {
      strategy: ORDER_STRATEGY.TWAP_EDGE,
      symbol: SYMBOL.ETH_USDT,
      quantity: 0.01,
      side: ORDER_SIDE.BUY,
      duration: 10,
      durationUnit: DURATION_UNIT.SECONDS,
      interval: 0,
      decayFactor: 1,
    };
    await goTradePage.placeOrder(order);
    await Asserts.assertVisible(await goTradePage.getElementByText('Interval must be greater than 0'));
  });

  // --- Test: TWAP Edge Interval = blank ---
  test('TWAP Edge: Interval = blank', async () => {

    const order: TWAPEdgeOrder = {
      strategy: ORDER_STRATEGY.TWAP_EDGE,
      symbol: SYMBOL.ETH_USDT,
      quantity: 0.01,
      side: ORDER_SIDE.BUY,
      duration: 10,
      durationUnit: DURATION_UNIT.SECONDS,
      interval: -1, // -1 simulates missing interval field
      decayFactor: 1,
    };
    await goTradePage.placeOrder(order);
    await Asserts.assertVisible(await goTradePage.getElementByText('Interval must be greater than 0'));
  });

  // --- Test: VWAP Max Participation Rate = 0 ---
  test('VWAP: MaxParticipationRate = 0', async () => {
    // Max participation rate cannot be zero
    const order: VWAPOrder = {
      strategy: ORDER_STRATEGY.VWAP,
      symbol: SYMBOL.ETH_USDT,
      quantity: 0.01,
      side: ORDER_SIDE.BUY,
      duration: 10,
      durationUnit: DURATION_UNIT.SECONDS,
      maxParticipationRate: 0,
      actionForUnfilledQuantities: VWAP_UNFILLED_ACTION.EXTEND,
    };
    await goTradePage.placeOrder(order);
    await Asserts.assertVisible(await goTradePage.getElementByText('Participation must be greater than 0'));
  });

  // --- Test: VWAP Max Participation Rate = blank ---
  test('VWAP: MaxParticipationRate = blank', async () => {
    const order: VWAPOrder = {
      strategy: ORDER_STRATEGY.VWAP,
      symbol: SYMBOL.ETH_USDT,
      quantity: 0.01,
      side: ORDER_SIDE.BUY,
      duration: 10,
      durationUnit: DURATION_UNIT.SECONDS,
      maxParticipationRate: -1, // -1 simulates no value entered in UI
      actionForUnfilledQuantities: VWAP_UNFILLED_ACTION.EXTEND,
    };
    await goTradePage.placeOrder(order);
    await Asserts.assertVisible(await goTradePage.getElementByText('Participation must be greater than 0'));
  });

});

// =============================================
// TEST SUITE: Time-In-Force (TIF) order types
// =============================================
test.describe('GoTrade > Spot > TIF: ', async () => {

  // Common setup before each TIF test
  test.beforeEach(async ({ page }) => {
    goTradePage = new GoTradePage(page, USERS.USER19.username); // Initialize GoTrade page for the test user
    await goTradePage.goto(); // Open GoTrade trading screen before each test
  });

  // --- Test: Good Till Cancelled (GTC) order ---
  test('GTC', async () => {
    // Create a Limit order with GTC (remains active until cancelled manually)
    const order: LimitOrder = {
      strategy: ORDER_STRATEGY.LIMIT,
      symbol: SYMBOL.BTC_USDT,
      quantity: 0.0001,
      side: ORDER_SIDE.BUY,
      price: 200000,
      tif: ORDER_TIF.GTC,
    };
    await goTradePage.placeOrder(order); // Place the order
    await Asserts.assertVisible(await goTradePage.getElementByText('Order Accepted')); // Verify success
  });

  // --- Test: Good Till Triggered (GTT) order ---
  test('GTT', async () => {
    // Create a Limit order that stays active until a trigger condition is met
    const order: LimitOrder = {
      strategy: ORDER_STRATEGY.LIMIT,
      symbol: SYMBOL.BTC_USDT,
      quantity: 0.0001,
      side: ORDER_SIDE.BUY,
      price: 200000,
      tif: ORDER_TIF.GTT,
    };
    await goTradePage.placeOrder(order);
    await Asserts.assertVisible(await goTradePage.getElementByText('Order Accepted'));
  });

  // --- Test: Fill Or Kill (FOK) order ---
  test('FOK', async () => {
    // FOK ensures the order is executed fully or cancelled immediately
    const order: LimitOrder = {
      strategy: ORDER_STRATEGY.LIMIT,
      symbol: SYMBOL.BTC_USDT,
      quantity: 0.0001,
      side: ORDER_SIDE.BUY,
      price: 200000,
      tif: ORDER_TIF.FOK,
    };
    await goTradePage.placeOrder(order);
    await Asserts.assertVisible(await goTradePage.getElementByText('Order Accepted'));
  });

  // --- Test: Immediate Or Cancel (IOC) order ---
  test('IOC', async () => {
    // IOC executes any available quantity immediately and cancels the rest
    const order: LimitOrder = {
      strategy: ORDER_STRATEGY.LIMIT,
      symbol: SYMBOL.BTC_USDT,
      quantity: 0.0001,
      side: ORDER_SIDE.BUY,
      price: 200000,
      tif: ORDER_TIF.IOC,
    };
    await goTradePage.placeOrder(order);
    await Asserts.assertVisible(await goTradePage.getElementByText('Order Accepted'));
  });

  // --- Test: DAY order ---
  test('DAY', async () => {
    // DAY order remains valid only for the trading day
    const order: LimitOrder = {
      strategy: ORDER_STRATEGY.LIMIT,
      symbol: SYMBOL.BTC_USDT,
      quantity: 0.0001,
      side: ORDER_SIDE.BUY,
      price: 200000,
      tif: ORDER_TIF.DAY,
    };
    await goTradePage.placeOrder(order);
    await Asserts.assertVisible(await goTradePage.getElementByText('Order Accepted'));
  });
});


// =============================================
// TEST SUITE: Order Update functionality
// =============================================
test.describe('GoTrade > Spot > Order Update', async () => {

  // Setup: place an order before each update test
  test.beforeEach(async ({ page }) => {
    goTradePage = new GoTradePage(page, USERS.USER19.username); // Initialize GoTrade page
    await goTradePage.goto(); // Open GoTrade screen
    const order: LimitOrder = {
      strategy: ORDER_STRATEGY.LIMIT,
      symbol: SYMBOL.ETH_USDT,
      quantity: 0.01,
      side: ORDER_SIDE.BUY,
      price: 10000,
    };
    await goTradePage.placeOrder(order); // Place a fresh order to modify
  });

  // --- Test: Modify existing Limit Buy order ---
  test('Limit Order: Buy', async () => {
    await goTradePage.modifyOrder(1, 0.02, 8000); // Modify order #1 with new quantity and price
    await Asserts.assertVisible(await goTradePage.getElementByText('Order modified successfully')); // Confirm modification
  });

});


// =============================================
// TEST SUITE: Order Cancellation functionality
// =============================================
test.describe('GoTrade > Spot > Order Cancel', async () => {

  // Setup: place a cancellable order before each test
  test.beforeEach(async ({ page }) => {
    goTradePage = new GoTradePage(page, USERS.USER19.username); // Initialize GoTrade page
    await goTradePage.goto(); // Navigate to trading page
    const order: LimitOrder = {
      strategy: ORDER_STRATEGY.LIMIT,
      symbol: SYMBOL.ETH_USDT,
      quantity: 0.01,
      side: ORDER_SIDE.BUY,
      price: 100,
    };
    await goTradePage.placeOrder(order); // Place order for cancellation
    await Asserts.assertVisible(await goTradePage.getElementByText('Order Accepted')); // Verify successful placement
  });

  // --- Test: Cancel existing Limit Buy order ---
  test('Limit Order: Cancel', async () => {
    await goTradePage.click(goTradePage.btn_orderCancel.nth(1)); // Click cancel button of first order
    await Asserts.assertVisible(await goTradePage.getElementByText('Order cancel received')); // Verify cancel confirmation
  });

});
