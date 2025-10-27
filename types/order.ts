import {
  DURATION_UNIT,
  ORDER_SIDE,
  ORDER_STRATEGY,
  SYMBOL,
  ORDER_THRESHOLD_UNIT,
  VWAP_UNFILLED_ACTION,
  ORDER_TIF,
} from '../utils/constants.js';

type BaseOrder = {
  symbol: (typeof SYMBOL)[keyof typeof SYMBOL];
  side: (typeof ORDER_SIDE)[keyof typeof ORDER_SIDE];
  quantity: number;
};

export type MarketEdgeOrder = BaseOrder & {
  strategy: typeof ORDER_STRATEGY.MARKET_EDGE;
  duration: number;
  durationUnit: (typeof DURATION_UNIT)[keyof typeof DURATION_UNIT];
  decayFactor: number;
};

export type LimitEdgeOrder = BaseOrder & {
  strategy: typeof ORDER_STRATEGY.LIMIT_EDGE;
  price?: number;
  duration: number;
  durationUnit: (typeof DURATION_UNIT)[keyof typeof DURATION_UNIT];
  threshold?: number;
  thresholdUnit?: (typeof ORDER_THRESHOLD_UNIT)[keyof typeof ORDER_THRESHOLD_UNIT];
};

export type TWAPEdgeOrder = BaseOrder & {
  strategy: typeof ORDER_STRATEGY.TWAP_EDGE;
  duration: number;
  durationUnit: (typeof DURATION_UNIT)[keyof typeof DURATION_UNIT];
  interval: number;
  decayFactor: number;
};

export type LimitOrder = BaseOrder & {
  strategy: typeof ORDER_STRATEGY.LIMIT;
  price: number;
  tif?: (typeof ORDER_TIF)[keyof typeof ORDER_TIF];
};

export type MarketOrder = BaseOrder & {
  strategy: typeof ORDER_STRATEGY.MARKET;
};

export type TWAPOrder = BaseOrder & {
  strategy: typeof ORDER_STRATEGY.TWAP;
  duration: number;
  durationUnit: (typeof DURATION_UNIT)[keyof typeof DURATION_UNIT];
  interval: number;
};

export type VWAPOrder = BaseOrder & {
  strategy: typeof ORDER_STRATEGY.VWAP;
  duration: number;
  durationUnit: (typeof DURATION_UNIT)[keyof typeof DURATION_UNIT];
  maxParticipationRate: number;
  actionForUnfilledQuantities: (typeof VWAP_UNFILLED_ACTION)[keyof typeof VWAP_UNFILLED_ACTION];
};

type RatioTradeOrder = BaseOrder & {
  // TODO: Need to update this
  strategy: typeof ORDER_STRATEGY.RATIO_TRADE;
};

type TargetPositionOrder = BaseOrder & {
  // TODO: Need to update this
  strategy: typeof ORDER_STRATEGY.TARGET_POSITION;
};

// Union type of all order types
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
