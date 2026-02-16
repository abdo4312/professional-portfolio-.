const express = require('express');
const router = express.Router();
const { uploadImages } = require('../controllers/uploadController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, uploadImages);

module.exports = router;
