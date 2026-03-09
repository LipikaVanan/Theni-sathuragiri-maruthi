const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');
const User = require('./models/User');
const Admin = require('./models/Admin');
const Service = require('./models/Service');
const Technician = require('./models/Technician');
const Inventory = require('./models/Inventory');

dotenv.config();

const seedDB = async () => {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Admin.deleteMany({});
    await Service.deleteMany({});
    await Technician.deleteMany({});
    await Inventory.deleteMany({});

    // Admin (stored in separate 'admins' collection)
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await Admin.create({
        name: 'Admin',
        email: 'admin@autocarepro.com',
        password: hashedPassword,
        phone: '+91 99999 00000'
    });

    // Demo user
    const userPassword = await bcrypt.hash('user123', 10);
    await User.create({
        name: 'Rahul Sharma',
        email: 'rahul@demo.com',
        password: userPassword,
        role: 'user',
        phone: '+91 98765 43210'
    });

    // Services
    await Service.insertMany([
        { title: 'General Service', description: 'Complete car checkup including oil, filters, fluids and multi-point inspection.', price: 2500, category: 'Maintenance', duration: '2 hours', image: 'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=400' },
        { title: 'Oil Change', description: 'Full synthetic oil change with premium oil and filter replacement.', price: 1200, category: 'Maintenance', duration: '1 hour', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400' },
        { title: 'Brake Repair', description: 'Complete brake pad replacement, rotor inspection and brake fluid top-up.', price: 3000, category: 'Repair', duration: '3 hours', image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400' },
        { title: 'AC Service', description: 'Full AC system checkup, gas recharge and cooling performance optimization.', price: 2000, category: 'Maintenance', duration: '2 hours', image: 'https://images.unsplash.com/photo-1580894894513-541e068a3e2b?w=400' },
        { title: 'Battery Replacement', description: 'Premium battery installation with old battery disposal and electrical check.', price: 4500, category: 'Electrical', duration: '1 hour', image: 'https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?w=400' },
        { title: 'Full Car Wash', description: 'Exterior and interior deep cleaning with wax polish and vacuum.', price: 800, category: 'Detailing', duration: '1.5 hours', image: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=400' },
        { title: 'Wheel Alignment', description: 'Computerized 4-wheel alignment with tire pressure and suspension check.', price: 1500, category: 'Repair', duration: '1.5 hours', image: 'https://images.unsplash.com/photo-1578844251758-2f71da64c96f?w=400' },
        { title: 'Engine Diagnostics', description: 'Advanced OBD-II scan, error code analysis and engine performance report.', price: 1800, category: 'Electrical', duration: '1 hour', image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400' }
    ]);

    // Technicians
    await Technician.insertMany([
        { name: 'Vikram Patel', specialization: 'Engine & Transmission', experienceYears: 12, phone: '+91 97001 11111', available: true },
        { name: 'Suresh Kumar', specialization: 'Electrical Systems', experienceYears: 8, phone: '+91 97002 22222', available: true },
        { name: 'Ajay Singh', specialization: 'Brakes & Suspension', experienceYears: 10, phone: '+91 97003 33333', available: true },
        { name: 'Rajesh Nair', specialization: 'AC & Cooling', experienceYears: 6, phone: '+91 97004 44444', available: true },
        { name: 'Deepak Joshi', specialization: 'Body & Detailing', experienceYears: 5, phone: '+91 97005 55555', available: false }
    ]);

    // Inventory parts
    await Inventory.insertMany([
        { partName: 'Engine Oil (5W-30)', category: 'Fluids', stockQty: 50, price: 800 },
        { partName: 'Oil Filter', category: 'Filters', stockQty: 40, price: 250 },
        { partName: 'Air Filter', category: 'Filters', stockQty: 35, price: 350 },
        { partName: 'Brake Pads (Front)', category: 'Brakes', stockQty: 20, price: 1200 },
        { partName: 'Brake Pads (Rear)', category: 'Brakes', stockQty: 15, price: 1000 },
        { partName: 'Spark Plug', category: 'Electrical', stockQty: 60, price: 180 },
        { partName: 'Car Battery 65Ah', category: 'Electrical', stockQty: 3, price: 4000 },
        { partName: 'AC Gas R134a', category: 'AC Parts', stockQty: 25, price: 600 },
        { partName: 'Coolant 1L', category: 'Fluids', stockQty: 30, price: 300 },
        { partName: 'Wiper Blades', category: 'Accessories', stockQty: 2, price: 400 },
        { partName: 'Cabin Filter', category: 'Filters', stockQty: 4, price: 450 },
        { partName: 'Transmission Fluid', category: 'Fluids', stockQty: 18, price: 900 }
    ]);

    console.log('✅ Database seeded successfully!');
    console.log('   Admin: admin@autocarepro.com / admin123');
    console.log('   User:  rahul@demo.com / user123');
    process.exit();
};

seedDB().catch(err => { console.error(err); process.exit(1); });
