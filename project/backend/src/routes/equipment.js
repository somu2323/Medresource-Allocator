import express from 'express';
import Equipment from '../models/equipment.js';

const router = express.Router();

// Get all equipment
router.get('/', async (req, res) => {
  try {
    const equipment = await Equipment.find({});
    res.json(equipment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get equipment by ID
router.get('/:id', async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.params.id);
    if (!equipment) {
      return res.status(404).json({ error: 'Equipment not found' });
    }
    res.json(equipment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get equipment by status
router.get('/status/:status', async (req, res) => {
  try {
    const equipment = await Equipment.find({ status: req.params.status });
    res.json(equipment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get equipment by type
router.get('/type/:type', async (req, res) => {
  try {
    const equipment = await Equipment.find({ type: req.params.type });
    res.json(equipment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;