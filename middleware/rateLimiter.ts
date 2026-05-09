import rateLimit from 'express-rate-limit';

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});

export const loginLimiter = rateLimit({
  windowMs: 30 * 60 * 1000, // 30 minutes
  max: 5, // Limit each IP to 5 login requests per windowMs
  message: 'Too many login attempts from this IP, please try again after 30 minutes',
  standardHeaders: true,
  legacyHeaders: false,
});
