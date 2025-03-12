import Schedule from '../models/schedule.js';

// Get all schedules
export const getAllSchedules = async (req, res) => {
  try {
    const schedules = await Schedule.find();
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single schedule
export const getScheduleById = async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id);
    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }
    res.json(schedule);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new schedule
export const createSchedule = async (req, res) => {
  const schedule = new Schedule({
    staff_id: req.body.staff_id,
    staff_name: req.body.staff_name,
    department: req.body.department,
    role: req.body.role,
    shift_start: req.body.shift_start,
    shift_end: req.body.shift_end,
    status: req.body.status,
    notes: req.body.notes
  });

  try {
    const newSchedule = await schedule.save();
    res.status(201).json(newSchedule);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a schedule
export const updateSchedule = async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id);
    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    Object.assign(schedule, req.body);
    const updatedSchedule = await schedule.save();
    res.json(updatedSchedule);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a schedule
export const deleteSchedule = async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id);
    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    await schedule.deleteOne();
    res.json({ message: 'Schedule deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get schedules by staff member
export const getSchedulesByStaff = async (req, res) => {
  try {
    const schedules = await Schedule.find({ staff_id: req.params.staff_id });
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get schedules by department
export const getSchedulesByDepartment = async (req, res) => {
  try {
    const schedules = await Schedule.find({ department: req.params.department });
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get schedules by date range
export const getSchedulesByDateRange = async (req, res) => {
  try {
    const { start_date, end_date } = req.query;
    const schedules = await Schedule.find({
      shift_start: { $gte: new Date(start_date) },
      shift_end: { $lte: new Date(end_date) }
    });
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};