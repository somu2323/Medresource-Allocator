import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { bedsApi } from '../lib/api';
import { Bed } from '../types';
import { getStatusColor } from '../lib/utils';
import toast from 'react-hot-toast';

interface OptimizationResult {
  utilizationRate: number;
  bedAssignments: Array<{
    bedId: string;
    priority: number;
    expectedStayDuration: number;
  }>;
}

const optimizeBedAllocation = (input: {
  beds: Bed[];
  waitingListCount: number;
  departmentCapacities: Record<string, number>;
}): OptimizationResult => {
  // Simple optimization logic
  const availableBeds = input.beds.filter(bed => bed.status === 'Available');
  
  return {
    utilizationRate: ((input.beds.length - availableBeds.length) / input.beds.length) * 100,
    bedAssignments: availableBeds.slice(0, input.waitingListCount).map((bed, index) => ({
      bedId: bed.id,
      priority: Math.floor(Math.random() * 3) + 1, // Random priority 1-3
      expectedStayDuration: Math.floor(Math.random() * 7) + 1 // Random 1-7 days
    }))
  };
};


const BedOptimizer: React.FC = () => {
  const [beds, setBeds] = useState<Bed[]>([]);
  const [optimizationSuggestions, setOptimizationSuggestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [waitingListCount, setWaitingListCount] = useState(0);
  const [optimizationResults, setOptimizationResults] = useState<OptimizationResult | null>(null);

  useEffect(() => {
    fetchBeds();
  }, []);

  const fetchBeds = async () => {
    setIsLoading(true);
    try {
      const response = await bedsApi.getAll();
      const bedsWithMappedIds = response.data.map(bed => ({
        ...bed,
        id: bed._id
      }));
      setBeds(bedsWithMappedIds);
      generateOptimizationSuggestions(bedsWithMappedIds);
      
      // Simulate waiting list count - replace with actual API call
      setWaitingListCount(10);
      
      // Generate bed allocation optimization
      const departmentCapacities = bedsWithMappedIds.reduce((acc, bed) => {
        acc[bed.department] = (acc[bed.department] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const optimizationInput = {
        beds: bedsWithMappedIds,
        waitingListCount: 10,
        departmentCapacities
      };

      const results = optimizeBedAllocation(optimizationInput);
      setOptimizationResults(results);
    } catch (error) {
      toast.error('Failed to load beds. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const generateOptimizationSuggestions = (beds: Bed[]) => {
    const suggestions = [];

    // Check for departments with high occupancy
    const departmentOccupancy = beds.reduce((acc, bed) => {
      acc[bed.department] = acc[bed.department] || { total: 0, occupied: 0 };
      acc[bed.department].total++;
      if (bed.status === 'Occupied') acc[bed.department].occupied++;
      return acc;
    }, {} as Record<string, { total: number; occupied: number }>);

    for (const [department, stats] of Object.entries(departmentOccupancy)) {
      const occupancyRate = (stats.occupied / stats.total) * 100;
      if (occupancyRate > 80) {
        suggestions.push({
          type: 'High Occupancy',
          department,
          message: `${department} is at ${occupancyRate.toFixed(1)}% capacity. Consider redistributing patients or adding more beds.`,
          priority: 'High'
        });
      }
    }

    // Check for maintenance scheduling optimization
    const maintenanceBeds = beds.filter(bed => bed.status === 'Maintenance');
    if (maintenanceBeds.length > beds.length * 0.1) {
      suggestions.push({
        type: 'Maintenance Scheduling',
        message: `${maintenanceBeds.length} beds are under maintenance. Consider staggering maintenance schedules.`,
        priority: 'Medium'
      });
    }

    // Check for discharge date optimization
    const today = new Date();
    const bedsWithOverdueDischarge = beds.filter(bed => {
      if (bed.expected_discharge_date) {
        const dischargeDate = new Date(bed.expected_discharge_date);
        return dischargeDate < today && bed.status === 'Occupied';
      }
      return false;
    });

    if (bedsWithOverdueDischarge.length > 0) {
      suggestions.push({
        type: 'Discharge Management',
        message: `${bedsWithOverdueDischarge.length} patients have passed their expected discharge date.`,
        priority: 'High'
      });
    }

    setOptimizationSuggestions(suggestions);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold">Bed Optimizer</h1>
        <div className="flex items-center gap-4">
          <Badge className="bg-blue-100 text-blue-800">
            Waiting List: {waitingListCount}
          </Badge>
          <Badge className="bg-purple-100 text-purple-800">
            Utilization Rate: {optimizationResults?.utilizationRate.toFixed(1)}%
          </Badge>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recommended Bed Assignments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Bed ID</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Expected Stay</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {optimizationResults?.bedAssignments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                      No bed assignments available
                    </TableCell>
                  </TableRow>
                ) : (
                  optimizationResults?.bedAssignments.map((assignment) => {
                    const bed = beds.find(b => b.id === assignment.bedId);
                    return (
                      <TableRow key={assignment.bedId}>
                        <TableCell>{assignment.bedId}</TableCell>
                        <TableCell>{bed?.department}</TableCell>
                        <TableCell>
                          <Badge className={getPriorityColor(assignment.priority >= 3 ? 'High' : assignment.priority >= 2 ? 'Medium' : 'Low')}>
                            {assignment.priority >= 3 ? 'High' : assignment.priority >= 2 ? 'Medium' : 'Low'}
                          </Badge>
                        </TableCell>
                        <TableCell>{assignment.expectedStayDuration} days</TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Optimization Suggestions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Priority</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {optimizationSuggestions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8 text-gray-500">
                      No optimization suggestions available
                    </TableCell>
                  </TableRow>
                ) : (
                  optimizationSuggestions.map((suggestion, index) => (
                    <TableRow key={index}>
                      <TableCell>{suggestion.type}</TableCell>
                      <TableCell>{suggestion.message}</TableCell>
                      <TableCell>
                        <Badge className={getPriorityColor(suggestion.priority)}>
                          {suggestion.priority}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Department Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(beds.reduce((acc, bed) => {
              acc[bed.department] = acc[bed.department] || { total: 0, occupied: 0 };
              acc[bed.department].total++;
              if (bed.status === 'Occupied') acc[bed.department].occupied++;
              return acc;
            }, {} as Record<string, { total: number; occupied: number }>)).map(([department, stats]) => (
              <div key={department} className="p-4 border rounded-lg">
                <h3 className="font-semibold text-lg">{department}</h3>
                <div className="mt-2 space-y-1">
                  <p>Total Beds: {stats.total}</p>
                  <p>Occupied: {stats.occupied}</p>
                  <p>Occupancy Rate: {((stats.occupied / stats.total) * 100).toFixed(1)}%</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BedOptimizer;