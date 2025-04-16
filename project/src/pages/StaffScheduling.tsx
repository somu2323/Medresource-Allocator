import React, { useState, useEffect } from 'react';
import { Schedule, Staff } from '../types';
import { schedulesApi, staffApi } from '../lib/api';
import ScheduleForm from '../components/scheduling/ScheduleForm';
import Button from '../components/ui/Button';
import { format } from 'date-fns';

const StaffScheduling = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);

  useEffect(() => {
    fetchSchedules();
    fetchStaff();
  }, []);

  const fetchSchedules = async () => {
    try {
      const response = await schedulesApi.getAll();
      setSchedules(response.data);
    } catch (error) {
      console.error('Error fetching schedules:', error);
    }
  };

  const fetchStaff = async () => {
    try {
      const response = await staffApi.getAll();
      setStaff(response.data);
    } catch (error) {
      console.error('Error fetching staff:', error);
    }
  };

  const handleSubmit = async (data: Partial<Schedule>) => {
    setIsLoading(true);
    try {
      if (selectedSchedule) {
        await schedulesApi.update(selectedSchedule.id, data);
      } else {
        await schedulesApi.create(data);
      }
      await fetchSchedules();
      setShowForm(false);
      setSelectedSchedule(null);
    } catch (error) {
      console.error('Error saving schedule:', error);
    }
    setIsLoading(false);
  };

  const handleEdit = (schedule: Schedule) => {
    setSelectedSchedule(schedule);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this schedule?')) return;
    
    setIsLoading(true);
    try {
      await schedulesApi.delete(id);
      await fetchSchedules();
    } catch (error) {
      console.error('Error deleting schedule:', error);
    }
    setIsLoading(false);
  };

  const staffOptions = staff.map((s) => ({
    value: s.id,
    label: s.name,
  }));

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Staff Scheduling</h1>
        <Button onClick={() => setShowForm(true)}>Add Schedule</Button>
      </div>

      {showForm ? (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {selectedSchedule ? 'Edit Schedule' : 'Add New Schedule'}
          </h2>
          <ScheduleForm
            initialData={selectedSchedule || undefined}
            staffOptions={staffOptions}
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false);
              setSelectedSchedule(null);
            }}
            isLoading={isLoading}
          />
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Staff Member
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Shift Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {schedules.map((schedule) => (
                <tr key={schedule.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {schedule.staff_name}
                    </div>
                    <div className="text-sm text-gray-500">{schedule.role}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {schedule.department}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>{format(new Date(schedule.shift_start), 'PPp')}</div>
                    <div>{format(new Date(schedule.shift_end), 'PPp')}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        schedule.status === 'Completed'
                          ? 'bg-green-100 text-green-800'
                          : schedule.status === 'Cancelled'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {schedule.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(schedule)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(schedule.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StaffScheduling;