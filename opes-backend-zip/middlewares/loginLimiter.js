import rateLimit from 'express-rate-limit';

const loginLimiter = rateLimit({
  windowMs: 2 * 60 * 1000, // 2 minutes 
  max: 5, // Allow a maximum of 5 requests in 15 minutes from a single IP
  message: 'Too many login attempts, please try again later.',
});

export default loginLimiter;