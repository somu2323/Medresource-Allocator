import React, { useState } from 'react';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import { Schedule } from '../../types';

interface ScheduleFormProps {
  initialData?: Schedule;
  staffOptions: { value: string; label: string }[];
  onSubmit: (data: Partial<Schedule>) => void;
  onCancel: () => void;
  isLoading: boolean;
}

const ScheduleForm: React.FC<ScheduleFormProps> = ({
  initialData,
  staffOptions,
  onSubmit,
  onCancel,
  isLoading,
}) => {
  const [formData, setFormData] = useState<Partial<Schedule>>(
    initialData || {
      staff_id: '',
      staff_name: '',
      department: '',
      role: '',
      shift_start: '',
      shift_end: '',
      status: 'Scheduled',
      notes: '',
    }
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const departmentOptions = [
    { value: 'cardiology', label: 'Cardiology' },
    { value: 'neurology', label: 'Neurology' },
    { value: 'pediatrics', label: 'Pediatrics' },
    { value: 'orthopedics', label: 'Orthopedics' },
    { value: 'oncology', label: 'Oncology' },
    { value: 'emergency', label: 'Emergency' },
    { value: 'icu', label: 'Intensive Care Unit' },
  ];

  const roleOptions = [
    { value: 'doctor', label: 'Doctor' },
    { value: 'nurse', label: 'Nurse' },
    { value: 'technician', label: 'Technician' },
    { value: 'receptionist', label: 'Receptionist' },
  ];

  const statusOptions = [
    { value: 'Scheduled', label: 'Scheduled' },
    { value: 'Completed', label: 'Completed' },
    { value: 'Cancelled', label: 'Cancelled' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <Select
          label="Staff Member"
          name="staff_id"
          value={formData.staff_id}
          onChange={handleChange}
          options={staffOptions}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Department"
          name="department"
          value={formData.department}
          onChange={handleChange}
          options={departmentOptions}
          required
        />
        <Select
          label="Role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          options={roleOptions}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Shift Start"
          name="shift_start"
          type="datetime-local"
          value={formData.shift_start}
          onChange={handleChange}
          required
        />
        <Input
          label="Shift End"
          name="shift_end"
          type="datetime-local"
          value={formData.shift_end}
          onChange={handleChange}
          required
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        <Select
          label="Status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          options={statusOptions}
          required
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
            Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={3}
            className="w-full rounded-md border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={formData.notes || ''}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          isLoading={isLoading}
        >
          {initialData ? 'Update Schedule' : 'Add Schedule'}
        </Button>
      </div>
    </form>
  );
};

export default ScheduleForm;