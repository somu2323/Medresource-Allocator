export interface Bed {
  id: string;
  room_number: string;
  bed_number: string;
  department: string;
  status: 'Available' | 'Occupied' | 'Maintenance' | 'Reserved';
  patient_id?: string;
  patient_name?: string;
  admission_date?: string;
  expected_discharge_date?: string;
  notes?: string;
}

export interface Equipment {
  id: string;
  name: string;
  type: string;
  status: 'Available' | 'In Use' | 'Maintenance' | 'Reserved';
  location: string;
  last_maintenance_date?: string;
  next_maintenance_date?: string;
  assigned_to?: string;
  notes?: string;
}

export interface Staff {
  id: string;
  name: string;
  role: string;
  department: string;
  contact: string;
  email: string;
  status: 'On Duty' | 'Off Duty' | 'On Leave' | 'Training';
  specialization?: string;
  notes?: string;
}

export interface Schedule {
  id: string;
  staff_id: string;
  staff_name: string;
  department: string;
  role: string;
  shift_start: string;
  shift_end: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  notes?: string;
}

export interface Department {
  id: string;
  name: string;
  floor: string;
  manager: string;
  beds_total: number;
  beds_available: number;
}

export interface DashboardStats {
  total_beds: number;
  available_beds: number;
  total_equipment: number;
  available_equipment: number;
  staff_on_duty: number;
  departments: Department[];
}