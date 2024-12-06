import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { Personnel, Department } from '../types';
import PersonnelModal from '../components/PersonnelModal';
import DepartmentModal from '../components/DepartmentModal';
import DepartmentDetailsModal from '../components/DepartmentDetailsModal';
import ConfirmationModal from '../components/ConfirmationModal';
import LoadingSpinner from '../components/LoadingSpinner';

interface PersonnelPageProps {
  personnel: Personnel[];
  departments: Department[];
  loading?: boolean;
  error?: string | null;
}

const PersonnelPage = ({
  personnel,
  departments,
  loading = false,
  error = null
}: PersonnelPageProps) => {
  const [showPersonnelModal, setShowPersonnelModal] = useState(false);
  const [showDepartmentModal, setShowDepartmentModal] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [selectedPerson, setSelectedPerson] = useState<Personnel | null>(null);
  const [departmentToDelete, setDepartmentToDelete] = useState<Department | null>(null);
  const [showDepartmentDetails, setShowDepartmentDetails] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPersonnel = personnel.filter(person => {
    const searchLower = searchQuery.toLowerCase();
    const name = person.name?.toLowerCase() || '';
    const role = person.role?.toLowerCase() || '';
    
    return name.includes(searchLower) || role.includes(searchLower);
  });

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-50 p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Personnel Management</h1>
          <div className="flex space-x-3">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search personnel..."
                className="w-64 pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            </div>
            <button
              onClick={() => setShowDepartmentModal(true)}
              className="flex items-center space-x-2 bg-white text-gray-700 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
            >
              <Plus className="w-4 h-4" />
              <span>Add Department</span>
            </button>
            <button
              onClick={() => {
                setSelectedPerson(null);
                setShowPersonnelModal(true);
              }}
              className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
            >
              <Plus className="w-4 h-4" />
              <span>Add Personnel</span>
            </button>
          </div>
        </div>

        {/* Departments Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {departments.map((department) => {
            const departmentPersonnel = filteredPersonnel.filter(
              p => p.departmentId === department.id
            );
            return (
              <div
                key={department.id}
                onClick={() => {
                  setSelectedDepartment(department);
                  setShowDepartmentDetails(true);
                }}
                className="bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: department.color }}
                    />
                    <h3 className="font-medium text-gray-900">{department.name}</h3>
                  </div>
                  <span className="text-sm text-gray-500">
                    {departmentPersonnel.length} members
                  </span>
                </div>
                <p className="text-sm text-gray-500 line-clamp-2">
                  {department.description || 'No description provided'}
                </p>
              </div>
            );
          })}
        </div>

        {/* Personnel List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Personnel
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
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPersonnel.map((person) => {
                const department = departments.find(d => d.id === person.departmentId);
                return (
                  <tr
                    key={person.id}
                    onClick={() => {
                      setSelectedPerson(person);
                      setShowPersonnelModal(true);
                    }}
                    className="hover:bg-gray-50 cursor-pointer"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center overflow-hidden">
                          {person.profileImage ? (
                            <img
                              src={person.profileImage.url}
                              alt={person.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-indigo-600 font-medium">
                              {person.name.charAt(0)}
                            </span>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {person.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {person.role}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                        style={{
                          backgroundColor: `${department?.color}20`,
                          color: department?.color
                        }}
                      >
                        {department?.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {person.availability.start} - {person.availability.end}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showPersonnelModal && (
        <PersonnelModal
          departments={departments}
          onClose={() => {
            setShowPersonnelModal(false);
            setSelectedPerson(null);
          }}
          initialPerson={selectedPerson || undefined}
          mode={selectedPerson ? 'edit' : 'add'}
        />
      )}

      {showDepartmentModal && (
        <DepartmentModal
          onClose={() => {
            setShowDepartmentModal(false);
            setSelectedDepartment(null);
          }}
          initialDepartment={selectedDepartment || undefined}
          mode={selectedDepartment ? 'edit' : 'add'}
        />
      )}

      {showDepartmentDetails && selectedDepartment && (
        <DepartmentDetailsModal
          department={selectedDepartment}
          personnel={personnel}
          onClose={() => {
            setShowDepartmentDetails(false);
            setSelectedDepartment(null);
          }}
        />
      )}

      {departmentToDelete && (
        <ConfirmationModal
          title="Delete Department"
          message={`Are you sure you want to delete "${departmentToDelete.name}"? This action cannot be undone.`}
          onConfirm={() => {
            setDepartmentToDelete(null);
          }}
          onCancel={() => setDepartmentToDelete(null)}
        />
      )}
    </div>
  );
};

export default PersonnelPage;