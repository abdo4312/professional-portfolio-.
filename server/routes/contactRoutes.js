const express = require('express');
const router = express.Router();
const { submitContact, getAllContacts, updateContactStatus, deleteContact } = require('../controllers/contactController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', submitContact);
router.get('/', protect, getAllContacts);
router.put('/:id', protect, updateContactStatus);
router.delete('/:id', protect, deleteContact);

module.exports = router;