/**
 * An array of routes accessible to the public
 * These routes do not require authentication
 * @type {string[]}
 */
export const publicRoutes: string[] = [
  "/auth/forget-password",
  "/auth/reset-password",
];

/**
 * An array of routes that are used for authentication
 * These routes will redirect logged in user to /
 * @type {string[]}
 */
export const authRoutes: string[] = [
  "/auth",
  "/auth/login",
  "/auth/register",
  "/auth/magic",
];

/**
 * API Authentication routes
 * @type {string[]}
 */
export const apiAuth: string[] = ["/auth/callback", "/auth/confirm"];

/**
 * Default redirect
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT: string = "/";
