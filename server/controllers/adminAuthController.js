const asyncHandler = require('express-async-handler');
const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id, role: 'admin', isAdmin: true }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Admin Login
exports.adminLogin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) {
        res.status(401);
        throw new Error('Invalid admin credentials');
    }
    const matched = await bcrypt.compare(password, admin.password);
    if (!matched) {
        res.status(401);
        throw new Error('Invalid admin credentials');
    }
    res.json({
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        phone: admin.phone,
        role: 'admin',
        token: generateToken(admin._id)
    });
});

// Admin Register (can be used to add more admins)
exports.adminRegister = asyncHandler(async (req, res) => {
    const { name, email, password, phone } = req.body;
    const exists = await Admin.findOne({ email });
    if (exists) {
        res.status(400);
        throw new Error('Admin with this email already exists');
    }
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);
    const admin = await Admin.create({ name, email, password: hashed, phone });
    res.status(201).json({
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: 'admin',
        token: generateToken(admin._id)
    });
});

// Get all admins (for super admin management)
exports.getAdmins = asyncHandler(async (req, res) => {
    const admins = await Admin.find({}).select('-password');
    res.json(admins);
});
