import mongoose from 'mongoose';

const bedSchema = new mongoose.Schema({
  room_number: {
    type: String,
    required: true,
    trim: true
  },
  bed_number: {
    type: String,
    required: true,
    trim: true
  },
  department: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    required: true,
    enum: ['Available', 'Occupied', 'Maintenance', 'Reserved'],
    default: 'Available'
  },
  patient_id: {
    type: String,
    trim: true
  },
  patient_name: {
    type: String,
    trim: true
  },
  admission_date: {
    type: Date
  },
  expected_discharge_date: {
    type: Date
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Create a compound index for room and bed number to ensure uniqueness
bedSchema.index({ room_number: 1, bed_number: 1 }, { unique: true });

const Bed = mongoose.model('Bed', bedSchema);

export default Bed;