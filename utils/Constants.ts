/**
 * ROUTES: Key paths within the application
 * Used with page.goto() or navigation helpers
 */
export const ROUTES = {
  LOGIN: "/auth/login", // Login page
  GOTRADE: "/gotrade", // GoTrade page
  PROFILE: "/profile", // User profile page
};

/**
 * USERS: Test users with credentials
 * Can be extended to add more users
 */
export const USERS = {
  USER19: {
    username: "user19@goquant.io",
    password: process.env.PASS_USER19,
  },
};
