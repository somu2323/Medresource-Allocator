import React, { useEffect, useState } from 'react';
import { Staff, Equipment, Bed, Schedule, getAllStaff, getAllEquipment, getAllBeds, getAllSchedules } from '../lib/api';

const Dashboard: React.FC = () => {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [beds, setBeds] = useState<Bed[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [staffRes, equipmentRes, bedsRes, schedulesRes] = await Promise.all([
          getAllStaff(),
          getAllEquipment(),
          getAllBeds(),
          getAllSchedules()
        ]);

        setStaff(staffRes.data);
        setEquipment(equipmentRes.data);
        setBeds(bedsRes.data);
        setSchedules(schedulesRes.data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Hospital Resource Dashboard</h1>
      
      {/* Staff Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Staff Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {staff.map((member) => (
            <div key={member._id} className="p-4 border rounded-lg shadow">
              <h3 className="font-medium">{member.name}</h3>
              <p className="text-gray-600">{member.role} - {member.department}</p>
              <p className="text-sm mt-2">Status: {member.status}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Equipment Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Equipment Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {equipment.map((item) => (
            <div key={item._id} className="p-4 border rounded-lg shadow">
              <h3 className="font-medium">{item.name}</h3>
              <p className="text-gray-600">{item.type}</p>
              <p className="text-sm mt-2">Status: {item.status}</p>
              <p className="text-sm">Location: {item.location}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Beds Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Bed Availability</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {beds.map((bed) => (
            <div key={bed._id} className="p-4 border rounded-lg shadow">
              <h3 className="font-medium">Room {bed.room_number} - Bed {bed.bed_number}</h3>
              <p className="text-gray-600">{bed.department}</p>
              <p className="text-sm mt-2">Status: {bed.status}</p>
              {bed.patient_name && (
                <p className="text-sm">Patient: {bed.patient_name}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Schedules Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Today's Schedule</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {schedules.map((schedule) => (
            <div key={schedule._id} className="p-4 border rounded-lg shadow">
              <h3 className="font-medium">{schedule.staff_name}</h3>
              <p className="text-gray-600">{schedule.role} - {schedule.department}</p>
              <p className="text-sm mt-2">
                {new Date(schedule.shift_start).toLocaleTimeString()} - 
                {new Date(schedule.shift_end).toLocaleTimeString()}
              </p>
              <p className="text-sm">Status: {schedule.status}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;