const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');
const { protect, admin } = require('./middleware/authMiddleware');
const Booking = require('./models/Booking');
const User = require('./models/User');
const Service = require('./models/Service');
const Technician = require('./models/Technician');
const Vehicle = require('./models/Vehicle');
const Payment = require('./models/Payment');
const Inventory = require('./models/Inventory');

dotenv.config();
connectDB();

const app = express();

// CORS: Allow both deployed and local origins
const allowedOrigins = [
  'https://theni-sathuragiri-maruthi-jedg.vercel.app',
  'https://theni-sathuragiri-maruthi-8lnn.vercel.app',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000'
];
app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));
app.use(express.json());

app.get('/', (req, res) => res.send('AutoCare Pro API'));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/services', require('./routes/services'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/admin/auth', require('./routes/adminAuth'));
app.use('/api/vehicles', require('./routes/vehicles'));
app.use('/api/technicians', require('./routes/technicians'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/inventory', require('./routes/inventory'));
app.use('/api/rewards', require('./routes/rewards'));
app.use('/api/admin', require('./routes/adminRewards'));

// Admin dashboard stats (enhanced)
app.get('/api/admin/stats', protect, admin, async (req, res) => {
    try {
        const [
            totalUsers,
            totalBookings,
            pendingBookings,
            completedBookings,
            inProgressBookings,
            totalTechnicians,
            totalVehicles,
            lowStockItems
        ] = await Promise.all([
            User.countDocuments({ role: 'user' }),
            Booking.countDocuments(),
            Booking.countDocuments({ status: 'Pending' }),
            Booking.countDocuments({ status: 'Completed' }),
            Booking.countDocuments({ status: 'In Progress' }),
            Technician.countDocuments(),
            Vehicle.countDocuments(),
            Inventory.countDocuments({ stockQty: { $lte: 5 } })
        ]);

        // Total revenue from Payment model (or fallback to Booking)
        const paymentRevenue = await Payment.aggregate([
            { $match: { paymentStatus: 'Paid' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);
        const bookingRevenue = await Booking.aggregate([
            { $match: { status: { $in: ['Confirmed', 'Completed'] } } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);
        const totalRevenue = paymentRevenue.length > 0 ? paymentRevenue[0].total : (bookingRevenue.length > 0 ? bookingRevenue[0].total : 0);

        // Monthly revenue (last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        const monthlyRevenue = await Booking.aggregate([
            { $match: { createdAt: { $gte: sixMonthsAgo }, status: { $in: ['Confirmed', 'Completed'] } } },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
                    revenue: { $sum: '$totalAmount' },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Most requested service
        const topServices = await Booking.aggregate([
            { $group: { _id: '$serviceId', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 },
            { $lookup: { from: 'services', localField: '_id', foreignField: '_id', as: 'service' } },
            { $unwind: '$service' },
            { $project: { serviceName: '$service.title', count: 1 } }
        ]);

        res.json({
            totalUsers,
            totalBookings,
            pendingBookings,
            completedBookings,
            inProgressBookings,
            totalTechnicians,
            totalVehicles,
            lowStockItems,
            totalRevenue,
            monthlyRevenue,
            topServices
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
