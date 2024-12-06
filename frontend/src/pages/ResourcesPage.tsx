import React, { useState } from 'react';
import { Plus, Pencil, Trash2, Users, Search } from 'lucide-react';
import ResourceModal from '../components/ResourceModal';
import DepartmentModal from '../components/DepartmentModal';
import DepartmentDetailsModal from '../components/DepartmentDetailsModal';
import ConfirmationModal from '../components/ConfirmationModal';
import { Resource, Department } from '../types';
import { formatTime } from '../utils/timeUtils';

interface ResourcesPageProps {
  resources: Resource[];
  departments: Department[];
  onAddResource: (resource: Omit<Resource, 'id'>) => void;
  onDeleteResource: (id: string) => void;
  onUpdateResource: (id: string, updates: Partial<Resource>) => void;
  onAddDepartment: (department: Omit<Department, 'id'>) => void;
  onUpdateDepartment: (id: string, updates: Partial<Department>) => void;
  onDeleteDepartment: (id: string) => void;
}

const ResourcesPage = ({
  resources,
  departments,
  onAddResource,
  onDeleteResource,
  onUpdateResource,
  onAddDepartment,
  onUpdateDepartment,
  onDeleteDepartment,
}: ResourcesPageProps) => {
  const [showResourceModal, setShowResourceModal] = useState(false);
  const [showDepartmentModal, setShowDepartmentModal] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [departmentToDelete, setDepartmentToDelete] = useState<Department | null>(null);
  const [showDepartmentDetails, setShowDepartmentDetails] = useState(false);
  const [resourceToDelete, setResourceToDelete] = useState<Resource | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleEditDepartment = (department: Department) => {
    setSelectedDepartment(department);
    setShowDepartmentModal(true);
  };

  const handleEditResource = (resource: Resource) => {
    setSelectedResource(resource);
    setShowResourceModal(true);
  };

  const handleSaveDepartment = (departmentData: Omit<Department, 'id'>) => {
    if (selectedDepartment) {
      onUpdateDepartment(selectedDepartment.id, departmentData);
    } else {
      onAddDepartment(departmentData);
    }
  };

  const handleSaveResource = (resourceData: Omit<Resource, 'id'>) => {
    if (selectedResource) {
      onUpdateResource(selectedResource.id, resourceData);
    } else {
      onAddResource(resourceData);
    }
  };

  const handleDeleteDepartment = (department: Department) => {
    const hasResources = resources.some(r => r.departmentId === department.id);
    if (hasResources) {
      alert('Cannot delete department with assigned resources');
      return;
    }
    setDepartmentToDelete(department);
  };

  const handleConfirmDeleteDepartment = () => {
    if (departmentToDelete) {
      onDeleteDepartment(departmentToDelete.id);
      setDepartmentToDelete(null);
    }
  };

  const handleConfirmDeleteResource = () => {
    if (resourceToDelete) {
      onDeleteResource(resourceToDelete.id);
      setResourceToDelete(null);
    }
  };

  const filteredResources = resources.filter(resource =>
    resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resource.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 bg-gray-50 p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Resources</h1>
          <div className="flex space-x-3">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Kaynak ara..."
                className="w-64 pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            </div>
            <button
              onClick={() => setShowDepartmentModal(true)}
              className="flex items-center space-x-2 bg-white text-gray-700 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
            >
              <Users className="w-4 h-4" />
              <span>Add Department</span>
            </button>
            <button
              onClick={() => {
                setSelectedResource(null);
                setShowResourceModal(true);
              }}
              className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
            >
              <Plus className="w-4 h-4" />
              <span>Add Resource</span>
            </button>
          </div>
        </div>

        {/* Departments Section */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Departments</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {departments.map((department) => (
              <div
                key={department.id}
                onClick={() => {
                  setSelectedDepartment(department);
                  setShowDepartmentDetails(true);
                }}
                className="bg-white rounded-lg shadow p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: department.color }}
                    />
                    <h3 className="font-medium text-gray-900">{department.name}</h3>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEditDepartment(department)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteDepartment(department)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-500">{department.description}</p>
                <div className="mt-2 text-sm text-gray-600">
                  {resources.filter(r => r.departmentId === department.id).length} members
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Resources Table */}
        <div className="bg-white rounded-lg shadow">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Availability
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredResources.map((resource) => {
                  const department = departments.find(
                    (d) => d.id === resource.departmentId
                  );
                  return (
                    <tr key={resource.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                            <span className="text-indigo-600 font-medium">
                              {resource.name.charAt(0)}
                            </span>
                          </div>
                          <div className="text-sm font-medium text-gray-900">
                            {resource.name}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {resource.role}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                          style={{ backgroundColor: `${department?.color}20`, color: department?.color }}
                        >
                          {department?.name}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatTime(resource.availability.start)} -{' '}
                        {formatTime(resource.availability.end)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEditResource(resource)}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setResourceToDelete(resource)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showResourceModal && (
        <ResourceModal
          departments={departments}
          onClose={() => {
            setShowResourceModal(false);
            setSelectedResource(null);
          }}
          onSave={handleSaveResource}
          initialResource={selectedResource || undefined}
          mode={selectedResource ? 'edit' : 'add'}
        />
      )}

      {showDepartmentModal && (
        <DepartmentModal
          onClose={() => {
            setShowDepartmentModal(false);
            setSelectedDepartment(null);
          }}
          onSave={handleSaveDepartment}
          initialDepartment={selectedDepartment || undefined}
          mode={selectedDepartment ? 'edit' : 'add'}
        />
      )}

      {showDepartmentDetails && selectedDepartment && (
        <DepartmentDetailsModal
          department={selectedDepartment}
          resources={resources}
          onClose={() => {
            setShowDepartmentDetails(false);
            setSelectedDepartment(null);
          }}
          onUpdateDepartment={onUpdateDepartment}
          onAddResource={onAddResource}
          onUpdateResource={onUpdateResource}
          onDeleteResource={onDeleteResource}
        />
      )}

      {departmentToDelete && (
        <ConfirmationModal
          title="Delete Department"
          message={`Are you sure you want to delete "${departmentToDelete.name}"? This action cannot be undone.`}
          onConfirm={handleConfirmDeleteDepartment}
          onCancel={() => setDepartmentToDelete(null)}
        />
      )}

      {resourceToDelete && (
        <ConfirmationModal
          title="Delete Resource"
          message={`Are you sure you want to delete "${resourceToDelete.name}"? This action cannot be undone.`}
          onConfirm={handleConfirmDeleteResource}
          onCancel={() => setResourceToDelete(null)}
        />
      )}
    </div>
  );
};

export default ResourcesPage;