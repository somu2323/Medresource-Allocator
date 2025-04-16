import { addDays, addHours, format, isWithinInterval, parseISO } from 'date-fns';

interface Staff {
  _id: string;
  name: string;
  department: string;
}

interface Shift {
  date: string;
  startTime: string;
  endTime: string;
}

interface OptimizationConstraints {
  department: string;
  minStaffPerShift: number;
  minRestHours: number;
  maxWorkingHours: number;
  maxConsecutiveDays: number;
}

interface FormattedShift extends Shift {
  dayName: string;
  shiftName: string;
}

interface OptimizedSchedule {
  staffId: string;
  staffName: string;
  department: string;
  shifts: FormattedShift[];
}

class ScheduleOptimizer {
  private static SHIFT_TYPES = [
    { startTime: '07:00', endTime: '15:00', name: 'Morning' },
    { startTime: '15:00', endTime: '23:00', name: 'Afternoon' },
    { startTime: '23:00', endTime: '07:00', name: 'Night' },
  ];

  static generateOptimizedSchedule(
    staff: Staff[],
    constraints: OptimizationConstraints,
    days: number = 7
  ): OptimizedSchedule[] {
    if (!staff || staff.length === 0) {
      throw new Error('No staff members provided');
    }

    const departmentStaff = staff.filter(s => 
      s.department.trim().toLowerCase() === constraints.department.trim().toLowerCase()
    );
    if (departmentStaff.length === 0) {
      throw new Error(`No staff members found in department: ${constraints.department}`);
    }
    if (departmentStaff.length < constraints.minStaffPerShift) {
      throw new Error(`Not enough staff members in department: ${constraints.department}. Required: ${constraints.minStaffPerShift}, Available: ${departmentStaff.length}`)
    }

    const schedules: OptimizedSchedule[] = [];
    const staffWorkload = new Map<string, number>();
    const staffLastShift = new Map<string, Date>();
    const shiftAssignments = new Map<string, Set<string>>(); // date -> staffIds

    // Initialize workload tracking
    departmentStaff.forEach(s => {
      staffWorkload.set(s._id, 0);
      staffLastShift.set(s._id, new Date(0));
    });

    // Generate schedule for each staff member
    for (const staffMember of departmentStaff) {
      const staffSchedule: OptimizedSchedule = {
        staffId: staffMember._id,
        staffName: staffMember.name,
        department: staffMember.department,
        shifts: [],
      };

      let consecutiveDays = 0;
      const today = new Date();

      for (let day = 0; day < days; day++) {
        const currentDate = addDays(today, day);
        const dateKey = format(currentDate, 'yyyy-MM-dd');

        // Skip if max consecutive days reached
        if (consecutiveDays >= constraints.maxConsecutiveDays) {
          consecutiveDays = 0;
          continue;
        }

        // Try to assign a shift
        const assignedShift = this.findSuitableShift(
          staffMember._id,
          currentDate,
          constraints,
          staffWorkload,
          staffLastShift,
          shiftAssignments
        );

        if (assignedShift) {
          const formattedShift: FormattedShift = {
            ...assignedShift,
            dayName: format(currentDate, 'EEEE'),
            shiftName: this.getShiftName(assignedShift.startTime)
          };
          staffSchedule.shifts.push(formattedShift);
          consecutiveDays++;

          // Update tracking
          const shiftHours = this.calculateShiftHours(assignedShift);
          staffWorkload.set(
            staffMember._id,
            (staffWorkload.get(staffMember._id) || 0) + shiftHours
          );

          const shiftEnd = this.getShiftEndTime(currentDate, assignedShift.endTime);
          staffLastShift.set(staffMember._id, shiftEnd);

          // Track staff assigned to this date
          if (!shiftAssignments.has(dateKey)) {
            shiftAssignments.set(dateKey, new Set());
          }
          shiftAssignments.get(dateKey)?.add(staffMember._id);
        }
      }

      schedules.push(staffSchedule);
    }

    return schedules;
  }

  private static findSuitableShift(
    staffId: string,
    date: Date,
    constraints: OptimizationConstraints,
    staffWorkload: Map<string, number>,
    staffLastShift: Map<string, Date>,
    shiftAssignments: Map<string, Set<string>>
  ): Shift | null {
    const dateKey = format(date, 'yyyy-MM-dd');
    
    // Track staff count per shift type for the current date
    const shiftTypeCount = new Map<string, number>();
    const staffShiftTypes = new Map<string, string>();

    // Initialize shift type counts
    this.SHIFT_TYPES.forEach(shift => shiftTypeCount.set(shift.startTime, 0));

    // Count current assignments per shift type
    if (shiftAssignments.has(dateKey)) {
      const dateAssignments = shiftAssignments.get(dateKey)!;
      dateAssignments.forEach(assignedStaffId => {
        const shiftType = staffShiftTypes.get(assignedStaffId);
        if (shiftType) {
          shiftTypeCount.set(shiftType, (shiftTypeCount.get(shiftType) || 0) + 1);
        }
      });
    }

    // Find the shift type with the least assignments
    let leastAssignedShiftType = this.SHIFT_TYPES[0];
    let minAssignments = Number.MAX_VALUE;

    for (const shiftType of this.SHIFT_TYPES) {
      const currentCount = shiftTypeCount.get(shiftType.startTime) || 0;
      if (currentCount < minAssignments) {
        minAssignments = currentCount;
        leastAssignedShiftType = shiftType;
      }
    }

    // Check if adding this shift would exceed weekly hours
    const shiftHours = this.calculateShiftHours({
      date: dateKey,
      ...leastAssignedShiftType
    });
    
    if ((staffWorkload.get(staffId) || 0) + shiftHours > constraints.maxWorkingHours) {
      return null;
    }

    // Check minimum rest period
    const shiftStart = this.getShiftStartTime(date, leastAssignedShiftType.startTime);
    const lastShiftEnd = staffLastShift.get(staffId) || new Date(0);
    const restHours = (shiftStart.getTime() - lastShiftEnd.getTime()) / (1000 * 60 * 60);
    
    if (restHours < constraints.minRestHours) {
      return null;
    }

    // Check if minimum staff requirement is met for the date
    const assignedStaff = shiftAssignments.get(dateKey)?.size || 0;
    if (assignedStaff < constraints.minStaffPerShift || minAssignments < Math.floor(assignedStaff / this.SHIFT_TYPES.length)) {
      // Update tracking
      staffShiftTypes.set(staffId, leastAssignedShiftType.startTime);
      
      return {
        date: dateKey,
        startTime: leastAssignedShiftType.startTime,
        endTime: leastAssignedShiftType.endTime
      };
    }

    return null;
  }

  private static calculateShiftHours(shift: Shift): number {
    const startHour = parseInt(shift.startTime.split(':')[0]);
    const endHour = parseInt(shift.endTime.split(':')[0]);
    return endHour > startHour ? endHour - startHour : (24 - startHour) + endHour;
  }

  private static getShiftStartTime(date: Date, timeString: string): Date {
    const [hours, minutes] = timeString.split(':').map(Number);
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), hours, minutes);
  }

  private static getShiftEndTime(date: Date, timeString: string): Date {
    const endTime = this.getShiftStartTime(date, timeString);
    if (timeString < '07:00') { // If end time is next day
      return addDays(endTime, 1);
    }
    return endTime;
  }

  private static getShiftName(startTime: string): string {
    const shiftType = this.SHIFT_TYPES.find(shift => shift.startTime === startTime);
    return shiftType?.name || '';
  }
}

export default ScheduleOptimizer;