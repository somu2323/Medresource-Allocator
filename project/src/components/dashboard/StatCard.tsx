import React from 'react';
import { cn } from '../../lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: {
    value: string | number;
    isPositive: boolean;
  };
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  change,
  className,
}) => {
  return (
    <div className={cn("bg-white rounded-lg shadow p-6", className)}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-3xl font-semibold mt-1">{value}</p>
          
          {change && (
            <div className="flex items-center mt-2">
              <span
                className={cn(
                  "text-xs font-medium",
                  change.isPositive ? "text-green-600" : "text-red-600"
                )}
              >
                {change.isPositive ? "+" : "-"}{change.value}
              </span>
              <span className="text-xs text-gray-500 ml-1">from last week</span>
            </div>
          )}
        </div>
        
        <div className="p-3 rounded-full bg-blue-50 text-blue-600">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;