const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  serviceIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service' }],
  vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' },
  assignedTech: { type: mongoose.Schema.Types.ObjectId, ref: 'Technician' },
  bookingDate: { type: Date, required: true },
  carDetails: {
    model: String,
    number: String,
    type: { type: String }
  },
  address: String,
  paymentMethod: String,
  status: { type: String, enum: ['Pending', 'Confirmed', 'In Progress', 'Completed', 'Cancelled'], default: 'Pending' },
  totalAmount: Number,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', bookingSchema);
