import Bed from '../models/bed.js';

// Get all beds
export const getAllBeds = async (req, res) => {
  try {
    const beds = await Bed.find();
    res.json(beds);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single bed
export const getBedById = async (req, res) => {
  try {
    const bed = await Bed.findById(req.params.id);
    if (!bed) {
      return res.status(404).json({ message: 'Bed not found' });
    }
    res.json(bed);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new bed
export const createBed = async (req, res) => {
  const bed = new Bed({
    room_number: req.body.room_number,
    bed_number: req.body.bed_number,
    department: req.body.department,
    status: req.body.status,
    patient_id: req.body.patient_id,
    patient_name: req.body.patient_name,
    admission_date: req.body.admission_date,
    expected_discharge_date: req.body.expected_discharge_date,
    notes: req.body.notes
  });

  try {
    const newBed = await bed.save();
    res.status(201).json(newBed);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a bed
export const updateBed = async (req, res) => {
  try {
    const bed = await Bed.findById(req.params.id);
    if (!bed) {
      return res.status(404).json({ message: 'Bed not found' });
    }

    Object.assign(bed, req.body);
    const updatedBed = await bed.save();
    res.json(updatedBed);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a bed
export const deleteBed = async (req, res) => {
  try {
    const bed = await Bed.findById(req.params.id);
    if (!bed) {
      return res.status(404).json({ message: 'Bed not found' });
    }

    await bed.deleteOne();
    res.json({ message: 'Bed deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};