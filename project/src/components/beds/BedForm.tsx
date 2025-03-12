import React, { useState } from 'react';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import { Bed } from '../../types';

interface BedFormProps {
  initialData?: Bed;
  onSubmit: (data: Partial<Bed>) => void;
  onCancel: () => void;
  isLoading: boolean;
}

const BedForm: React.FC<BedFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading,
}) => {
  const [formData, setFormData] = useState<Partial<Bed>>(
    initialData || {
      room_number: '',
      bed_number: '',
      department: 'General Ward', // Set default department
      status: 'Available',
      notes: '',
    }
  );
  const [error, setError] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user makes changes
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Clear any previous errors
    setError('');
    onSubmit(formData);
  };

  const departmentOptions = [
    { value: 'General Ward', label: 'General Ward' },
    { value: 'Cardiology', label: 'Cardiology' },
    { value: 'Neurology', label: 'Neurology' },
    { value: 'Pediatrics', label: 'Pediatrics' },
    { value: 'Orthopedics', label: 'Orthopedics' },
    { value: 'Oncology', label: 'Oncology' },
    { value: 'Emergency', label: 'Emergency' },
    { value: 'ICU', label: 'Intensive Care Unit' },
  ];

  const statusOptions = [
    { value: 'Available', label: 'Available' },
    { value: 'Occupied', label: 'Occupied' },
    { value: 'Maintenance', label: 'Maintenance' },
    { value: 'Reserved', label: 'Reserved' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Room Number"
          name="room_number"
          value={formData.room_number}
          onChange={handleChange}
          required
        />
        <Input
          label="Bed Number"
          name="bed_number"
          value={formData.bed_number}
          onChange={handleChange}
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

      {(formData.status === 'Occupied' || formData.status === 'Reserved') && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Patient Name"
            name="patient_name"
            value={formData.patient_name || ''}
            onChange={handleChange}
            required
          />
          <Input
            label="Patient ID"
            name="patient_id"
            value={formData.patient_id || ''}
            onChange={handleChange}
            required
          />
          <Input
            type="date"
            label="Admission Date"
            name="admission_date"
            value={formData.admission_date || ''}
            onChange={handleChange}
            required
          />
          <Input
            type="date"
            label="Expected Discharge Date"
            name="expected_discharge_date"
            value={formData.expected_discharge_date || ''}
            onChange={handleChange}
            required
          />
        </div>
      )}

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
          {initialData ? 'Update Bed' : 'Add Bed'}
        </Button>
      </div>
    </form>
  );
};

export default BedForm;