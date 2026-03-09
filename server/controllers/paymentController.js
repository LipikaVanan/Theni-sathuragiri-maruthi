const asyncHandler = require('express-async-handler');
const Payment = require('../models/Payment');

exports.getPayments = asyncHandler(async (req, res) => {
    const payments = await Payment.find({}).populate({
        path: 'booking',
        populate: [
            { path: 'userId', select: 'name email' },
            { path: 'serviceId', select: 'title price' }
        ]
    });
    res.json(payments);
});

exports.createPayment = asyncHandler(async (req, res) => {
    if (!req.body.booking || !req.body.amount) {
        res.status(400);
        throw new Error('Booking and amount are required');
    }
    const payment = await Payment.create(req.body);
    res.status(201).json(payment);
});

exports.updatePayment = asyncHandler(async (req, res) => {
    const payment = await Payment.findById(req.params.id);
    if (!payment) { res.status(404); throw new Error('Payment not found'); }
    Object.assign(payment, req.body);
    await payment.save();
    res.json(payment);
});

exports.deletePayment = asyncHandler(async (req, res) => {
    const payment = await Payment.findById(req.params.id);
    if (!payment) { res.status(404); throw new Error('Payment not found'); }
    await payment.deleteOne();
    res.json({ message: 'Payment removed' });
});
