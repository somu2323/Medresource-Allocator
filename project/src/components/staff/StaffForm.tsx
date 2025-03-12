import React, { useState } from 'react';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import { Staff } from '../../types';

interface StaffFormProps {
  initialData?: Staff;
  onSubmit: (data: Partial<Staff>) => void;
  onCancel: () => void;
  isLoading: boolean;
}

const StaffForm: React.FC<StaffFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading,
}) => {
  const [formData, setFormData] = useState<Partial<Staff>>(
    initialData || {
      name: '',
      role: '',
      department: '',
      contact: '',
      email: '',
      status: 'On Duty',
      specialization: '',
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

  const roleOptions = [
    { value: 'doctor', label: 'Doctor' },
    { value: 'nurse', label: 'Nurse' },
    { value: 'technician', label: 'Technician' },
    { value: 'receptionist', label: 'Receptionist' },
    { value: 'administrator', label: 'Administrator' },
    { value: 'janitor', label: 'Janitor' },
    { value: 'security', label: 'Security' },
  ];

  const departmentOptions = [
    { value: 'cardiology', label: 'Cardiology' },
    { value: 'neurology', label: 'Neurology' },
    { value: 'pediatrics', label: 'Pediatrics' },
    { value: 'orthopedics', label: 'Orthopedics' },
    { value: 'oncology', label: 'Oncology' },
    { value: 'emergency', label: 'Emergency' },
    { value: 'icu', label: 'Intensive Care Unit' },
    { value: 'administration', label: 'Administration' },
  ];

  const statusOptions = [
    { value: 'On Duty', label: 'On Duty' },
    { value: 'Off Duty', label: 'Off Duty' },
    { value: 'On Leave', label: 'On Leave' },
    { value: 'Training', label: 'Training' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Full Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
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
        <Select
          label="Department"
          name="department"
          value={formData.department}
          onChange={handleChange}
          options={departmentOptions}
          required
        />
        <Select
          label="Status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          options={statusOptions}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Contact Number"
          name="contact"
          value={formData.contact}
          onChange={handleChange}
          required
        />
        <Input
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        <Input
          label="Specialization"
          name="specialization"
          value={formData.specialization || ''}
          onChange={handleChange}
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
          {initialData ? 'Update Staff' : 'Add Staff Member'}
        </Button>
      </div>
    </form>
  );
};

export default StaffForm;