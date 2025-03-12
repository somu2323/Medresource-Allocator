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
import EquipmentForm from '../components/equipment/EquipmentForm';
import { Equipment } from '../types';
import { getStatusColor, formatDate } from '../lib/utils';
import { equipmentApi } from '../lib/api';
import toast from 'react-hot-toast';

const EquipmentManagement: React.FC = () => {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [filteredEquipment, setFilteredEquipment] = useState<Equipment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const response = await equipmentApi.getAll();
        setEquipment(response.data);
        setFilteredEquipment(response.data);
      } catch (error) {
        console.error('Error fetching equipment:', error);
        toast.error('Failed to load equipment data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEquipment();
  }, []);

  useEffect(() => {
    // Apply filters
    let results = equipment;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(
        (item) =>
          item.name.toLowerCase().includes(term) ||
          item.location.toLowerCase().includes(term) ||
          (item.assigned_to && item.assigned_to.toLowerCase().includes(term))
      );
    }

    if (typeFilter) {
      results = results.filter((item) => item.type === typeFilter);
    }

    if (statusFilter) {
      results = results.filter((item) => item.status === statusFilter);
    }

    setFilteredEquipment(results);
  }, [equipment, searchTerm, typeFilter, statusFilter]);

  const handleAddEquipment = () => {
    setSelectedEquipment(null);
    setIsModalOpen(true);
  };

  const handleEditEquipment = (item: Equipment) => {
    setSelectedEquipment(item);
    setIsModalOpen(true);
  };

  const handleDeleteEquipment = (item: Equipment) => {
    setSelectedEquipment(item);
    setIsDeleteModalOpen(true);
  };

  const handleSubmit = async (data: Partial<Equipment>) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (selectedEquipment) {
        // Update existing equipment
        const updatedEquipment = equipment.map((item) =>
          item.id === selectedEquipment.id ? { ...item, ...data } : item
        );
        setEquipment(updatedEquipment);
        toast.success('Equipment updated successfully');
      } else {
        // Add new equipment
        const newEquipment: Equipment = {
          id: Math.random().toString(36).substring(2, 9),
          name: data.name!,
          type: data.type!,
          status: data.status as 'Available' | 'In Use' | 'Maintenance' | 'Reserved',
          location: data.location!,
          last_maintenance_date: data.last_maintenance_date,
          next_maintenance_date: data.next_maintenance_date,
          assigned_to: data.assigned_to,
          notes: data.notes,
        };
        setEquipment([...equipment, newEquipment]);
        toast.success('Equipment added successfully');
      }
      setIsModalOpen(false);
    } catch (error) {
      toast.error('An error occurred. Please try again.');
      console.error('Error submitting equipment data:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedEquipment) return;
    
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      const updatedEquipment = equipment.filter((item) => item.id !== selectedEquipment.id);
      setEquipment(updatedEquipment);
      setIsDeleteModalOpen(false);
      toast.success('Equipment deleted successfully');
    } catch (error) {
      toast.error('An error occurred. Please try again.');
      console.error('Error deleting equipment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const typeOptions = [
    { value: '', label: 'All Types' },
    { value: 'ventilator', label: 'Ventilator' },
    { value: 'monitor', label: 'Patient Monitor' },
    { value: 'infusion_pump', label: 'Infusion Pump' },
    { value: 'defibrillator', label: 'Defibrillator' },
    { value: 'ecg', label: 'ECG Machine' },
    { value: 'ultrasound', label: 'Ultrasound' },
    { value: 'xray', label: 'X-Ray Machine' },
    { value: 'mri', label: 'MRI Scanner' },
    { value: 'ct', label: 'CT Scanner' },
  ];

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'Available', label: 'Available' },
    { value: 'In Use', label: 'In Use' },
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
        <h1 className="text-2xl font-bold">Equipment Management</h1>
        <Button onClick={handleAddEquipment} icon={<Plus size={16} />}>
          Add New Equipment
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Equipment Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  placeholder="Search by name, location, or assignment..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <Select
                options={typeOptions}
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
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
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Last Maintenance</TableHead>
                  <TableHead>Next Maintenance</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEquipment.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                      No equipment found matching your criteria
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEquipment.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>
                        {typeOptions.find(option => option.value === item.type)?.label || item.type}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(item.status)}>
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {item.location === 'storage' ? 'Storage Room' : 
                         item.location === 'icu' ? 'Intensive Care Unit' : 
                         item.location === 'emergency' ? 'Emergency Department' : 
                         item.location === 'radiology' ? 'Radiology Department' : 
                         item.location === 'cardiology' ? 'Cardiology Department' : 
                         item.location === 'or' ? 'Operating Room' : 
                         item.location}
                      </TableCell>
                      <TableCell>{item.last_maintenance_date ? formatDate(item.last_maintenance_date) : '-'}</TableCell>
                      <TableCell>{item.next_maintenance_date ? formatDate(item.next_maintenance_date) : '-'}</TableCell>
                      <TableCell>{item.assigned_to || '-'}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditEquipment(item)}
                            className="p-1 text-blue-600 hover:text-blue-800"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteEquipment(item)}
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

      {/* Add/Edit Equipment Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedEquipment ? 'Edit Equipment' : 'Add New Equipment'}
        size="lg"
      >
        <EquipmentForm
          initialData={selectedEquipment || undefined}
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
            Are you sure you want to delete {selectedEquipment?.name}?
          </p>
          {selectedEquipment?.status === 'In Use' && (
            <p className="mt-2 text-red-600">
              Warning: This equipment is currently in use.
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

export default EquipmentManagement;