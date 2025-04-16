import React from 'react';

interface DepartmentUtilization {
  total: number;
  occupied: number;
  available: number;
}

interface BedAvailabilityProps {
  departmentUtilization: {
    [key: string]: DepartmentUtilization;
  };
}

const BedAvailability: React.FC<BedAvailabilityProps> = ({ departmentUtilization }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Bed Availability</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(departmentUtilization).map(([department, stats]) => (
          <div key={department} className="border rounded-lg p-4">
            <h3 className="text-lg font-medium mb-2">{department}</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Beds:</span>
                <span className="font-medium">{stats.total}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Occupied:</span>
                <span className="font-medium text-red-600">{stats.occupied}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Available:</span>
                <span className="font-medium text-green-600">{stats.available}</span>
              </div>
              <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600"
                  style={{
                    width: `${(stats.occupied / stats.total) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BedAvailability;