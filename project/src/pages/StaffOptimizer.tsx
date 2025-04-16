import React, { useState, useEffect } from 'react';
import { staffApi, schedulesApi } from '../lib/api';
import ScheduleOptimizer from '../lib/services/scheduleOptimizer';

interface OptimizationConstraints {
  department: string;
  minStaffPerShift: number;
  minRestHours: number;
  maxWorkingHours: number;
  maxConsecutiveDays: number;
}

interface OptimizedSchedule {
  staffId: string;
  staffName: string;
  department: string;
  shifts: {
    date: string;
    startTime: string;
    endTime: string;
    dayName: string;
    shiftName: string;
  }[];
}

const StaffOptimizer: React.FC = () => {
  const [constraints, setConstraints] = useState<OptimizationConstraints>({
    department: '',
    minStaffPerShift: 2,
    minRestHours: 12,
    maxWorkingHours: 40,
    maxConsecutiveDays: 5
  });

  const [optimizedSchedule, setOptimizedSchedule] = useState<OptimizedSchedule[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [staff, setStaff] = useState<any[]>([]);
  const [schedules, setSchedules] = useState<any[]>([]);

  const departments = [
    'Emergency',
    'ICU',
    'Surgery',
    'Pediatrics',
    'General Medicine',
    'Cardiology'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setConstraints(prev => ({
      ...prev,
      [name]: name === 'department' ? value : Number(value)
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [staffRes, schedulesRes] = await Promise.all([
          staffApi.getAll(),
          schedulesApi.getAll()
        ]);
        setStaff(staffRes.data);
        setSchedules(schedulesRes.data);
      } catch (err) {
        setError('Failed to fetch data');
      }
    };
    fetchData();
  }, []);

  const generateSchedule = async () => {
    setLoading(true);
    setError(null);
    try {
      // Generate optimized schedule using the ScheduleOptimizer service
      const optimizedSchedules = ScheduleOptimizer.generateOptimizedSchedule(
        staff,
        constraints,
        7 // Generate schedule for 7 days
      );

      setOptimizedSchedule(optimizedSchedules);
    } catch (err: any) {
      setError(err.message || 'Failed to generate optimized schedule');
    }
    setLoading(false);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Staff Schedule Optimizer</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Optimization Constraints</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department
              </label>
              <select
                name="department"
                value={constraints.department}
                onChange={handleInputChange}
                className="w-full border rounded-md p-2"
              >
                <option value="">Select Department</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Minimum Staff per Shift
              </label>
              <input
                type="number"
                name="minStaffPerShift"
                value={constraints.minStaffPerShift}
                onChange={handleInputChange}
                min="1"
                className="w-full border rounded-md p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Minimum Rest Hours
              </label>
              <input
                type="number"
                name="minRestHours"
                value={constraints.minRestHours}
                onChange={handleInputChange}
                min="8"
                max="24"
                className="w-full border rounded-md p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Maximum Working Hours (Weekly)
              </label>
              <input
                type="number"
                name="maxWorkingHours"
                value={constraints.maxWorkingHours}
                onChange={handleInputChange}
                min="20"
                max="60"
                className="w-full border rounded-md p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Maximum Consecutive Days
              </label>
              <input
                type="number"
                name="maxConsecutiveDays"
                value={constraints.maxConsecutiveDays}
                onChange={handleInputChange}
                min="1"
                max="7"
                className="w-full border rounded-md p-2"
              />
            </div>

            <button
              onClick={generateSchedule}
              disabled={loading || !constraints.department}
              className={`w-full py-2 px-4 rounded-md text-white font-medium ${loading || !constraints.department ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {loading ? 'Generating...' : 'Generate Optimized Schedule'}
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Optimized Schedule</h2>
          
          {error && (
            <div className="text-red-500 mb-4">{error}</div>
          )}

          {optimizedSchedule.length > 0 ? (
            <div className="space-y-4">
              {optimizedSchedule.map((schedule, index) => (
                <div key={index} className="border rounded-md p-4">
                  <h3 className="font-medium">{schedule.staffName}</h3>
                  <p className="text-gray-600 mb-2">{schedule.department}</p>
                  <div className="space-y-2">
                    {schedule.shifts.map((shift, shiftIndex) => (
                      <div key={shiftIndex} className="text-sm py-1">
                        <span className="font-medium">{shift.dayName}: </span>
                        <span>{shift.shiftName} ({shift.startTime}-{shift.endTime})</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-500">
              No schedule generated yet. Please set constraints and generate a schedule.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffOptimizer;