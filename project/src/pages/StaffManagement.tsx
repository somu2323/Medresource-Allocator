import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Edit, Trash2 } from 'lucide-react';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from '../components/ui/Table';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import StaffForm from '../components/staff/StaffForm';
import { Staff } from '../types';
import { staffApi } from '../lib/api';
import toast from 'react-hot-toast';

const StaffManagement: React.FC = () => {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [filteredStaff, setFilteredStaff] = useState<Staff[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await staffApi.getAll();
        setStaff(response.data);
        setFilteredStaff(response.data);
      } catch (error) {
        console.error('Error fetching staff:', error);
        toast.error('Failed to load staff data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStaff();
  }, []);

  useEffect(() => {
    // Apply filters
    let results = staff;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(
        (person) =>
          person.name.toLowerCase().includes(term) ||
          person.email.toLowerCase().includes(term) ||
          person.contact.includes(term) ||
          (person.specialization && person.specialization.toLowerCase().includes(term))
      );
    }

    if (roleFilter) {
      results = results.filter((person) => person.role === roleFilter);
    }

    if (departmentFilter) {
      results = results.filter((person) => person.department === departmentFilter);
    }

    if (statusFilter) {
      results = results.filter((person) => person.status === statusFilter);
    }

    setFilteredStaff(results);
  }, [staff, searchTerm, roleFilter, departmentFilter, statusFilter]);

  const handleAddStaff = () => {
    setSelectedStaff(null);
    setIsModalOpen(true);
  };

  const handleEditStaff = (person: Staff) => {
    setSelectedStaff(person);
    setIsModalOpen(true);
  };

  const handleDeleteStaff = (person: Staff) => {
    setSelectedStaff(person);
    setIsDeleteModalOpen(true);
  };

  const handleSubmit = async (data: Partial<Staff>) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (selectedStaff) {
        // Update existing staff
        const updatedStaff = staff.map((person) =>
          person.id === selectedStaff.id ? { ...person, ...data } : person
        );
        setStaff(updatedStaff);
        toast.success('Staff member updated successfully');
      } else {
        // Add new staff
        const newStaff: Staff = {
          id: Math.random().toString(36).substring(2, 9),
          name: data.name!,
          role: data.role!,
          department: data.department!,
          contact: data.contact!,
          email: data.email!,
          status: data.status as 'On Duty' | 'Off Duty' | 'On Leave' | 'Training',
          specialization: data.specialization,
          notes: data.notes,
        };
        setStaff([...staff, newStaff]);
        toast.success('Staff member added successfully');
      }
      setIsModalOpen(false);
    } catch (error) {
      toast.error('An error occurred. Please try again.');
      console.error('Error submitting staff data:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedStaff) return;
    
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      const updatedStaff = staff.filter((person) => person.id !== selectedStaff.id);
      setStaff(updatedStaff);
      setIsDeleteModalOpen(false);
      toast.success('Staff member deleted successfully');
    } catch (error) {
      toast.error('An error occurred. Please try again.');
      console.error('Error deleting staff:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const roleOptions = [
    { value: '', label: 'All Roles' },
    { value: 'doctor', label: 'Doctor' },
    { value: 'nurse', label: 'Nurse' },
    { value: 'technician', label: 'Technician' },
    { value: 'receptionist', label: 'Receptionist' },
    { value: 'administrator', label: 'Administrator' },
    { value: 'janitor', label: 'Janitor' },
    { value: 'security', label: 'Security' },
  ];

  const departmentOptions = [
    { value: '', label: 'All Departments' },
    { value: 'cardiology', label: 'Cardiology' },
    { value: 'neurology', label: 'Neurology' },
    { value: 'pediatrics', label: 'Pediatrics' },
    { value: 'orthopedics', label: 'Orthopedics' },
    { value: 'oncology', label: 'Oncology' },
    { value: 'emergency', label: 'Emergency' },
    { value: 'icu', label: 'Intensive Care Unit' },
    { value: 'radiology', label: 'Radiology' },
    { value: 'administration', label: 'Administration' },
  ];

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'On Duty', label: 'On Duty' },
    { value: 'Off Duty', label: 'Off Duty' },
    { value: 'On Leave', label: 'On Leave' },
    { value: 'Training', label: 'Training' },
  ];

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
        <h1 className="text-2xl font-bold">Staff Management</h1>
        <Button onClick={handleAddStaff} icon={<Plus size={16} />}>
          Add Staff Member
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Staff Directory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  placeholder="Search by name, email, or contact..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <Select
                options={roleOptions}
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full md:w-40"
              />
              <Select
                options={departmentOptions}
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="w-full md:w-48"
              />
              <Select
                options={statusOptions}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full md:w-40"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Specialization</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStaff.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                      No staff members found matching your criteria
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredStaff.map((person) => (
                    <TableRow key={person.id}>
                      <TableCell className="font-medium">{person.name}</TableCell>
                      <TableCell>
                        {person.role === 'doctor' ? 'Doctor' :
                         person.role === 'nurse' ? 'Nurse' :
                         person.role === 'technician' ? 'Technician' :
                         person.role === 'receptionist' ? 'Receptionist' :
                         person.role === 'administrator' ? 'Administrator' :
                         person.role === 'janitor' ? 'Janitor' :
                         person.role === 'security' ? 'Security' :
                         person.role}
                      </TableCell>
                      <TableCell>
                        {person.department === 'cardiology' ? 'Cardiology' :
                         person.department === 'neurology' ? 'Neurology' :
                         person.department === 'pediatrics' ? 'Pediatrics' :
                         person.department === 'orthopedics' ? 'Orthopedics' :
                         person.department === 'oncology' ? 'Oncology' :
                         person.department === 'emergency' ? 'Emergency' :
                         person.department === 'icu' ? 'Intensive Care Unit' :
                         person.department === 'radiology' ? 'Radiology' :
                         person.department === 'administration' ? 'Administration' :
                         person.department}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            person.status === 'On Duty'
                              ? 'success'
                              : person.status === 'Off Duty'
                              ? 'default'
                              : person.status === 'On Leave'
                              ? 'warning'
                              : 'info'
                          }
                        >
                          {person.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{person.contact}</TableCell>
                      <TableCell>{person.email}</TableCell>
                      <TableCell>{person.specialization || '-'}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditStaff(person)}
                            className="p-1 text-blue-600 hover:text-blue-800"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteStaff(person)}
                            className="p-1 text-red-600 hover:text-red-800"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Staff Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedStaff ? 'Edit Staff Member' : 'Add Staff Member'}
        size="lg"
      >
        <StaffForm
          initialData={selectedStaff || undefined}
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
          isLoading={isSubmitting}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Deletion"
        size="sm"
      >
        <div className="py-4">
          <p>
            Are you sure you want to delete {selectedStaff?.name}?
          </p>
          {selectedStaff?.status === 'On Duty' && (
            <p className="mt-2 text-red-600">
              Warning: This staff member is currently on duty.
            </p>
          )}
        </div>
        <div className="flex justify-end space-x-3 pt-4">
          <Button
            variant="outline"
            onClick={() => setIsDeleteModalOpen(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleConfirmDelete}
            isLoading={isSubmitting}
          >
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default StaffManagement;