const asyncHandler = require('express-async-handler');
const Contact = require('../models/Contact');
const { sendContactNotification } = require('../utils/emailService');

exports.createContact = asyncHandler(async (req, res) => {
    const { name, email, subject, message, rating } = req.body;
    if (!name || !email || !subject || !message) {
        res.status(400);
        throw new Error('All fields are required');
    }
    const contact = await Contact.create({ name, email, subject, message, rating });

    // Send email notification (non-blocking)
    sendContactNotification({ name, email, subject, message });

    res.status(201).json({ message: 'Message sent successfully', contact });
});

exports.getContacts = asyncHandler(async (req, res) => {
    const contacts = await Contact.find({}).sort({ createdAt: -1 });
    res.json(contacts);
});
