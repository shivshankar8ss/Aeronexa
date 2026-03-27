const express = require('express');
const router = express.Router();
const { register, login, getMe, updatePreferences } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');
const { registerValidator, loginValidator, validate } = require('../middleware/validate.middleware');

router.post('/register', registerValidator, validate, register);
router.post('/login',    loginValidator,    validate, login);
router.get('/me',        protect, getMe);
router.put('/preferences', protect, updatePreferences);

module.exports = router;
