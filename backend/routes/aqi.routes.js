const express = require('express');
const router = express.Router();
const { getCurrentAqiHandler, logAqi, getHistory } = require('../controllers/aqi.controller');
const { protect } = require('../middleware/auth.middleware');
const { logAqiValidator, aqiQueryValidator, validate } = require('../middleware/validate.middleware');

router.get('/current', protect, aqiQueryValidator, validate, getCurrentAqiHandler);
router.post('/log',    protect, logAqiValidator,   validate, logAqi);
router.get('/history', protect, getHistory);

module.exports = router;
