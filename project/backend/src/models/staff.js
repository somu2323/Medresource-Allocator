import mongoose from 'mongoose';

const staffSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    required: true,
    enum: ['doctor', 'nurse', 'technician', 'receptionist', 'administrator', 'janitor', 'security'],
    trim: true
  },
  department: {
    type: String,
    required: true,
    enum: ['cardiology', 'neurology', 'pediatrics', 'orthopedics', 'oncology', 'emergency', 'icu', 'radiology', 'administration'],
    trim: true
  },
  contact: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true
  },
  status: {
    type: String,
    required: true,
    enum: ['On Duty', 'Off Duty', 'On Leave', 'Training'],
    default: 'Off Duty'
  },
  specialization: {
    type: String,
    trim: true
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

const Staff = mongoose.model('Staff', staffSchema);

export default Staff;