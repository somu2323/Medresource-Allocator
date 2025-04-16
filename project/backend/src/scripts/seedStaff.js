import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Staff from '../models/staff.js';
import { staffSeed } from '../../src/data/staffSeed.js';

dotenv.config();

const seedStaff = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing staff data
    await Staff.deleteMany({});
    console.log('Cleared existing staff data');

    // Insert seed data
    const staffData = staffSeed.map(({ id, ...staff }) => staff);
    await Staff.insertMany(staffData);
    console.log(`Successfully seeded ${staffData.length} staff records`);

  } catch (error) {
    console.error('Error seeding staff data:', error);
  } finally {
    // Close the database connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
};

// Run the seeder
seedStaff();