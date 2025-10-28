/**
 * ROUTES: Key paths within the application
 * Used with page.goto() or navigation helpers to ensure environment-independent navigation.
 */
export const ROUTES = {
  LOGIN: '/auth/login', // Login page endpoint
  GO_TRADE: '/gotrade', // Main trading application page after successful login
  ADMIN: '/admin', // Administrative settings page (e.g., account management)
};

/**
 * USERS: Test users with credentials
 * Credentials are typically sourced from environment variables for security.
 */
export const USERS = {
  USER19: {
    username: 'user19@goquant.io', // The fixed username for testing
    // Password loaded from system environment variable (e.g., in CI/CD pipeline)
    password: process.env.PASS_USER19 || '',
  },
};

/**
 * EXCHANGE_ACCOUNTS: Credentials and configuration data for trading venues (exchanges)
 * Used for testing account connection, adding, and modifying accounts in the Admin section.
 */
export const EXCHANGE_ACCOUNTS = {
  OKX: {
    NAME: 'OKX', // Exchange name used for selection in the UI
    // API Key loaded securely from environment variable
    KEY: process.env.OKX_KEY || '',
    // API Secret loaded securely from environment variable
    SECRET: process.env.OKX_SECRET || '',
    // Passphrase (often required for OKX, unlike some other exchanges)
    PASSPHRASE: process.env.OKX_PASSPHRASE || '',
  },
  OKX_1: {
    NAME: 'OKX',
    // A secondary, different set of OKX keys, often used for modify/update tests
    KEY: process.env.OKX_KEY_1 || '',
    SECRET: process.env.OKX_SECRET_1 || '',
    PASSPHRASE: process.env.OKX_PASSPHRASE_1 || '',
  },
  BINANCE_USD_M: {
    NAME: 'Binance USDⓈ-M', // Name for the USD Futures/Margin market type
    KEY: process.env.BINANCE_KEY || '',
    SECRET: process.env.BINANCE_SECRET || '',
    // Note: No PASSPHRASE defined, as it's not required for this exchange type
  },
  BINANCE_COIN_M: {
    NAME: 'Binance COIN-M', // Name for the Coin Futures/Margin market type
    KEY: process.env.BINANCE_KEY || '',
    SECRET: process.env.BINANCE_SECRET || '',
    // Note: No PASSPHRASE defined
  },
};

/**
 * ORDER_SIDE: Represents the direction of a trade order.
 * BUY - Indicates a long position or purchase of an asset.
 * SELL - Indicates a short position or selling of an asset.
 */
export const ORDER_SIDE = {
  BUY: 'buy',
  SELL: 'sell',
} as const;

/**
 * ORDER_STRATEGY: Defines all supported order strategies and algorithmic types.
 * - MARKET: Executes immediately at current market price.
 * - LIMIT: Executes at a specified price or better.
 * - LIMIT_EDGE: Enhanced limit order with smart routing or additional parameters.
 * - MARKET_EDGE: Smart market execution strategy.
 * - TWAP: Time-Weighted Average Price strategy (splits orders evenly over time).
 * - VWAP: Volume-Weighted Average Price strategy (executes based on traded volume).
 * - TWAP_EDGE: Advanced TWAP variation with additional configuration options.
 * - RATIO_TRADE: Places paired trades maintaining a specified ratio between instruments.
 * - TARGET_POSITION: Algorithm to reach and maintain a desired position size.
 */
export const ORDER_STRATEGY = {
  MARKET: 'market',
  LIMIT: 'limit',
  LIMIT_EDGE: 'limit_edge',
  MARKET_EDGE: 'market_edge',
  TWAP: 'twap', // Time Weighted Average Price
  VWAP: 'vwap', // Volume Weighted Average Price
  TWAP_EDGE: 'twap_edge', // Time Weighted Average Price Edge
  RATIO_TRADE: 'ratio_trade', // Ratio Trade
  TARGET_POSITION: 'target_position', // Target Position
} as const;

/**
 * ORDER_TIF (Time-In-Force): Defines how long an order remains active before execution or expiration.
 * - GTC: Good Till Cancel — remains active until explicitly canceled.
 * - GTT: Good Till Time — remains active until a specified time.
 * - IOC: Immediate or Cancel — executes immediately, cancels unfilled portion.
 * - FOK: Fill or Kill — must be filled entirely or canceled instantly.
 * - DAY: Valid only for the current trading day.
 */
export const ORDER_TIF = {
  GTC: 'Good Till Cancel',
  GTT: 'Good Till Time',
  IOC: 'Immediate or Cancel',
  FOK: 'Fill or Kill',
  DAY: 'Day',
} as const;

/**
 * ORDER_STATUS: Represents the current execution state of an order.
 * - NEW: Order has been created but not yet processed.
 * - PENDING: Order is submitted and awaiting confirmation.
 * - FILLED: Order has been completely executed.
 * - PARTIALLY_FILLED: Order partially executed, remainder still active.
 * - CANCELED: Order was canceled before full execution.
 * - REJECTED: Order was rejected due to validation or exchange error.
 */
export const ORDER_STATUS = {
  NEW: 'new',
  PENDING: 'pending',
  FILLED: 'filled',
  PARTIALLY_FILLED: 'partially_filled',
  CANCELED: 'canceled',
  REJECTED: 'rejected',
} as const;

/**
 * SYMBOL: Common trading pairs used in testing and automation.
 * - ETH_USDT: Ethereum vs Tether.
 * - BTC_USDT: Bitcoin vs Tether.
 * - BTC_USDT_SWAP: Bitcoin perpetual futures (swap) contract.
 * - BTC_USDT_260626: Bitcoin futures contract expiring on 26 June 2026.
 */
export const SYMBOL = {
  ETH_USDT: 'ETH-USDT',
  BTC_USDT: 'BTC-USDT',
  BTC_USDT_SWAP: 'BTC-USDT-SWAP',
  BTC_USDT_260626: 'BTC-USDT-260626',
} as const;

/**
 * DURATION_UNIT: Defines available time units for order duration or interval-based strategies.
 * Used in TWAP, VWAP, and advanced algorithmic orders.
 */
export const DURATION_UNIT = {
  SECONDS: 'Seconds',
  MINUTES: 'Minutes',
  HOURS: 'Hours',
  DAYS: 'Days',
  WEEKS: 'Weeks',
  MONTHS: 'Months',
} as const;

/**
 * ORDER_THRESHOLD_UNIT: Defines measurement units for thresholds in percentage or fixed amount.
 * - PERCENTAGE: Threshold based on percentage (%).
 * - DOLLAR_AMT: Threshold based on absolute dollar amount ($).
 */
export const ORDER_THRESHOLD_UNIT = {
  PERCENTAGE: 'Percentage (%)',
  DOLLAR_AMT: 'Dollar Amount ($)',
} as const;

/**
 * VWAP_UNFILLED_ACTION: Specifies what to do with unfilled quantities in a VWAP order.
 * - EXTEND: Extend or increase the duration to allow more fills.
 * - INCREASE_PARTICIPATION: Increase participation rate to fill remaining quantity faster.
 * - FAIL: Mark order as failed if not completely filled.
 */
export const VWAP_UNFILLED_ACTION = {
  EXTEND: 'Extend',
  INCREASE_PARTICIPATION: 'Increase Participation',
  FAIL: 'Fail',
} as const;
