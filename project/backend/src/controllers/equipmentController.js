import Equipment from '../models/equipment.js';

// Get all equipment
export const getAllEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.find().populate('assigned_to', 'name');
    res.json(equipment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single equipment item
export const getEquipmentById = async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.params.id).populate('assigned_to', 'name');
    if (!equipment) {
      return res.status(404).json({ message: 'Equipment not found' });
    }
    res.json(equipment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new equipment
export const createEquipment = async (req, res) => {
  const equipment = new Equipment({
    name: req.body.name,
    type: req.body.type,
    status: req.body.status,
    location: req.body.location,
    last_maintenance_date: req.body.last_maintenance_date,
    next_maintenance_date: req.body.next_maintenance_date,
    assigned_to: req.body.assigned_to,
    notes: req.body.notes
  });

  try {
    const newEquipment = await equipment.save();
    res.status(201).json(newEquipment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update equipment
export const updateEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.params.id);
    if (!equipment) {
      return res.status(404).json({ message: 'Equipment not found' });
    }

    Object.assign(equipment, req.body);
    const updatedEquipment = await equipment.save();
    res.json(updatedEquipment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete equipment
export const deleteEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.params.id);
    if (!equipment) {
      return res.status(404).json({ message: 'Equipment not found' });
    }

    await equipment.deleteOne();
    res.json({ message: 'Equipment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get equipment by status
export const getEquipmentByStatus = async (req, res) => {
  try {
    const equipment = await Equipment.find({ status: req.params.status }).populate('assigned_to', 'name');
    res.json(equipment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get equipment by type
export const getEquipmentByType = async (req, res) => {
  try {
    const equipment = await Equipment.find({ type: req.params.type }).populate('assigned_to', 'name');
    res.json(equipment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get equipment due for maintenance
export const getMaintenanceDueEquipment = async (req, res) => {
  try {
    const today = new Date();
    const equipment = await Equipment.find({
      next_maintenance_date: { $lte: today }
    }).populate('assigned_to', 'name');
    res.json(equipment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};