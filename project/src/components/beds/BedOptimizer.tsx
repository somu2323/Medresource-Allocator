import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../ui/Table';
import Badge from '../ui/Badge';
import { getStatusColor } from '../../lib/utils';
import { Bed } from '../../types';

interface OptimizationSuggestion {
  bedId: string;
  currentStatus: string;
  suggestion: string;
  priority: 'High' | 'Medium' | 'Low';
  reason: string;
}

const BedOptimizer: React.FC = () => {
  // This would typically come from an API or optimization algorithm
  const mockSuggestions: OptimizationSuggestion[] = [
    {
      bedId: 'ICU-101',
      currentStatus: 'Reserved',
      suggestion: 'Release reservation',
      priority: 'High',
      reason: 'No incoming ICU patients in next 24hrs'
    },
    {
      bedId: 'GW-203',
      currentStatus: 'Occupied',
      suggestion: 'Prepare for discharge',
      priority: 'Medium',
      reason: 'Patient ready for transfer to lower acuity'
    },
    {
      bedId: 'PED-105',
      currentStatus: 'Available',
      suggestion: 'Reserve for incoming',
      priority: 'High',
      reason: 'Expected pediatric emergency admission'
    }
  ];

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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bed Optimization Suggestions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bed ID</TableHead>
                <TableHead>Current Status</TableHead>
                <TableHead>Suggestion</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Reason</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockSuggestions.map((suggestion) => (
                <TableRow key={suggestion.bedId}>
                  <TableCell>{suggestion.bedId}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(suggestion.currentStatus)}>
                      {suggestion.currentStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>{suggestion.suggestion}</TableCell>
                  <TableCell>
                    <Badge className={getPriorityColor(suggestion.priority)}>
                      {suggestion.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>{suggestion.reason}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default BedOptimizer;