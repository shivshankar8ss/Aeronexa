const { body, query, validationResult } = require('express-validator');

// Middleware to handle validation result
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

// Auth validators
const registerValidator = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ min: 2, max: 50 }).withMessage('Name must be 2–50 characters'),
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

const loginValidator = [
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

// AQI log validator
const logAqiValidator = [
  body('latitude').isFloat({ min: -90, max: 90 }).withMessage('Valid latitude required'),
  body('longitude').isFloat({ min: -180, max: 180 }).withMessage('Valid longitude required'),
  body('aqi').isInt({ min: 0, max: 1000 }).withMessage('AQI must be 0–1000'),
  body('duration').optional().isInt({ min: 1, max: 1440 }).withMessage('Duration must be 1–1440 minutes'),
];

// Current AQI query validator
const aqiQueryValidator = [
  query('lat').isFloat({ min: -90, max: 90 }).withMessage('Valid lat required'),
  query('lon').isFloat({ min: -180, max: 180 }).withMessage('Valid lon required'),
];

module.exports = {
  validate,
  registerValidator,
  loginValidator,
  logAqiValidator,
  aqiQueryValidator,
};
