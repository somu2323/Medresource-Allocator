import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Staff from '../models/staff.js';
import Equipment from '../models/equipment.js';
import Bed from '../models/bed.js';
import Schedule from '../models/schedule.js';

// Load environment variables
dotenv.config();

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hospital-resource-allocation';

async function initializeDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Drop existing collections if they exist
    await Promise.all([
      Staff.collection.drop().catch(err => {
        if (err.code !== 26) console.error('Error dropping Staff collection:', err);
      }),
      Equipment.collection.drop().catch(err => {
        if (err.code !== 26) console.error('Error dropping Equipment collection:', err);
      }),
      Bed.collection.drop().catch(err => {
        if (err.code !== 26) console.error('Error dropping Bed collection:', err);
      }),
      Schedule.collection.drop().catch(err => {
        if (err.code !== 26) console.error('Error dropping Schedule collection:', err);
      })
    ]);

    // Create sample data
    const staff = await Staff.create([
      {
        name: 'Dr. John Smith',
        role: 'doctor',
        department: 'cardiology',
        contact: '+1234567890',
        email: 'john.smith@hospital.com',
        status: 'On Duty',
        specialization: 'Cardiac Surgery'
      },
      {
        name: 'Nurse Sarah Johnson',
        role: 'nurse',
        department: 'emergency',
        contact: '+1234567891',
        email: 'sarah.johnson@hospital.com',
        status: 'On Duty'
      }
    ]);

    const equipment = await Equipment.create([
      {
        name: 'ECG Machine 1',
        type: 'Diagnostic',
        status: 'Available',
        location: 'Cardiology Department',
        last_maintenance_date: new Date('2024-02-01'),
        next_maintenance_date: new Date('2024-05-01')
      },
      {
        name: 'Ventilator 1',
        type: 'Life Support',
        status: 'In Use',
        location: 'ICU',
        last_maintenance_date: new Date('2024-01-15'),
        next_maintenance_date: new Date('2024-04-15')
      }
    ]);

    const beds = await Bed.create([
      {
        room_number: '101',
        bed_number: 'A',
        department: 'cardiology',
        status: 'Available'
      },
      {
        room_number: '102',
        bed_number: 'B',
        department: 'emergency',
        status: 'Occupied',
        patient_name: 'Jane Doe',
        admission_date: new Date(),
        expected_discharge_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    ]);

    const schedules = await Schedule.create([
      {
        staff_id: staff[0]._id,
        staff_name: staff[0].name,
        department: staff[0].department,
        role: staff[0].role,
        shift_start: new Date('2024-03-15T09:00:00'),
        shift_end: new Date('2024-03-15T17:00:00'),
        status: 'Scheduled'
      },
      {
        staff_id: staff[1]._id,
        staff_name: staff[1].name,
        department: staff[1].department,
        role: staff[1].role,
        shift_start: new Date('2024-03-15T08:00:00'),
        shift_end: new Date('2024-03-15T16:00:00'),
        status: 'Scheduled'
      }
    ]);

    console.log('Database initialized with sample data:');
    console.log(`Created ${staff.length} staff records`);
    console.log(`Created ${equipment.length} equipment records`);
    console.log(`Created ${beds.length} bed records`);
    console.log(`Created ${schedules.length} schedule records`);

    await mongoose.disconnect();
    console.log('Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

initializeDatabase();