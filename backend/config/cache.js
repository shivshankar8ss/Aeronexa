const NodeCache = require('node-cache');

// TTL from env (default 10 minutes = 600 seconds)
const TTL = parseInt(process.env.CACHE_TTL) || 600;

const cache = new NodeCache({ stdTTL: TTL, checkperiod: 120 });

const cacheService = {
  get(key) {
    return cache.get(key);
  },

  set(key, value, ttl = TTL) {
    return cache.set(key, value, ttl);
  },

  del(key) {
    return cache.del(key);
  },

  flush() {
    return cache.flushAll();
  },

  stats() {
    return cache.getStats();
  },

  has(key) {
    return cache.has(key);
  },
};

module.exports = cacheService;
