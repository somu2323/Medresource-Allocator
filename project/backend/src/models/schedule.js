import mongoose from 'mongoose';

const scheduleSchema = new mongoose.Schema({
  staff_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff',
    required: true
  },
  staff_name: {
    type: String,
    required: true,
    trim: true
  },
  department: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    required: true,
    trim: true
  },
  shift_start: {
    type: Date,
    required: true
  },
  shift_end: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['Scheduled', 'Completed', 'Cancelled'],
    default: 'Scheduled'
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Create an index for efficient querying by date ranges
scheduleSchema.index({ shift_start: 1, shift_end: 1 });

const Schedule = mongoose.model('Schedule', scheduleSchema);

export default Schedule;