const express = require('express');
const router = express.Router();
const { getPredictHandler } = require('../controllers/predict.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/', protect, getPredictHandler);

module.exports = router;
