const asyncHandler = require('express-async-handler');
const Booking = require('../models/Booking');
const Service = require('../models/Service');
const User = require('../models/User');
const { sendBookingConfirmation } = require('../utils/emailService');

exports.createBooking = asyncHandler(async (req, res) => {
  const payload = { ...req.body, userId: req.user.id };
  const booking = await Booking.create(payload);

  // Send email notification (non-blocking)
  try {
    const service = await Service.findById(req.body.serviceId);
    const user = await User.findById(req.user.id);
    if (user && service) {
      sendBookingConfirmation(user.email, {
        service: service.title,
        date: req.body.bookingDate,
        car: `${req.body.carDetails?.model || ''} (${req.body.carDetails?.number || ''})`,
        amount: req.body.totalAmount || service.price,
      });
    }
  } catch (e) {
    console.error('Email notification error:', e.message);
  }

  res.status(201).json(booking);
});

exports.getBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({}).populate('userId', 'name email phone').populate('serviceId', 'title price image').populate('vehicle', 'brand model registrationNo').populate('assignedTech', 'name specialization phone');
  res.json(bookings);
});

exports.getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ userId: req.user.id }).populate('serviceId', 'title price image description').populate('vehicle', 'brand model registrationNo').populate('assignedTech', 'name specialization phone').sort({ createdAt: -1 });
  res.json(bookings);
});

exports.updateBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }
  Object.assign(booking, req.body);
  await booking.save();
  res.json(booking);
});

exports.deleteBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }
  await booking.deleteOne();
  res.json({ message: 'Booking removed' });
});
