const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', settingsController.getSettings);
router.put('/', protect, settingsController.updateSettings);
router.get('/export', protect, settingsController.exportData);

module.exports = router;
