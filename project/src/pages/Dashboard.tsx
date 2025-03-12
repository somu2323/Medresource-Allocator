import React, { useState, useEffect } from 'react';
import { Bed, Users, Stethoscope, Clock } from 'lucide-react';
import StatCard from '../components/dashboard/StatCard';
import DepartmentCard from '../components/dashboard/DepartmentCard';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table';
import Badge from '../components/ui/Badge';
import { DashboardStats, Department, Bed as BedType, Staff } from '../types';
import { formatDate, getStatusColor } from '../lib/utils';
import { staffApi, bedsApi } from '../lib/api';

const Dashboard: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentBeds, setRecentBeds] = useState<BedType[]>([]);
  const [recentStaff, setRecentStaff] = useState<Staff[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [staffRes, bedsRes] = await Promise.all([
          staffApi.getAll(),
          bedsApi.getAll()
        ]);

        // Calculate stats from real data
        const stats: DashboardStats = {
          total_beds: bedsRes.data.length,
          available_beds: bedsRes.data.filter(bed => bed.status === 'Available').length,
          total_equipment: 0, // Will be updated when equipment API is ready
          available_equipment: 0, // Will be updated when equipment API is ready
          staff_on_duty: staffRes.data.filter(staff => staff.status === 'On Duty').length,
          departments: [
            // Will be updated when department API is ready
          ],
        };

        // Get recent beds (last 4 updated)
        const recentBeds = bedsRes.data.slice(0, 4);

        // Get recent staff (last 4 updated)
        const recentStaff = staffRes.data.slice(0, 4);

        setStats(stats);
        setRecentBeds(recentBeds);
        setRecentStaff(recentStaff);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Beds"
          value={stats?.total_beds || 0}
          icon={<Bed size={24} />}
          change={{ value: '5%', isPositive: true }}
        />
        <StatCard
          title="Available Beds"
          value={stats?.available_beds || 0}
          icon={<Bed size={24} />}
          change={{ value: '2%', isPositive: false }}
        />
        <StatCard
          title="Equipment Available"
          value={`${stats?.available_equipment || 0}/${stats?.total_equipment || 0}`}
          icon={<Stethoscope size={24} />}
          change={{ value: '3%', isPositive: true }}
        />
        <StatCard
          title="Staff On Duty"
          value={stats?.staff_on_duty || 0}
          icon={<Users size={24} />}
          change={{ value: '1%', isPositive: true }}
        />
      </div>

      {/* Department Overview */}
      <h2 className="text-xl font-semibold mt-8 mb-4">Department Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats?.departments.map((department) => (
          <DepartmentCard key={department.id} department={department} />
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* Recent Bed Changes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bed size={20} className="mr-2" />
              Recent Bed Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Room</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentBeds.map((bed) => (
                  <TableRow key={bed.id}>
                    <TableCell>{bed.room_number}-{bed.bed_number}</TableCell>
                    <TableCell>{bed.department}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(bed.status)}>
                        {bed.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(bed.admission_date || new Date().toISOString())}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Staff On Duty */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users size={20} className="mr-2" />
              Staff Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentStaff.map((staff) => (
                  <TableRow key={staff.id}>
                    <TableCell>{staff.name}</TableCell>
                    <TableCell>{staff.role}</TableCell>
                    <TableCell>{staff.department}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          staff.status === 'On Duty'
                            ? 'success'
                            : staff.status === 'Off Duty'
                            ? 'default'
                            : staff.status === 'On Leave'
                            ? 'warning'
                            : 'info'
                        }
                      >
                        {staff.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;