import { format } from 'date-fns';

interface Patient {
  _id: string;
  name: string;
  urgencyScore: number; // 1-10
  requiredDepartment: string; // ICU, General, Emergency
  admissionDate: string;
  assigned?: boolean;
}

interface Bed {
  _id: string;
  department: string;
  isOccupied: boolean;
  currentPatientId?: string;
}

interface DepartmentConstraints {
  department: string;
  totalBeds: number;
  minUrgencyScore: number;
  maxUrgencyScore: number;
}

interface BedAssignment {
  bedId: string;
  patientId: string;
  department: string;
  urgencyScore: number;
  assignmentDate: string;
}

interface OptimizationResult {
  assignments: BedAssignment[];
  unassignedPatients: Patient[];
  departmentUtilization: {
    [key: string]: {
      total: number;
      occupied: number;
      available: number;
    };
  };
}

class BedOptimizer {
  private static DEPARTMENTS = ['ICU', 'General', 'Emergency'];
  private static DEPARTMENT_CONSTRAINTS: DepartmentConstraints[] = [
    { department: 'ICU', totalBeds: 3, minUrgencyScore: 8, maxUrgencyScore: 10 },
    { department: 'Emergency', totalBeds: 3, minUrgencyScore: 5, maxUrgencyScore: 10 },
    { department: 'General', totalBeds: 3, minUrgencyScore: 1, maxUrgencyScore: 10 }
  ];

  static optimizeBedAssignments(patients: Patient[], currentBeds: Bed[]): OptimizationResult {
    // Create a deep copy of beds to avoid modifying the original array
    const workingBeds = JSON.parse(JSON.stringify(currentBeds));
    
    // Initialize result structure
    const result: OptimizationResult = {
      assignments: [],
      unassignedPatients: [],
      departmentUtilization: {}
    };

    // Initialize department utilization
    this.DEPARTMENTS.forEach(dept => {
      const totalBeds = workingBeds.filter(bed => bed.department === dept).length;
      result.departmentUtilization[dept] = {
        total: totalBeds,
        occupied: 0,
        available: totalBeds
      };
    });

    // Sort patients by urgency score (descending) and admission date
    const sortedPatients = [...patients].sort((a, b) => {
      if (b.urgencyScore !== a.urgencyScore) {
        return b.urgencyScore - a.urgencyScore;
      }
      return new Date(a.admissionDate).getTime() - new Date(b.admissionDate).getTime();
    });

    // Process patients in order of urgency score and admission date
    sortedPatients.forEach(patient => {
      // Find an available bed in the patient's required department
      const availableBed = workingBeds.find(bed =>
        bed.department === patient.requiredDepartment && !bed.isOccupied
      );

      // Check if the patient's urgency score meets the department's constraints
      const deptConstraints = this.DEPARTMENT_CONSTRAINTS.find(
        c => c.department === patient.requiredDepartment
      );

      const meetsConstraints = deptConstraints &&
        patient.urgencyScore >= deptConstraints.minUrgencyScore &&
        patient.urgencyScore <= deptConstraints.maxUrgencyScore;

      if (availableBed && meetsConstraints) {
        // Assign the patient to the bed
        const assignment: BedAssignment = {
          bedId: availableBed._id,
          patientId: patient._id,
          department: patient.requiredDepartment,
          urgencyScore: patient.urgencyScore,
          assignmentDate: format(new Date(), 'yyyy-MM-dd')
        };

        result.assignments.push(assignment);
        
        // Update bed status
        const bedIndex = workingBeds.findIndex(bed => bed._id === availableBed._id);
        if (bedIndex !== -1) {
          workingBeds[bedIndex].isOccupied = true;
          workingBeds[bedIndex].currentPatientId = patient._id;
        }
        
        // Update department utilization
        result.departmentUtilization[patient.requiredDepartment].occupied++;
        result.departmentUtilization[patient.requiredDepartment].available--;
      } else {
        // If no suitable bed is available or constraints not met, add to unassigned patients
        result.unassignedPatients.push(patient);
      }
    });

    return result;
  }

  static validatePatient(patient: Patient): boolean {
    return (
      patient.urgencyScore >= 1 &&
      patient.urgencyScore <= 10 &&
      this.DEPARTMENTS.includes(patient.requiredDepartment)
    );
  }

  static getDepartmentConstraints(): DepartmentConstraints[] {
    return this.DEPARTMENT_CONSTRAINTS;
  }
}

export default BedOptimizer;