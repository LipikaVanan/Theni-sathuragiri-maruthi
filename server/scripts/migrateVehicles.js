const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Booking = require('../models/Booking');
const Vehicle = require('../models/Vehicle');
const User = require('../models/User');

dotenv.config({ path: path.join(__dirname, '../.env') });

const migrate = async () => {
    try {
        console.log('Connecting to database...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected.');

        const bookings = await Booking.find({});
        console.log(`Found ${bookings.length} bookings to process.`);

        let createdCount = 0;
        let linkedCount = 0;

        for (const booking of bookings) {
            if (!booking.carDetails?.number || !booking.userId) continue;

            const registrationNo = booking.carDetails.number;
            const userId = booking.userId;

            // Try to find existing vehicle for this user/reg
            let vehicle = await Vehicle.findOne({ customer: userId, registrationNo: registrationNo });

            if (!vehicle) {
                // Create new vehicle
                const brand = booking.carDetails.model?.split(' ')[0] || 'Unknown';
                const model = booking.carDetails.model?.split(' ').slice(1).join(' ') || booking.carDetails.model || 'Unknown';

                vehicle = await Vehicle.create({
                    customer: userId,
                    brand: brand,
                    model: model,
                    registrationNo: registrationNo,
                    fuelType: booking.carDetails.type === 'SUV' ? 'Diesel' : 'Petrol'
                });
                createdCount++;
            }

            // Link booking to vehicle if not already linked
            if (!booking.vehicle || booking.vehicle.toString() !== vehicle._id.toString()) {
                booking.vehicle = vehicle._id;
                await booking.save();
                linkedCount++;
            }
        }

        console.log(`Migration complete!`);
        console.log(`- New vehicles created: ${createdCount}`);
        console.log(`- Bookings updated with links: ${linkedCount}`);

        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
};

migrate();
