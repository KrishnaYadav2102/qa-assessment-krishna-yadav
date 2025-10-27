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

test.describe('GoTrade > Swap > Strategies: ', async () => {
  test.beforeEach(async ({ page }) => {
    goTradePage = new GoTradePage(page, USERS.USER19.username); // Initialize the GoTrade Page Object
    await goTradePage.goto(); // Navigate to the GoTrade page
  });

  test('Market Edge Order: Sell', async () => {
    const order: MarketEdgeOrder = {
      strategy: ORDER_STRATEGY.MARKET_EDGE,
      symbol: SYMBOL.BTC_USDT_SWAP,
      quantity: 0.01,
      side: ORDER_SIDE.SELL,
      duration: 10,
      durationUnit: DURATION_UNIT.SECONDS,
      decayFactor: 1,
    };
    await goTradePage.placeOrder(order);
    await Asserts.assertVisible(
      await goTradePage.getElementByText('Order Accepted'),
    );
  });

  test('Limit Edge Order: Sell', async () => {
    const order: LimitEdgeOrder = {
      strategy: ORDER_STRATEGY.LIMIT_EDGE,
      symbol: SYMBOL.BTC_USDT_SWAP,
      quantity: 0.01,
      price: 10000,
      side: ORDER_SIDE.SELL,
      duration: 10,
      durationUnit: DURATION_UNIT.SECONDS,
      threshold: 2,
      thresholdUnit: ORDER_THRESHOLD_UNIT.PERCENTAGE,
    };
    await goTradePage.placeOrder(order);
    await Asserts.assertVisible(
      await goTradePage.getElementByText('Order Accepted'),
    );
  });

  test('TWAP Edge Order: Buy', async () => {
    const order: TWAPEdgeOrder = {
      strategy: ORDER_STRATEGY.TWAP_EDGE,
      symbol: SYMBOL.BTC_USDT_SWAP,
      quantity: 0.01,
      side: ORDER_SIDE.BUY,
      duration: 10,
      durationUnit: DURATION_UNIT.SECONDS,
      interval: 2,
      decayFactor: 1,
    };
    await goTradePage.placeOrder(order);
    await Asserts.assertVisible(
      await goTradePage.getElementByText('Order Accepted'),
    );
  });

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

  test('VWAP Order: Buy', async () => {
    const order: VWAPOrder = {
      strategy: ORDER_STRATEGY.VWAP,
      symbol: SYMBOL.BTC_USDT_SWAP,
      quantity: 0.01,
      side: ORDER_SIDE.BUY,
      duration: 10,
      durationUnit: DURATION_UNIT.SECONDS,
      maxParticipationRate: 2,
      actionForUnfilledQuantities: VWAP_UNFILLED_ACTION.EXTEND,
    };
    await goTradePage.placeOrder(order);
    await Asserts.assertVisible(
      await goTradePage.getElementByText('Order Accepted'),
    );
  });
});
