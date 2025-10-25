/**
 * ROUTES: Key paths within the application
 * Used with page.goto() or navigation helpers
 */
export const ROUTES = {
  LOGIN: '/auth/login', // Login page
  GO_TRADE: '/gotrade', // GoTrade page
  ADMIN: '/admin', // Admin page
};

/**
 * USERS: Test users with credentials
 * Can be extended to add more users
 */
export const USERS = {
  USER19: {
    username: 'user19@goquant.io',
    password: process.env.PASS_USER19 || '',
  },
};

export const EXCHANGE_ACCOUNTS = {
  OKX: {
    NAME: 'OKX',
    KEY: process.env.OKX_KEY || '',
    SECRET: process.env.OKX_SECRET || '',
    PASSPHRASE: process.env.OKX_PASSPHRASE || '',
  },
  OKX_1: {
    NAME: 'OKX',
    KEY: process.env.OKX_KEY_1 || '',
    SECRET: process.env.OKX_SECRET_1 || '',
    PASSPHRASE: process.env.OKX_PASSPHRASE_1 || '',
  },
  BINANCE_USD_M: {
    NAME: 'Binance USDⓈ-M',
    KEY: process.env.BINANCE_KEY || '',
    SECRET: process.env.BINANCE_SECRET || '',
  },
  BINANCE_COIN_M: {
    NAME: 'Binance COIN-M',
    KEY: process.env.BINANCE_KEY || '',
    SECRET: process.env.BINANCE_SECRET || '',
  },
};
