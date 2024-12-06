import React, { useState } from 'react';
import { X, Users, Plus, Trash2 } from 'lucide-react';
import { Department, Personnel } from '../types';
import PersonnelModal from './PersonnelModal';
import ConfirmationModal from './ConfirmationModal';

interface DepartmentDetailsModalProps {
  department: Department;
  personnel: Personnel[];
  onClose: () => void;
  onUpdateDepartment: (id: string, updates: Partial<Department>) => void;
  onAddPersonnel: (person: Omit<Personnel, 'id'>) => void;
  onUpdatePersonnel: (id: string, updates: Partial<Personnel>) => void;
  onDeletePersonnel: (id: string) => void;
}

const DepartmentDetailsModal = ({
  department,
  personnel,
  onClose,
  onUpdateDepartment,
  onAddPersonnel,
  onUpdatePersonnel,
  onDeletePersonnel
}: DepartmentDetailsModalProps) => {
  const [showPersonnelModal, setShowPersonnelModal] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Personnel | null>(null);
  const [personToDelete, setPersonToDelete] = useState<Personnel | null>(null);

  const departmentPersonnel = personnel.filter(p => p.departmentId === department.id);

  const handleEditPerson = (person: Personnel) => {
    setSelectedPerson(person);
    setShowPersonnelModal(true);
  };

  const handleSavePerson = (personData: Omit<Personnel, 'id'>) => {
    if (selectedPerson) {
      onUpdateDepartment?.(selectedDepartment.id, departmentData);
    } else {
      onAddDepartment?.(departmentData);
    }
    setShowPersonnelModal(false);
    setSelectedPerson(null);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${department.color}20`, color: department.color }}
            >
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{department.name}</h2>
              <p className="text-sm text-gray-500">{department.description}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Personnel</h3>
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

          <div className="grid grid-cols-1 gap-4">
            {departmentPersonnel.map((person) => (
              <div
                key={person.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                    <span className="text-indigo-600 font-medium">
                      {person.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{person.name}</div>
                    <div className="text-sm text-gray-500">{person.role}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleEditPerson(person)}
                    className="text-sm text-indigo-600 hover:text-indigo-700"
                  >
                    Düzenle
                  </button>
                  <button
                    onClick={() => setPersonToDelete(person)}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
            {departmentPersonnel.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No personnel in this department yet
              </div>
            )}
          </div>
        </div>
      </div>

      {showPersonnelModal && (
        <PersonnelModal
          departments={[department]}
          onClose={() => {
            setShowPersonnelModal(false);
            setSelectedPerson(null);
          }}
          onSave={handleSavePerson}
          initialPerson={selectedPerson || undefined}
          mode={selectedPerson ? 'edit' : 'add'}
        />
      )}

      {personToDelete && (
        <ConfirmationModal
          title="Delete Personnel"
          message={`Are you sure you want to delete "${personToDelete.name}"? This action cannot be undone.`}
          onConfirm={() => {
            onDeletePersonnel(personToDelete.id);
            setPersonToDelete(null);
          }}
          onCancel={() => setPersonToDelete(null)}
        />
      )}
    </div>
  );
};

export default DepartmentDetailsModal;