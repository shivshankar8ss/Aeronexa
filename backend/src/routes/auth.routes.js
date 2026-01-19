const express = require("express");
const router = express.Router();

const { register, login } = require("../controllers/auth.controller");
const rateLimiter = require("../middlewares/rateLimit.middleware");

router.post("/register",rateLimiter({
    windowSec: 60,
    maxRequests: 5,
    prefix: "register",
  }) ,register);

router.post("/login",rateLimiter({
    windowSec: 60,
    maxRequests: 5,
    prefix: "login",
  }), login);

module.exports = router;
