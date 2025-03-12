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
import BedForm from '../components/beds/BedForm';
import { Bed } from '../types';
import { getStatusColor } from '../lib/utils';
import { bedsApi } from '../lib/api';
import toast from 'react-hot-toast';

const BedManagement: React.FC = () => {
  const [beds, setBeds] = useState<Bed[]>([]);
  const [filteredBeds, setFilteredBeds] = useState<Bed[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedBed, setSelectedBed] = useState<Bed | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

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
      setFilteredBeds(bedsWithMappedIds);
    } catch (error) {
      //console.error('Error fetching beds:', error);
      //toast.error('Failed to load beds. Please try again.');
      
      toast.error('Failed to load beds. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Apply filters
    let results = beds;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(
        (bed) =>
          bed.room_number.toLowerCase().includes(term) ||
          bed.bed_number.toLowerCase().includes(term) ||
          (bed.patient_name && bed.patient_name.toLowerCase().includes(term)) ||
          (bed.patient_id && bed.patient_id.toLowerCase().includes(term))
      );
    }

    if (departmentFilter) {
      results = results.filter((bed) => bed.department === departmentFilter);
    }

    if (statusFilter) {
      results = results.filter((bed) => bed.status === statusFilter);
    }

    setFilteredBeds(results);
  }, [beds, searchTerm, departmentFilter, statusFilter]);

  const handleAddBed = () => {
    setSelectedBed(null);
    setIsModalOpen(true);
  };

  const handleEditBed = (bed: Bed) => {
    setSelectedBed(bed);
    setIsModalOpen(true);
  };

  const handleDeleteBed = (bed: Bed) => {
    setSelectedBed(bed);
    setIsDeleteModalOpen(true);
  };

  const handleSubmit = async (data: Partial<Bed>) => {
    setIsSubmitting(true);
    setError('');
    try {
      if (selectedBed) {
        // Update existing bed - use _id instead of id
        const response = await bedsApi.update(selectedBed._id, data);
        const updatedBeds = beds.map((bed) =>
          bed.id === selectedBed.id ? { ...response.data, id: response.data._id } : bed
        );
        setBeds(updatedBeds);
        toast.success('Bed updated successfully');
        setIsModalOpen(false);
      } else {
        // Add new bed
        const response = await bedsApi.create(data);
        setBeds([...beds, { ...response.data, id: response.data._id }]);
        toast.success('Bed added successfully');
        setIsModalOpen(false);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'An error occurred. Please try again.';
      console.error('Error submitting bed data:', error);
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedBed || !selectedBed.id) {
      toast.error('Invalid bed selected');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await bedsApi.delete(selectedBed.id);
      const updatedBeds = beds.filter((bed) => bed.id !== selectedBed.id);
      setBeds(updatedBeds);
      setIsDeleteModalOpen(false);
      toast.success('Bed deleted successfully');
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'An error occurred. Please try again.';
      console.error('Error deleting bed:', error);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const departmentOptions = [
    { value: '', label: 'All Departments' },
    { value: 'General Ward', label: 'General Ward' },
    { value: 'Cardiology', label: 'Cardiology' },
    { value: 'Neurology', label: 'Neurology' },
    { value: 'Pediatrics', label: 'Pediatrics' },
    { value: 'Orthopedics', label: 'Orthopedics' },
    { value: 'ICU', label: 'ICU' },
  ];

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'Available', label: 'Available' },
    { value: 'Occupied', label: 'Occupied' },
    { value: 'Maintenance', label: 'Maintenance' },
    { value: 'Reserved', label: 'Reserved' },
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
        <h1 className="text-2xl font-bold">Bed Management</h1>
        <Button onClick={handleAddBed} icon={<Plus size={16} />}>
          Add New Bed
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Bed Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  placeholder="Search by room, bed, or patient..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-4">
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
                className="w-full md:w-48"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Room</TableHead>
                  <TableHead>Bed</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Admission Date</TableHead>
                  <TableHead>Expected Discharge</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBeds.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                      No beds found matching your criteria
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredBeds.map((bed) => (
                    <TableRow key={bed.id}>
                      <TableCell>{bed.room_number}</TableCell>
                      <TableCell>{bed.bed_number}</TableCell>
                      <TableCell>{bed.department}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(bed.status)}>
                          {bed.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{bed.patient_name || '-'}</TableCell>
                      <TableCell>{bed.admission_date || '-'}</TableCell>
                      <TableCell>{bed.expected_discharge_date || '-'}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditBed(bed)}
                            className="p-1 text-blue-600 hover:text-blue-800"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteBed(bed)}
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

      {/* Add/Edit Bed Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedBed ? 'Edit Bed' : 'Add New Bed'}
        size="lg"
      >
        <BedForm
          initialData={selectedBed || undefined}
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
          isLoading={isSubmitting}
          error={error}
          setError={setError}
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
            Are you sure you want to delete bed {selectedBed?.room_number}-
            {selectedBed?.bed_number} in {selectedBed?.department}?
          </p>
          {selectedBed?.status === 'Occupied' && (
            <p className="mt-2 text-red-600">
              Warning: This bed is currently occupied by a patient.
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

export default BedManagement;