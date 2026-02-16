const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');

router.get('/', statsController.getStats);
router.post('/increment', statsController.incrementHit);

module.exports = router;
