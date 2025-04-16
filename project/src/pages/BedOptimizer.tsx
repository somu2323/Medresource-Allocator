import React, { useState, useEffect } from 'react';
import BedOptimizer from '../lib/services/bedOptimizer';
import PatientForm from '../components/patients/PatientForm';
import BedAvailability from '../components/BedAvailability';

interface Patient {
  _id: string;
  name: string;
  urgencyScore: number;
  requiredDepartment: string;
  admissionDate: string;
}

interface Bed {
  _id: string;
  department: string;
  isOccupied: boolean;
  currentPatientId?: string;
}

interface BedAssignment {
  bedId: string;
  patientId: string;
  department: string;
  urgencyScore: number;
  assignmentDate: string;
}

const BedOptimizerPage: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [beds, setBeds] = useState<Bed[]>([]);
  const [assignments, setAssignments] = useState<BedAssignment[]>([]);
  const [unassignedPatients, setUnassignedPatients] = useState<Patient[]>([]);
  const [departmentStats, setDepartmentStats] = useState<{
    [key: string]: { total: number; occupied: number; available: number };
  }>({});

  useEffect(() => {
    // Initialize beds based on department constraints
    const constraints = BedOptimizer.getDepartmentConstraints();
    const initialBeds: Bed[] = [];
    
    constraints.forEach(({ department, totalBeds }) => {
      for (let i = 0; i < totalBeds; i++) {
        initialBeds.push({
          _id: `bed_${department}_${i + 1}`,
          department,
          isOccupied: false
        });
      }
    });

    setBeds(initialBeds);
  }, []);

  const handleAddPatient = (newPatient: Patient) => {
    setPatients([...patients, newPatient]);
  };

  const handleOptimize = () => {
    if (patients.length && beds.length) {
      const result = BedOptimizer.optimizeBedAssignments(patients, beds);
      setAssignments(result.assignments);
      setUnassignedPatients(result.unassignedPatients);
      setDepartmentStats(result.departmentUtilization);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Bed Optimization System</h1>
      
      {/* Patient Input Form */}
      <PatientForm onSubmit={handleAddPatient} />

      {/* Added Patients List */}
      {patients.length > 0 && (
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <h2 className="text-xl font-semibold mb-4">Added Patients</h2>
          <div className="space-y-2">
            {patients.map((patient) => (
              <div key={patient._id} className="border-l-4 border-blue-500 pl-4 py-2">
                <p className="font-medium">{patient.name}</p>
                <p className="text-sm text-gray-600">
                  Required: {patient.requiredDepartment}
                </p>
                <p className="text-sm text-gray-600">
                  Urgency Score: {patient.urgencyScore}
                </p>
                <p className="text-sm text-gray-600">
                  Admission Date: {patient.admissionDate}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Optimize Button */}
      <button
        onClick={handleOptimize}
        className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 transition-colors mb-8"
        disabled={patients.length === 0}
      >
        Optimize Bed Assignments
      </button>

      {/* Department Statistics */}
      <BedAvailability departmentUtilization={departmentStats} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Current Assignments */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-4">Current Assignments</h2>
          <div className="space-y-2">
            {assignments.map((assignment) => {
              const patient = patients.find(p => p._id === assignment.patientId);
              return (
                <div key={assignment.bedId} className="border-l-4 border-green-500 pl-4 py-2">
                  <p className="font-medium">{patient?.name}</p>
                  <p className="text-sm font-medium text-blue-600">
                    Department: {assignment.department}
                  </p>
                  <p className="text-sm text-gray-600">
                    Bed ID: {assignment.bedId}
                  </p>
                  <p className="text-sm text-gray-600">
                    Urgency Score: {assignment.urgencyScore}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Unassigned Patients */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-4">Unassigned Patients</h2>
          <div className="space-y-2">
            {unassignedPatients.map((patient) => (
              <div key={patient._id} className="border-l-4 border-red-500 pl-4 py-2">
                <p className="font-medium">{patient.name}</p>
                <p className="text-sm text-gray-600">
                  Required: {patient.requiredDepartment}
                </p>
                <p className="text-sm text-gray-600">
                  Urgency Score: {patient.urgencyScore}
                </p>
                <p className="text-sm text-gray-600">
                  Admission Date: {patient.admissionDate}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BedOptimizerPage;