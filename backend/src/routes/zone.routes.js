const express = require("express");
const router = express.Router();
const { resolveZone } = require("../controllers/zone.controller");
const { protect } = require("../middlewares/auth.middleware");

router.post("/resolve", protect, resolveZone);

module.exports = router;
