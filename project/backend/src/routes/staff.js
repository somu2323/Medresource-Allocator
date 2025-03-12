import express from 'express';
import Staff from '../models/staff.js';

const router = express.Router();

// Get all staff members
router.get('/', async (req, res) => {
  try {
    const staff = await Staff.find({});
    res.json(staff);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get staff member by ID
router.get('/:id', async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);
    if (!staff) {
      return res.status(404).json({ error: 'Staff member not found' });
    }
    res.json(staff);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get staff members by department
router.get('/department/:department', async (req, res) => {
  try {
    const staff = await Staff.find({ department: req.params.department });
    res.json(staff);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get staff members by role
router.get('/role/:role', async (req, res) => {
  try {
    const staff = await Staff.find({ role: req.params.role });
    res.json(staff);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;