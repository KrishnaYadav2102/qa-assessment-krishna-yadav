import { test } from '@playwright/test';
import { GoTradePage } from '../../../pages/trading/GoTradePage.js';
import {
  DURATION_UNIT,
  ORDER_SIDE,
  ORDER_STRATEGY,
  ORDER_THRESHOLD_UNIT,
  SYMBOL,
  USERS,
  VWAP_UNFILLED_ACTION,
} from '../../../utils/constants.js';
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

// Test suite for verifying all trading strategy types under "Swap" instruments
test.describe('GoTrade > Swap > Strategies: ', async () => {
  // Runs before each test to set up the test environment
  test.beforeEach(async ({ page }) => {
    // Initialize GoTrade Page Object with USER19 credentials
    goTradePage = new GoTradePage(page, USERS.USER19.username);
    // Navigate to the GoTrade page before each test
    await goTradePage.goto();
  });

  // Test: Place a Market Edge Sell Order
  test('Market Edge Order: Sell', async () => {
    const order: MarketEdgeOrder = {
      strategy: ORDER_STRATEGY.MARKET_EDGE, // Order strategy type
      symbol: SYMBOL.BTC_USDT_SWAP, // Trading symbol for Swap contract
      quantity: 0.01, // Order quantity
      side: ORDER_SIDE.SELL, // Order side: SELL
      duration: 10, // Duration value
      durationUnit: DURATION_UNIT.SECONDS, // Duration unit: seconds
      decayFactor: 1, // Order decay factor
    };
    // Place the Market Edge order
    await goTradePage.placeOrder(order);
    // Assert that the success message appears
    await Asserts.assertVisible(
      await goTradePage.getElementByText('Order Accepted'),
    );
  });

  // Test: Place a Limit Edge Sell Order
  test('Limit Edge Order: Sell', async () => {
    const order: LimitEdgeOrder = {
      strategy: ORDER_STRATEGY.LIMIT_EDGE,
      symbol: SYMBOL.BTC_USDT_SWAP,
      quantity: 0.01,
      price: 10000, // Limit price for order
      side: ORDER_SIDE.SELL,
      duration: 10,
      durationUnit: DURATION_UNIT.SECONDS,
      threshold: 2, // Threshold for limit edge order
      thresholdUnit: ORDER_THRESHOLD_UNIT.PERCENTAGE,
    };
    await goTradePage.placeOrder(order);
    await Asserts.assertVisible(
      await goTradePage.getElementByText('Order Accepted'),
    );
  });

  // Test: Place a TWAP Edge Buy Order
  test('TWAP Edge Order: Buy', async () => {
    const order: TWAPEdgeOrder = {
      strategy: ORDER_STRATEGY.TWAP_EDGE,
      symbol: SYMBOL.BTC_USDT_SWAP,
      quantity: 0.01,
      side: ORDER_SIDE.BUY,
      duration: 10,
      durationUnit: DURATION_UNIT.SECONDS,
      interval: 2, // Interval between order placements
      decayFactor: 1, // TWAP decay factor
    };
    await goTradePage.placeOrder(order);
    await Asserts.assertVisible(
      await goTradePage.getElementByText('Order Accepted'),
    );
  });

  // Test: Place a Limit Buy Order
  test('Limit Order: Buy', async () => {
    const order: LimitOrder = {
      strategy: ORDER_STRATEGY.LIMIT,
      symbol: SYMBOL.BTC_USDT_SWAP,
      quantity: 0.01,
      side: ORDER_SIDE.BUY,
      price: 10000,
    };
    await goTradePage.placeOrder(order);
    await Asserts.assertVisible(
      await goTradePage.getElementByText('Order Accepted'),
    );
  });

  // Test: Place a Market Buy Order
  test('Market Order: Buy', async () => {
    const order: MarketOrder = {
      strategy: ORDER_STRATEGY.MARKET,
      symbol: SYMBOL.BTC_USDT_SWAP,
      quantity: 0.01,
      side: ORDER_SIDE.BUY,
    };
    await goTradePage.placeOrder(order);
    await Asserts.assertVisible(
      await goTradePage.getElementByText('Order Accepted'),
    );
  });

  // Test: Place a TWAP Buy Order
  test('TWAP Order: Buy', async () => {
    const order: TWAPOrder = {
      strategy: ORDER_STRATEGY.TWAP,
      symbol: SYMBOL.BTC_USDT_SWAP,
      quantity: 0.01,
      side: ORDER_SIDE.BUY,
      duration: 10,
      durationUnit: DURATION_UNIT.SECONDS,
      interval: 2,
    };
    await goTradePage.placeOrder(order);
    await Asserts.assertVisible(
      await goTradePage.getElementByText('Order Accepted'),
    );
  });

  // Test: Place a VWAP Buy Order
  test('VWAP Order: Buy', async () => {
    const order: VWAPOrder = {
      strategy: ORDER_STRATEGY.VWAP,
      symbol: SYMBOL.BTC_USDT_SWAP,
      quantity: 0.01,
      side: ORDER_SIDE.BUY,
      duration: 10,
      durationUnit: DURATION_UNIT.SECONDS,
      maxParticipationRate: 2, // Maximum participation rate for VWAP
      actionForUnfilledQuantities: VWAP_UNFILLED_ACTION.EXTEND, // Action to take for unfilled quantities
    };
    await goTradePage.placeOrder(order);
    await Asserts.assertVisible(
      await goTradePage.getElementByText('Order Accepted'),
    );
  });
});
