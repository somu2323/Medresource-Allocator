import { Bed } from '../types';

interface OptimizationInput {
  beds: Bed[];
  waitingListCount: number;
  departmentCapacities: { [key: string]: number };
}

interface OptimizationResult {
  bedAssignments: {
    bedId: string;
    patientId: string;
    priority: number;
    expectedStayDuration: number;
  }[];
  utilizationRate: number;
  waitingList: number;
}

class SimplexSolver {
  private tableau: number[][] = [];
  private variables: string[] = [];
  private constraints: string[] = [];

  constructor() {}

  addVariable(name: string, coefficient: number) {
    this.variables.push(name);
    if (this.tableau.length === 0) {
      this.tableau.push([]);
    }
    this.tableau[0].push(-coefficient); // Negative for maximization
  }

  addConstraint(coefficients: number[], sign: string, rhs: number) {
    const row = [...coefficients];
    if (sign === '<=' || sign === '=') {
      row.push(rhs);
    } else if (sign === '>=') {
      row.push(-rhs);
      for (let i = 0; i < row.length; i++) {
        row[i] = -row[i];
      }
    }
    this.tableau.push(row);
    this.constraints.push(`c${this.constraints.length}`);
  }

  solve(): number[] {
    // Implement simplex algorithm
    // This is a simplified version - in production, use a robust LP solver library
    const m = this.tableau.length;
    const n = this.tableau[0].length;

    // Add slack variables
    for (let i = 1; i < m; i++) {
      for (let j = 0; j < m - 1; j++) {
        this.tableau[i].push(i === j + 1 ? 1 : 0);
      }
    }

    while (this.hasNegativeInObjective()) {
      const pivotCol = this.findPivotColumn();
      const pivotRow = this.findPivotRow(pivotCol);
      if (pivotRow === -1) break; // Unbounded
      this.pivot(pivotRow, pivotCol);
    }

    const solution = new Array(this.variables.length).fill(0);
    for (let i = 0; i < this.variables.length; i++) {
      let hasOne = false;
      let row = -1;
      for (let j = 1; j < this.tableau.length; j++) {
        if (this.tableau[j][i] === 1) {
          hasOne = true;
          row = j;
          break;
        }
      }
      if (hasOne) {
        solution[i] = this.tableau[row][this.tableau[0].length - 1];
      }
    }
    return solution;
  }

  private hasNegativeInObjective(): boolean {
    return this.tableau[0].slice(0, -1).some(x => x < 0);
  }

  private findPivotColumn(): number {
    return this.tableau[0].findIndex(x => x < 0);
  }

  private findPivotRow(col: number): number {
    let minRatio = Infinity;
    let pivotRow = -1;
    for (let i = 1; i < this.tableau.length; i++) {
      if (this.tableau[i][col] > 0) {
        const ratio = this.tableau[i][this.tableau[0].length - 1] / this.tableau[i][col];
        if (ratio < minRatio) {
          minRatio = ratio;
          pivotRow = i;
        }
      }
    }
    return pivotRow;
  }

  private pivot(row: number, col: number) {
    const pivot = this.tableau[row][col];
    for (let j = 0; j < this.tableau[0].length; j++) {
      this.tableau[row][j] /= pivot;
    }
    for (let i = 0; i < this.tableau.length; i++) {
      if (i !== row) {
        const factor = this.tableau[i][col];
        for (let j = 0; j < this.tableau[0].length; j++) {
          this.tableau[i][j] -= factor * this.tableau[row][j];
        }
      }
    }
  }
}

export function optimizeBedAllocation(input: OptimizationInput): OptimizationResult {
  const { beds, waitingListCount, departmentCapacities } = input;
  const solver = new SimplexSolver();

  // Add variables for each bed assignment
  const availableBeds = beds.filter(bed => bed.status === 'Available');
  availableBeds.forEach((bed, index) => {
    solver.addVariable(`bed_${index}`, calculatePriority(bed));
  });

  // Add department capacity constraints
  Object.entries(departmentCapacities).forEach(([dept, capacity]) => {
    const coefficients = availableBeds.map(bed => bed.department === dept ? 1 : 0);
    solver.addConstraint(coefficients, '<=', capacity);
  });

  // Add total beds constraint
  solver.addConstraint(new Array(availableBeds.length).fill(1), '<=', waitingListCount);

  // Solve the linear programming problem
  const solution = solver.solve();

  // Convert solution to bed assignments
  const bedAssignments = solution.map((value, index) => {
    const bed = availableBeds[index];
    return {
      bedId: bed.id,
      patientId: value > 0.5 ? 'WAITING_LIST' : '',
      priority: calculatePriority(bed),
      expectedStayDuration: estimateStayDuration(bed),
    };
  }).filter(assignment => assignment.patientId !== '');

  const utilizationRate = (beds.filter(bed => bed.status === 'Occupied').length / beds.length) * 100;

  return {
    bedAssignments,
    utilizationRate,
    waitingList: waitingListCount - bedAssignments.length,
  };
}

function calculatePriority(bed: Bed): number {
  // Implement priority calculation based on bed attributes
  let priority = 1;
  if (bed.department === 'ICU') priority += 2;
  if (bed.status === 'Available') priority += 1;
  return priority;
}

function estimateStayDuration(bed: Bed): number {
  // Implement stay duration estimation logic
  const baseDuration = 3;
  const durationByDepartment: { [key: string]: number } = {
    'ICU': 5,
    'General Ward': 3,
    'Cardiology': 4,
    'Pediatrics': 2,
  };
  return durationByDepartment[bed.department] || baseDuration;
}