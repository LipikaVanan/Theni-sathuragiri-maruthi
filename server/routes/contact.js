const express = require('express');
const router = express.Router();
const { createContact, getContacts } = require('../controllers/contactController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', createContact);
router.get('/', protect, admin, getContacts);

module.exports = router;
