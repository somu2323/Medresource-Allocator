import express from 'express';
import Schedule from '../models/schedule.js';

const router = express.Router();

// Get all schedules
router.get('/', async (req, res) => {
  try {
    const schedules = await Schedule.find({});
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get schedule by ID
router.get('/:id', async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id);
    if (!schedule) {
      return res.status(404).json({ error: 'Schedule not found' });
    }
    res.json(schedule);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get schedules by staff ID
router.get('/staff/:staffId', async (req, res) => {
  try {
    const schedules = await Schedule.find({ staff_id: req.params.staffId });
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get schedules by department
router.get('/department/:department', async (req, res) => {
  try {
    const schedules = await Schedule.find({ department: req.params.department });
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get schedules by date range
router.get('/date-range', async (req, res) => {
  try {
    const { start, end } = req.query;
    const schedules = await Schedule.find({
      shift_start: { $gte: new Date(start) },
      shift_end: { $lte: new Date(end) }
    });
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;