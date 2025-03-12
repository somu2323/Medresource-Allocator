import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Department } from '../../types';
import { Link } from 'react-router-dom';

interface DepartmentCardProps {
  department: Department;
}

const DepartmentCard: React.FC<DepartmentCardProps> = ({ department }) => {
  const occupancyRate = Math.round(
    ((department.beds_total - department.beds_available) / department.beds_total) * 100
  );
  
  // Determine color based on occupancy rate
  const getColorClass = () => {
    if (occupancyRate >= 90) return 'text-red-600';
    if (occupancyRate >= 75) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="bg-white rounded-lg shadow p-5">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-lg">{department.name}</h3>
          <p className="text-sm text-gray-500">Floor {department.floor}</p>
        </div>
        <span className={`font-bold text-lg ${getColorClass()}`}>
          {occupancyRate}%
        </span>
      </div>
      
      <div className="mt-4">
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className={`h-2.5 rounded-full ${
              occupancyRate >= 90 ? 'bg-red-600' : 
              occupancyRate >= 75 ? 'bg-yellow-500' : 
              'bg-green-600'
            }`}
            style={{ width: `${occupancyRate}%` }}
          ></div>
        </div>
        <div className="flex justify-between mt-1 text-xs text-gray-500">
          <span>Occupancy</span>
          <span>{department.beds_total - department.beds_available}/{department.beds_total} beds</span>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-100">
        <p className="text-sm">
          <span className="font-medium">Manager:</span> {department.manager}
        </p>
        <Link 
          to={`/beds?department=${department.id}`}
          className="mt-3 flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          View beds <ArrowRight size={16} className="ml-1" />
        </Link>
      </div>
    </div>
  );
};

export default DepartmentCard;