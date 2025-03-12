import React from 'react';
import BedOptimizer from '../components/beds/BedOptimizer';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';

const BedOptimizerPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold">Bed Optimizer</h1>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            The Bed Optimizer helps you maximize bed utilization by providing smart suggestions 
            based on current occupancy, expected admissions, and department requirements. 
            Review the suggestions below to optimize your bed allocation.
          </p>
        </CardContent>
      </Card>

      <BedOptimizer />
    </div>
  );
};

export default BedOptimizerPage;