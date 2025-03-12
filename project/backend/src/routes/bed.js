import express from 'express';
import Bed from '../models/bed.js';

const router = express.Router();

// Get all beds
router.get('/', async (req, res) => {
  try {
    const beds = await Bed.find({});
    res.json(beds);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get bed by ID
router.get('/:id', async (req, res) => {
  try {
    const bed = await Bed.findById(req.params.id);
    if (!bed) {
      return res.status(404).json({ error: 'Bed not found' });
    }
    res.json(bed);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get beds by department
router.get('/department/:department', async (req, res) => {
  try {
    const beds = await Bed.find({ department: req.params.department });
    res.json(beds);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get beds by status
router.get('/status/:status', async (req, res) => {
  try {
    const beds = await Bed.find({ status: req.params.status });
    res.json(beds);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new bed
router.post('/', async (req, res) => {
  try {
    const bed = new Bed(req.body);
    await bed.save();
    res.status(201).json(bed);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update bed
router.put('/:id', async (req, res) => {
  try {
    const bed = await Bed.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!bed) {
      return res.status(404).json({ error: 'Bed not found' });
    }
    res.json(bed);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete bed
router.delete('/:id', async (req, res) => {
  try {
    const bed = await Bed.findByIdAndDelete(req.params.id);
    if (!bed) {
      return res.status(404).json({ error: 'Bed not found' });
    }
    res.json({ message: 'Bed deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;