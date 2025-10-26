import { test } from '@playwright/test';
import {
  DURATION_UNIT,
  ORDER_SIDE,
  ORDER_STRATEGY,
  SYMBOL,
  ORDER_THRESHOLD_UNIT,
  USERS,
  VWAP_UNFILLED_ACTION,
} from '../../utils/constants.js';
import { GoTradePage } from '../../pages/trading/GoTradePage.js';
import {
  LimitEdgeOrder,
  LimitOrder,
  MarketEdgeOrder,
  MarketOrder,
  TWAPEdgeOrder,
  TWAPOrder,
  VWAPOrder,
} from '../../types/order.js';
import { Asserts } from '../../utils/Asserts.js';

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

test.describe('GoTrade > Spot', async () => {
  test.beforeEach(async ({ page }) => {
    goTradePage = new GoTradePage(page, USERS.USER19.username); // Initialize the GoTrade Page Object
    await goTradePage.goto(); // Navigate to the GoTrade page
  });

  test('Market Edge Order', async () => {
    const order: MarketEdgeOrder = {
      strategy: ORDER_STRATEGY.MARKET_EDGE,
      symbol: SYMBOL.ETH_USDT,
      quantity: 0.01,
      side: ORDER_SIDE.BUY,
      duration: 10,
      durationUnit: DURATION_UNIT.SECONDS,
      decayFactor: 1,
    };
    await goTradePage.placeOrder(order);
    await Asserts.assertVisible(
      await goTradePage.getElementByText('Order Accepted'),
    );
  });

  test('Limit Edge Order', async () => {
    const order: LimitEdgeOrder = {
      strategy: ORDER_STRATEGY.LIMIT_EDGE,
      symbol: SYMBOL.ETH_USDT,
      quantity: 0.01,
      price: 10000,
      side: ORDER_SIDE.BUY,
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

  test('TWAP Edge Order', async () => {
    const order: TWAPEdgeOrder = {
      strategy: ORDER_STRATEGY.TWAP_EDGE,
      symbol: SYMBOL.ETH_USDT,
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

  test('Limit Order', async () => {
    const order: LimitOrder = {
      strategy: ORDER_STRATEGY.LIMIT,
      symbol: SYMBOL.ETH_USDT,
      quantity: 0.01,
      side: ORDER_SIDE.BUY,
      price: 10000,
    };
    await goTradePage.placeOrder(order);
    await Asserts.assertVisible(
      await goTradePage.getElementByText('Order Accepted'),
    );
  });

  test('Market Order', async () => {
    const order: MarketOrder = {
      strategy: ORDER_STRATEGY.MARKET,
      symbol: SYMBOL.ETH_USDT,
      quantity: 0.01,
      side: ORDER_SIDE.BUY,
    };
    await goTradePage.placeOrder(order);
    await Asserts.assertVisible(
      await goTradePage.getElementByText('Order Accepted'),
    );
  });

  test('TWAP Order', async () => {
    const order: TWAPOrder = {
      strategy: ORDER_STRATEGY.TWAP,
      symbol: SYMBOL.ETH_USDT,
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

  test('VWAP Order', async () => {
    const order: VWAPOrder = {
      strategy: ORDER_STRATEGY.VWAP,
      symbol: SYMBOL.ETH_USDT,
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
