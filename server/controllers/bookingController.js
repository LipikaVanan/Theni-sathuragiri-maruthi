const asyncHandler = require('express-async-handler');
const Booking = require('../models/Booking');
const Service = require('../models/Service');
const User = require('../models/User');
const Vehicle = require('../models/Vehicle');
const { sendBookingConfirmation, sendBookingUpdateNotification } = require('../utils/emailService');

exports.createBooking = asyncHandler(async (req, res) => {
  const payload = { ...req.body, userId: req.user.id };
  
  // Create or Update Vehicle Record automatically
  let vehicleId = null;
  if (req.body.carDetails?.number) {
    try {
      const brand = req.body.carDetails.model?.split(' ')[0] || 'Unknown';
      const model = req.body.carDetails.model?.split(' ').slice(1).join(' ') || req.body.carDetails.model;
      
      const vehicle = await Vehicle.findOneAndUpdate(
        { customer: req.user.id, registrationNo: req.body.carDetails.number },
        { 
          customer: req.user.id,
          brand: brand,
          model: model,
          registrationNo: req.body.carDetails.number,
          fuelType: req.body.carDetails.type === 'SUV' ? 'Diesel' : 'Petrol' // logical fallback
        },
        { upsert: true, new: true }
      );
      vehicleId = vehicle._id;
      payload.vehicle = vehicleId;
    } catch (ve) {
      console.error('Vehicle sync error:', ve.message);
    }
  }

  const booking = await Booking.create(payload);

  // Send email notification (non-blocking)
  try {
    const services = await Service.find({ _id: { $in: req.body.serviceIds } });
    const user = await User.findById(req.user.id);
    if (user && services.length > 0) {
      sendBookingConfirmation(user.email, {
        service: services.map(s => s.title).join(', '),
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
  const bookings = await Booking.find({}).populate('userId', 'name email phone').populate('serviceIds', 'title price image').populate('vehicle', 'brand model registrationNo').populate('assignedTech', 'name specialization phone');
  res.json(bookings);
});

exports.getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ userId: req.user.id }).populate('serviceIds', 'title price image description').populate('vehicle', 'brand model registrationNo').populate('assignedTech', 'name specialization phone').sort({ createdAt: -1 });
  res.json(bookings);
});

exports.updateBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id).populate('userId').populate('serviceIds');
  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }
  
  const oldStatus = booking.status;
  Object.assign(booking, req.body);
  const updatedBooking = await booking.save();

  if (req.body.status && req.body.status !== oldStatus && booking.userId && booking.userId.email) {
    sendBookingUpdateNotification(booking.userId.email, {
      service: booking.serviceIds?.map(s => s.title).join(', ') || 'Services',
      status: req.body.status
    });
  }

  res.json(updatedBooking);
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
