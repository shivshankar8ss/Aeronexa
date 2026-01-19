const express = require("express");
const router = express.Router();
const {getPollutionHistory} = require("../controllers/pollution.controller");
const {
  addPollutionData,
} = require("../controllers/pollution.controller");
const { protect } = require("../middlewares/auth.middleware");

router.post("/", addPollutionData);
router.get(
  "/history/:zoneId",
  protect,
  getPollutionHistory
);
module.exports = router;
