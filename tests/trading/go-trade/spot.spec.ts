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

test.describe('GoTrade > Spot > Strategies: ', async () => {
  test.beforeEach(async ({ page }) => {
    goTradePage = new GoTradePage(page, USERS.USER19.username); // Initialize the GoTrade Page Object
    await goTradePage.goto(); // Navigate to the GoTrade page
  });

  test('Market Edge Order: Sell', async () => {
    const order: MarketEdgeOrder = {
      strategy: ORDER_STRATEGY.MARKET_EDGE,
      symbol: SYMBOL.ETH_USDT,
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
      symbol: SYMBOL.ETH_USDT,
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

  test('Limit Order: Buy', async () => {
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

  test('Market Order: Buy', async () => {
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

  test('TWAP Order: Buy', async () => {
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

  test('VWAP Order: Buy', async () => {
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

test.describe('GoTrade > Spot > Field Validations Qty, Duration, Decay factor: ', async () => {
  test.beforeEach(async ({ page }) => {
    goTradePage = new GoTradePage(page, USERS.USER19.username); // Initialize the GoTrade Page Object
    await goTradePage.goto(); // Navigate to the GoTrade page
  });

  test('Market Edge: Quantity = 0', async () => {
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
    await Asserts.assertVisible(
      await goTradePage.getElementByText('Quantity must be greater than 0'),
    );
  });

  test('Market Edge: Quantity > Account/Holding Balance', async () => {
    const order: MarketEdgeOrder = {
      strategy: ORDER_STRATEGY.MARKET_EDGE,
      symbol: SYMBOL.ETH_USDT,
      quantity: 9999999999,
      side: ORDER_SIDE.BUY,
      duration: 10,
      durationUnit: DURATION_UNIT.SECONDS,
      decayFactor: 1,
    };
    await goTradePage.placeOrder(order);

    // TODO: Bug: The order is getting accepted even though the order quantity is way higher than the account balance
    // The below assertion is incorrect for this test
    await Asserts.assertVisible(
      await goTradePage.getElementByText('Order Accepted'),
    );
  });

  test('Market Edge: Quantity = blank', async () => {
    const order: MarketEdgeOrder = {
      strategy: ORDER_STRATEGY.MARKET_EDGE,
      symbol: SYMBOL.ETH_USDT,
      quantity: -1, // Sending any -ve value will not enter anything in UI
      side: ORDER_SIDE.BUY,
      duration: 10,
      durationUnit: DURATION_UNIT.SECONDS,
      decayFactor: 1,
    };
    await goTradePage.placeOrder(order);
    await Asserts.assertVisible(
      await goTradePage.getElementByText('Quantity must be greater than 0'),
    );
  });

  test('Market Edge: duration = 0', async () => {
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
    await Asserts.assertVisible(
      await goTradePage.getElementByText('Duration must be greater than 0'),
    );
  });

  test('Market Edge: duration = very large number eg. 999999999999999 months', async () => {
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
    // TODO: Although currently the Order is getting accepted but there should be some validation on this huge duration
    await Asserts.assertVisible(
      await goTradePage.getElementByText('Order Accepted'),
    );
  });

  test('Market Edge: duration = blank', async () => {
    const order: MarketEdgeOrder = {
      strategy: ORDER_STRATEGY.MARKET_EDGE,
      symbol: SYMBOL.ETH_USDT,
      quantity: 0.01,
      side: ORDER_SIDE.BUY,
      duration: -1, // Sending any -ve value will not enter anything in UI
      durationUnit: DURATION_UNIT.SECONDS,
      decayFactor: 1,
    };
    await goTradePage.placeOrder(order);
    await Asserts.assertVisible(
      await goTradePage.getElementByText('Duration must be greater than 0'),
    );
  });

  test('Market Edge: Decay Factor = 0', async () => {
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
    await Asserts.assertVisible(
      await goTradePage.getElementByText(
        'Decay factor must be greater than or equal to 0.01',
      ),
    );
  });

  test('Market Edge: Decay Factor = very large number eg. 999999999999999', async () => {
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
    // Not sure if we should keep a cap on the Decay factor
    await Asserts.assertVisible(
      await goTradePage.getElementByText('Order Accepted'),
    );
  });

  test('Market Edge: Decay Factor = blank', async () => {
    const order: MarketEdgeOrder = {
      strategy: ORDER_STRATEGY.MARKET_EDGE,
      symbol: SYMBOL.ETH_USDT,
      quantity: 0.01,
      side: ORDER_SIDE.BUY,
      duration: 10,
      durationUnit: DURATION_UNIT.SECONDS,
      decayFactor: -1, // Sending any -ve value will not enter anything in UI
    };
    await goTradePage.placeOrder(order);
    // TODO: Bug: Decay factor is not an optional field the order is getting accepted in case its blank
    await Asserts.assertVisible(
      await goTradePage.getElementByText(
        'Decay factor must be greater than or equal to 0.01',
      ),
    );
  });

  test('Limit Edge: Price = 0', async () => {
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
    // TODO: Bug: Price is optional but shouldn't allow 0 unless its handled in the business logic
    await Asserts.assertVisible(
      await goTradePage.getElementByText('Order Accepted'),
    );
  });

  test('Limit Edge: Price = -ve', async () => {
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
    // TODO: Bug: Price is optional but shouldn't allow -ve value unless its handled in the business logic
    await Asserts.assertVisible(
      await goTradePage.getElementByText('Order Accepted'),
    );
  });

  test('Limit Edge: Threshold = 0', async () => {
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
    // TODO: Bug: threshold is optional but shouldn't allow 0 unless its handled in the business logic
    await Asserts.assertVisible(
      await goTradePage.getElementByText('Order Accepted'),
    );
  });

  test('TWAP Edge: Interval = 0', async () => {
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
    await Asserts.assertVisible(
      await goTradePage.getElementByText('Interval must be greater than 0'),
    );
  });

  test('TWAP Edge: Interval = blank', async () => {
    const order: TWAPEdgeOrder = {
      strategy: ORDER_STRATEGY.TWAP_EDGE,
      symbol: SYMBOL.ETH_USDT,
      quantity: 0.01,
      side: ORDER_SIDE.BUY,
      duration: 10,
      durationUnit: DURATION_UNIT.SECONDS,
      interval: -1, // Sending any -ve value will not enter anything in UI
      decayFactor: 1,
    };
    await goTradePage.placeOrder(order);
    await Asserts.assertVisible(
      await goTradePage.getElementByText('Interval must be greater than 0'),
    );
  });

  test('VWAP: MaxParticipationRate = 0', async () => {
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
    await Asserts.assertVisible(
      await goTradePage.getElementByText(
        'Participation must be greater than 0',
      ),
    );
  });

  test('VWAP: MaxParticipationRate = blank', async () => {
    const order: VWAPOrder = {
      strategy: ORDER_STRATEGY.VWAP,
      symbol: SYMBOL.ETH_USDT,
      quantity: 0.01,
      side: ORDER_SIDE.BUY,
      duration: 10,
      durationUnit: DURATION_UNIT.SECONDS,
      maxParticipationRate: -1, // Sending any -ve value will not enter anything in UI
      actionForUnfilledQuantities: VWAP_UNFILLED_ACTION.EXTEND,
    };
    await goTradePage.placeOrder(order);
    await Asserts.assertVisible(
      await goTradePage.getElementByText(
        'Participation must be greater than 0',
      ),
    );
  });
});

test.describe('GoTrade > Spot > TIF: ', async () => {
  test.beforeEach(async ({ page }) => {
    goTradePage = new GoTradePage(page, USERS.USER19.username); // Initialize the GoTrade Page Object
    await goTradePage.goto(); // Navigate to the GoTrade page
  });

  test('GTC', async () => {
    const order: LimitOrder = {
      strategy: ORDER_STRATEGY.LIMIT,
      symbol: SYMBOL.BTC_USDT,
      quantity: 0.0001,
      side: ORDER_SIDE.BUY,
      price: 200000,
      tif: ORDER_TIF.GTC,
    };
    await goTradePage.placeOrder(order);
    await Asserts.assertVisible(
      await goTradePage.getElementByText('Order Accepted'),
    );
  });

  test('GTT', async () => {
    const order: LimitOrder = {
      strategy: ORDER_STRATEGY.LIMIT,
      symbol: SYMBOL.BTC_USDT,
      quantity: 0.0001,
      side: ORDER_SIDE.BUY,
      price: 200000,
      tif: ORDER_TIF.GTT,
    };
    await goTradePage.placeOrder(order);
    await Asserts.assertVisible(
      await goTradePage.getElementByText('Order Accepted'),
    );
  });

  test('FOK', async () => {
    const order: LimitOrder = {
      strategy: ORDER_STRATEGY.LIMIT,
      symbol: SYMBOL.BTC_USDT,
      quantity: 0.0001,
      side: ORDER_SIDE.BUY,
      price: 200000,
      tif: ORDER_TIF.FOK,
    };
    await goTradePage.placeOrder(order);
    await Asserts.assertVisible(
      await goTradePage.getElementByText('Order Accepted'),
    );
  });

  test('IOC', async () => {
    const order: LimitOrder = {
      strategy: ORDER_STRATEGY.LIMIT,
      symbol: SYMBOL.BTC_USDT,
      quantity: 0.0001,
      side: ORDER_SIDE.BUY,
      price: 200000,
      tif: ORDER_TIF.IOC,
    };
    await goTradePage.placeOrder(order);
    await Asserts.assertVisible(
      await goTradePage.getElementByText('Order Accepted'),
    );
  });

  test('DAY', async () => {
    const order: LimitOrder = {
      strategy: ORDER_STRATEGY.LIMIT,
      symbol: SYMBOL.BTC_USDT,
      quantity: 0.0001,
      side: ORDER_SIDE.BUY,
      price: 200000,
      tif: ORDER_TIF.DAY,
    };
    await goTradePage.placeOrder(order);
    await Asserts.assertVisible(
      await goTradePage.getElementByText('Order Accepted'),
    );
  });
});
