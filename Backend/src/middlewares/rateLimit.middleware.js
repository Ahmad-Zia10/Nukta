import rateLimit from 'express-rate-limit';

const jsonLimitHandler = (message) => (req, res) => {
  res.status(429).json({ success: false, message });
};

/**
 * Credential endpoints (login / signup).
 *
 * Without this, `/api/auth/login` accepts unlimited password guesses. Counts
 * only failed attempts so a user repeatedly signing in on a shared IP is not
 * penalised for succeeding.
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 10,
  skipSuccessfulRequests: true,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: jsonLimitHandler(
    'Too many attempts from this IP. Please try again in 15 minutes.'
  ),
});

/**
 * The summarizer proxies to a metered third-party API and is unauthenticated,
 * so it is trivially abusable to burn quota. Tighter window than auth.
 */
export const summarizeLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  limit: 20,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: jsonLimitHandler(
    'Summary limit reached. Please try again later.'
  ),
});

/**
 * Broad backstop for the rest of the API. Generous enough that normal browsing
 * never hits it.
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 500,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: jsonLimitHandler('Too many requests. Please slow down.'),
});
