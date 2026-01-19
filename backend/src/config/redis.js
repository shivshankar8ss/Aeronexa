const { createClient } = require("redis");

const redisClient = createClient({
  url: "redis://redis:6379",
});

redisClient.on("connect", () => {
  console.log("Redis connected");
});

redisClient.on("error", (err) => {
  console.error("Redis error", err);
});

redisClient.connect();

module.exports = redisClient;
