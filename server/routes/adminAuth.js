const router = require('express').Router();
const { adminLogin, adminRegister, getAdmins } = require('../controllers/adminAuthController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/login', adminLogin);
router.post('/register', protect, admin, adminRegister);
router.get('/', protect, admin, getAdmins);

module.exports = router;
