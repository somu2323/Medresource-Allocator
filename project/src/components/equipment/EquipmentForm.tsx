import React, { useState } from 'react';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import { Equipment } from '../../types';

interface EquipmentFormProps {
  initialData?: Equipment;
  onSubmit: (data: Partial<Equipment>) => void;
  onCancel: () => void;
  isLoading: boolean;
}

const EquipmentForm: React.FC<EquipmentFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading,
}) => {
  const [formData, setFormData] = useState<Partial<Equipment>>(
    initialData || {
      name: '',
      type: '',
      status: 'Available',
      location: '',
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

  const equipmentTypeOptions = [
    { value: 'ventilator', label: 'Ventilator' },
    { value: 'monitor', label: 'Patient Monitor' },
    { value: 'infusion_pump', label: 'Infusion Pump' },
    { value: 'defibrillator', label: 'Defibrillator' },
    { value: 'ecg', label: 'ECG Machine' },
    { value: 'ultrasound', label: 'Ultrasound' },
    { value: 'xray', label: 'X-Ray Machine' },
    { value: 'mri', label: 'MRI Scanner' },
    { value: 'ct', label: 'CT Scanner' },
    { value: 'other', label: 'Other' },
  ];

  const statusOptions = [
    { value: 'Available', label: 'Available' },
    { value: 'In Use', label: 'In Use' },
    { value: 'Maintenance', label: 'Maintenance' },
    { value: 'Reserved', label: 'Reserved' },
  ];

  const locationOptions = [
    { value: 'cardiology', label: 'Cardiology Department' },
    { value: 'neurology', label: 'Neurology Department' },
    { value: 'pediatrics', label: 'Pediatrics Department' },
    { value: 'orthopedics', label: 'Orthopedics Department' },
    { value: 'oncology', label: 'Oncology Department' },
    { value: 'emergency', label: 'Emergency Department' },
    { value: 'icu', label: 'Intensive Care Unit' },
    { value: 'or', label: 'Operating Room' },
    { value: 'storage', label: 'Storage Room' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Equipment Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <Select
          label="Equipment Type"
          name="type"
          value={formData.type}
          onChange={handleChange}
          options={equipmentTypeOptions}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          options={statusOptions}
          required
        />
        <Select
          label="Location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          options={locationOptions}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Last Maintenance Date"
          name="last_maintenance_date"
          type="date"
          value={formData.last_maintenance_date || ''}
          onChange={handleChange}
        />
        <Input
          label="Next Maintenance Date"
          name="next_maintenance_date"
          type="date"
          value={formData.next_maintenance_date || ''}
          onChange={handleChange}
        />
      </div>

      {formData.status === 'In Use' && (
        <Input
          label="Assigned To"
          name="assigned_to"
          value={formData.assigned_to || ''}
          onChange={handleChange}
        />
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
          {initialData ? 'Update Equipment' : 'Add Equipment'}
        </Button>
      </div>
    </form>
  );
};

export default EquipmentForm;