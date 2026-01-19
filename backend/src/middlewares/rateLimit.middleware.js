const redisClient = require("../config/redis");

const rateLimiter = (options) => {
  const { windowSec, maxRequests, prefix } = options;

  return async (req, res, next) => {
    try {
      const ip =
        req.headers["x-forwarded-for"] ||
        req.socket.remoteAddress;

      const key = `${prefix}:${ip}`;

      const current = await redisClient.incr(key);

      // First request- set expiry
      if (current === 1) {
        await redisClient.expire(key, windowSec);
      }

      if (current > maxRequests) {
        return res.status(429).json({
          success: false,
          message: "Too many requests. Please try again later.",
        });
      }

      next();
    } catch (err) {
      // Fail open (never block API if Redis fails)
      next();
    }
  };
};

module.exports = rateLimiter;
