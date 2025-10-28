import {
  DURATION_UNIT,
  ORDER_SIDE,
  ORDER_STRATEGY,
  SYMBOL,
  ORDER_THRESHOLD_UNIT,
  VWAP_UNFILLED_ACTION,
  ORDER_TIF,
} from '../utils/constants.js';

/**
 * Base structure shared across all order types.
 * Includes common fields like symbol, side, and quantity.
 */
type BaseOrder = {
  // Symbol of the instrument being traded
  symbol: (typeof SYMBOL)[keyof typeof SYMBOL];

  // Direction of trade (BUY or SELL)
  side: (typeof ORDER_SIDE)[keyof typeof ORDER_SIDE];

  // Order quantity (must be > 0)
  quantity: number;
};

/**
 * MARKET_EDGE strategy
 * A time-decaying algorithmic order with duration and decay factor.
 */
export type MarketEdgeOrder = BaseOrder & {
  strategy: typeof ORDER_STRATEGY.MARKET_EDGE;

  // Total duration of the strategy
  duration: number;

  // Unit of duration (seconds, minutes, etc.)
  durationUnit: (typeof DURATION_UNIT)[keyof typeof DURATION_UNIT];

  // Controls how quickly participation decays over time
  decayFactor: number;
};

/**
 * LIMIT_EDGE strategy
 * A limit-based algorithmic order with optional price and threshold controls.
 */
export type LimitEdgeOrder = BaseOrder & {
  strategy: typeof ORDER_STRATEGY.LIMIT_EDGE;

  // Optional limit price; can be skipped for market-following logic
  price?: number;

  // Duration and its unit (for controlling order lifetime)
  duration: number;
  durationUnit: (typeof DURATION_UNIT)[keyof typeof DURATION_UNIT];

  // Optional execution threshold (e.g., % away from reference price)
  threshold?: number;
  thresholdUnit?: (typeof ORDER_THRESHOLD_UNIT)[keyof typeof ORDER_THRESHOLD_UNIT];
};

/**
 * TWAP_EDGE strategy
 * Executes evenly over time with a decay factor for dynamic pacing.
 */
export type TWAPEdgeOrder = BaseOrder & {
  strategy: typeof ORDER_STRATEGY.TWAP_EDGE;

  // Total order duration and interval between slices
  duration: number;
  durationUnit: (typeof DURATION_UNIT)[keyof typeof DURATION_UNIT];
  interval: number;

  // Decay factor to adjust participation over time
  decayFactor: number;
};

/**
 * LIMIT strategy
 * A simple limit order with optional Time-In-Force (TIF) property.
 */
export type LimitOrder = BaseOrder & {
  strategy: typeof ORDER_STRATEGY.LIMIT;

  // Mandatory price for limit order
  price: number;

  // Optional TIF (GTC, DAY, IOC, etc.)
  tif?: (typeof ORDER_TIF)[keyof typeof ORDER_TIF];
};

/**
 * MARKET strategy
 * Executes immediately at the current market price.
 */
export type MarketOrder = BaseOrder & {
  strategy: typeof ORDER_STRATEGY.MARKET;
};

/**
 * TWAP strategy
 * Splits a large order into smaller chunks over a set duration and interval.
 */
export type TWAPOrder = BaseOrder & {
  strategy: typeof ORDER_STRATEGY.TWAP;

  duration: number;
  durationUnit: (typeof DURATION_UNIT)[keyof typeof DURATION_UNIT];
  interval: number;
};

/**
 * VWAP strategy
 * Targets execution volume to follow the market’s volume profile.
 */
export type VWAPOrder = BaseOrder & {
  strategy: typeof ORDER_STRATEGY.VWAP;

  duration: number;
  durationUnit: (typeof DURATION_UNIT)[keyof typeof DURATION_UNIT];

  // Max percentage of total market volume to participate in
  maxParticipationRate: number;

  // Defines how to handle unfilled quantities after session ends
  actionForUnfilledQuantities: (typeof VWAP_UNFILLED_ACTION)[keyof typeof VWAP_UNFILLED_ACTION];
};

/**
 * Placeholder for RATIO_TRADE strategy.
 * TODO: Define ratio trade structure (e.g., spread or pair trade parameters)
 */
type RatioTradeOrder = BaseOrder & {
  strategy: typeof ORDER_STRATEGY.RATIO_TRADE;
};

/**
 * Placeholder for TARGET_POSITION strategy.
 * TODO: Define fields for position target, allocation, etc.
 */
type TargetPositionOrder = BaseOrder & {
  strategy: typeof ORDER_STRATEGY.TARGET_POSITION;
};

/**
 * Union of all supported order types.
 * Used as the main `Order` type throughout the app.
 * Enables type narrowing using `order.strategy`.
 */
export type Order =
  | MarketEdgeOrder
  | LimitEdgeOrder
  | TWAPEdgeOrder
  | LimitOrder
  | MarketOrder
  | TWAPOrder
  | VWAPOrder
  | RatioTradeOrder
  | TargetPositionOrder;
