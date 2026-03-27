const express = require('express');
const router = express.Router();
const { getHealth, getHealthSummary } = require('../controllers/health.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/',       protect, getHealth);
router.get('/summary', protect, getHealthSummary);

module.exports = router;
