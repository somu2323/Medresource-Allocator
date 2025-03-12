import mongoose from 'mongoose';

const equipmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    required: true,
    enum: ['Available', 'In Use', 'Maintenance', 'Reserved'],
    default: 'Available'
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  last_maintenance_date: {
    type: Date
  },
  next_maintenance_date: {
    type: Date
  },
  assigned_to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff'
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

const Equipment = mongoose.model('Equipment', equipmentSchema);

export default Equipment;