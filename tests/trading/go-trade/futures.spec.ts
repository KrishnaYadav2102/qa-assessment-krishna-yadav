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

//
// ✅ Test Suite: GoTrade > Futures > Strategies
// This suite verifies multiple order strategies (Market, Limit, TWAP, VWAP, etc.)
// under the Futures module using different configurations.
//
test.describe('GoTrade > Futures > Strategies: ', async () => {

  // Runs before each test — sets up page object and navigates to GoTrade page
  test.beforeEach(async ({ page }) => {
    goTradePage = new GoTradePage(page, USERS.USER19.username); // Initialize GoTrade Page Object with user
    await goTradePage.goto(); // Navigate to the GoTrade page before each test
  });

  //
  // 🧾 Test Case 1: Market Edge Order - SELL
  // Places a Market Edge order with SELL side and verifies the "Order Accepted" confirmation
  //
  test('Market Edge Order: Sell', async () => {
    const order: MarketEdgeOrder = {
      strategy: ORDER_STRATEGY.MARKET_EDGE,
      symbol: SYMBOL.BTC_USDT_260626,
      quantity: 0.01,
      side: ORDER_SIDE.SELL,
      duration: 10,
      durationUnit: DURATION_UNIT.SECONDS,
      decayFactor: 1,
    };

    await goTradePage.placeOrder(order); // Execute order placement
    await Asserts.assertVisible(await goTradePage.getElementByText('Order Accepted')); // Verify success message
  });

  //
  // 🧾 Test Case 2: Limit Edge Order - SELL
  // Places a Limit Edge order with threshold parameters and verifies successful order placement
  //
  test('Limit Edge Order: Sell', async () => {
    const order: LimitEdgeOrder = {
      strategy: ORDER_STRATEGY.LIMIT_EDGE,
      symbol: SYMBOL.BTC_USDT_260626,
      quantity: 0.01,
      price: 10000,
      side: ORDER_SIDE.SELL,
      duration: 10,
      durationUnit: DURATION_UNIT.SECONDS,
      threshold: 2,
      thresholdUnit: ORDER_THRESHOLD_UNIT.PERCENTAGE,
    };

    await goTradePage.placeOrder(order);
    await Asserts.assertVisible(await goTradePage.getElementByText('Order Accepted'));
  });

  //
  // 🧾 Test Case 3: TWAP Edge Order - BUY
  // Tests a TWAP (Time-Weighted Average Price) order using edge parameters (interval, decayFactor)
  //
  test('TWAP Edge Order: Buy', async () => {
    const order: TWAPEdgeOrder = {
      strategy: ORDER_STRATEGY.TWAP_EDGE,
      symbol: SYMBOL.BTC_USDT_260626,
      quantity: 0.01,
      side: ORDER_SIDE.BUY,
      duration: 10,
      durationUnit: DURATION_UNIT.SECONDS,
      interval: 2,
      decayFactor: 1,
    };

    await goTradePage.placeOrder(order);
    await Asserts.assertVisible(await goTradePage.getElementByText('Order Accepted'));
  });

  //
  // 🧾 Test Case 4: Limit Order - BUY
  // Basic limit order placement with static price and BUY direction
  //
  test('Limit Order: Buy', async () => {
    const order: LimitOrder = {
      strategy: ORDER_STRATEGY.LIMIT,
      symbol: SYMBOL.BTC_USDT_260626,
      quantity: 0.01,
      side: ORDER_SIDE.BUY,
      price: 10000,
    };

    await goTradePage.placeOrder(order);
    await Asserts.assertVisible(await goTradePage.getElementByText('Order Accepted'));
  });

  //
  // 🧾 Test Case 5: Market Order - BUY
  // Verifies Market order placement and success message
  //
  test('Market Order: Buy', async () => {
    const order: MarketOrder = {
      strategy: ORDER_STRATEGY.MARKET,
      symbol: SYMBOL.BTC_USDT_260626,
      quantity: 0.01,
      side: ORDER_SIDE.BUY,
    };

    await goTradePage.placeOrder(order);
    await Asserts.assertVisible(await goTradePage.getElementByText('Order Accepted'));
  });

  //
  // 🧾 Test Case 6: TWAP Order - BUY
  // Tests standard TWAP strategy order with duration and interval configuration
  //
  test('TWAP Order: Buy', async () => {
    const order: TWAPOrder = {
      strategy: ORDER_STRATEGY.TWAP,
      symbol: SYMBOL.BTC_USDT_260626,
      quantity: 0.01,
      side: ORDER_SIDE.BUY,
      duration: 10,
      durationUnit: DURATION_UNIT.SECONDS,
      interval: 2,
    };

    await goTradePage.placeOrder(order);
    await Asserts.assertVisible(await goTradePage.getElementByText('Order Accepted'));
  });

  //
  // 🧾 Test Case 7: VWAP Order - BUY
  // Tests Volume-Weighted Average Price (VWAP) order with participation and unfilled action config
  //
  test('VWAP Order: Buy', async () => {
    const order: VWAPOrder = {
      strategy: ORDER_STRATEGY.VWAP,
      symbol: SYMBOL.BTC_USDT_260626,
      quantity: 0.01,
      side: ORDER_SIDE.BUY,
      duration: 10,
      durationUnit: DURATION_UNIT.SECONDS,
      maxParticipationRate: 2,
      actionForUnfilledQuantities: VWAP_UNFILLED_ACTION.EXTEND,
    };

    await goTradePage.placeOrder(order);
    await Asserts.assertVisible(await goTradePage.getElementByText('Order Accepted'));
  });
});
