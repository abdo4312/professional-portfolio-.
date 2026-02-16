const express = require('express');
const router = express.Router();
const { login, changePassword, logout } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/login', login);
router.post('/logout', protect, logout);
router.post('/change-password', protect, changePassword);

module.exports = router;