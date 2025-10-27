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

// Order Sides
export const ORDER_SIDE = {
  BUY: 'buy',
  SELL: 'sell',
} as const;

// Order Strategies / Types
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

// Order Time-in-Force
export const ORDER_TIF = {
  GTC: 'Good Till Cancel',
  GTT: 'Good Till Time',
  IOC: 'Immediate or Cancel',
  FOK: 'Fill or Kill',
  DAY: 'Day',
} as const;

// Example Order Status
export const ORDER_STATUS = {
  NEW: 'new',
  PENDING: 'pending',
  FILLED: 'filled',
  PARTIALLY_FILLED: 'partially_filled',
  CANCELED: 'canceled',
  REJECTED: 'rejected',
} as const;

export const SYMBOL = {
  ETH_USDT: 'ETH-USDT',
  BTC_USDT: 'BTC-USDT',
  BTC_USDT_SWAP: 'BTC-USDT-SWAP',
  BTC_USDT_260626: 'BTC-USDT-260626',
} as const;

export const DURATION_UNIT = {
  SECONDS: 'Seconds',
  MINUTES: 'Minutes',
  HOURS: 'Hours',
  DAYS: 'Days',
  WEEKS: 'Weeks',
  MONTHS: 'Months',
} as const;

export const ORDER_THRESHOLD_UNIT = {
  PERCENTAGE: 'Percentage (%)',
  DOLLAR_AMT: 'Dollar Amount ($)',
} as const;

export const VWAP_UNFILLED_ACTION = {
  EXTEND: 'Extend',
  INCREASE_PARTICIPATION: 'Increase Participation',
  FAIL: 'Fail',
} as const;
