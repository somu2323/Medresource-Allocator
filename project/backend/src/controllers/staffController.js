import Staff from '../models/staff.js';

// Get all staff members
export const getAllStaff = async (req, res) => {
  try {
    const staff = await Staff.find();
    res.json(staff);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single staff member
export const getStaffById = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);
    if (!staff) {
      return res.status(404).json({ message: 'Staff member not found' });
    }
    res.json(staff);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new staff member
export const createStaff = async (req, res) => {
  const staff = new Staff({
    name: req.body.name,
    role: req.body.role,
    department: req.body.department,
    contact: req.body.contact,
    email: req.body.email,
    status: req.body.status,
    specialization: req.body.specialization,
    notes: req.body.notes
  });

  try {
    const newStaff = await staff.save();
    res.status(201).json(newStaff);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a staff member
export const updateStaff = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);
    if (!staff) {
      return res.status(404).json({ message: 'Staff member not found' });
    }

    Object.assign(staff, req.body);
    const updatedStaff = await staff.save();
    res.json(updatedStaff);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a staff member
export const deleteStaff = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);
    if (!staff) {
      return res.status(404).json({ message: 'Staff member not found' });
    }

    await staff.deleteOne();
    res.json({ message: 'Staff member deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get staff by department
export const getStaffByDepartment = async (req, res) => {
  try {
    const staff = await Staff.find({ department: req.params.department });
    res.json(staff);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get staff by role
export const getStaffByRole = async (req, res) => {
  try {
    const staff = await Staff.find({ role: req.params.role });
    res.json(staff);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};