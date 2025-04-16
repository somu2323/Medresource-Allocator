import React, { useState } from 'react';

interface Patient {
  _id: string;
  name: string;
  urgencyScore: number;
  requiredDepartment: string;
  admissionDate: string;
}

interface PatientFormProps {
  onSubmit: (patient: Patient) => void;
}

const PatientForm: React.FC<PatientFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<Omit<Patient, '_id'>>({ 
    name: '',
    urgencyScore: 1,
    requiredDepartment: 'General',
    admissionDate: new Date().toISOString().split('T')[0]
  });

  const departments = ['ICU', 'Emergency', 'General'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const patient: Patient = {
      _id: Math.random().toString(36).substr(2, 9),
      ...formData
    };
    onSubmit(patient);
    // Reset form
    setFormData({
      name: '',
      urgencyScore: 1,
      requiredDepartment: 'General',
      admissionDate: new Date().toISOString().split('T')[0]
    });
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Add New Patient</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Patient Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full rounded-md border border-gray-300 p-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Urgency Score (1-10)
          </label>
          <input
            type="number"
            min="1"
            max="10"
            value={formData.urgencyScore}
            onChange={(e) => setFormData({ ...formData, urgencyScore: parseInt(e.target.value) })}
            className="w-full rounded-md border border-gray-300 p-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Required Department
          </label>
          <select
            value={formData.requiredDepartment}
            onChange={(e) => setFormData({ ...formData, requiredDepartment: e.target.value })}
            className="w-full rounded-md border border-gray-300 p-2"
            required
          >
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Admission Date
          </label>
          <input
            type="date"
            value={formData.admissionDate}
            onChange={(e) => setFormData({ ...formData, admissionDate: e.target.value })}
            className="w-full rounded-md border border-gray-300 p-2"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
        >
          Add Patient
        </button>
      </form>
    </div>
  );
};

export default PatientForm;