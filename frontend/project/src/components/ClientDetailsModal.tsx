import React, { useState } from 'react';
import { X, Plus, Pencil, Trash2, Users } from 'lucide-react';
import { Client, ClientEmployee } from '../types';
import ClientEmployeeModal from './ClientEmployeeModal';
import ConfirmationModal from './ConfirmationModal';

interface ClientDetailsModalProps {
  client: Client;
  onClose: () => void;
  onUpdateClient: (id: string, updates: Partial<Client>) => void;
}

const ClientDetailsModal = ({ client, onClose, onUpdateClient }: ClientDetailsModalProps) => {
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<ClientEmployee | null>(null);
  const [employeeToDelete, setEmployeeToDelete] = useState<ClientEmployee | null>(null);

  const handleAddEmployee = (employee: ClientEmployee) => {
    const currentEmployees = client.employees || [];
    onUpdateClient(client.id, {
      employees: [...currentEmployees, employee]
    });
  };

  const handleUpdateEmployee = (updatedEmployee: ClientEmployee) => {
    const currentEmployees = client.employees || [];
    onUpdateClient(client.id, {
      employees: currentEmployees.map(emp => 
        emp.id === updatedEmployee.id ? updatedEmployee : emp
      )
    });
  };

  const handleDeleteEmployee = () => {
    if (!employeeToDelete) return;
    
    const currentEmployees = client.employees || [];
    onUpdateClient(client.id, {
      employees: currentEmployees.filter(emp => emp.id !== employeeToDelete.id)
    });
    setEmployeeToDelete(null);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${client.color}20`, color: client.color }}
            >
              <span className="text-lg font-semibold">{client.name.charAt(0)}</span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{client.name}</h2>
              <p className="text-sm text-gray-500">{client.email}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Müşteri Bilgileri</h3>
              <div className="space-y-3">
                <p className="text-sm">
                  <span className="font-medium text-gray-700">Telefon:</span>{' '}
                  {client.phone || 'Belirtilmemiş'}
                </p>
                <p className="text-sm">
                  <span className="font-medium text-gray-700">Adres:</span>{' '}
                  {client.address || 'Belirtilmemiş'}
                </p>
                <p className="text-sm">
                  <span className="font-medium text-gray-700">Açıklama:</span>{' '}
                  {client.description || 'Belirtilmemiş'}
                </p>
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Çalışanlar</h3>
                <button
                  onClick={() => {
                    setSelectedEmployee(null);
                    setShowEmployeeModal(true);
                  }}
                  className="flex items-center space-x-2 text-sm text-indigo-600 hover:text-indigo-700"
                >
                  <Plus className="w-4 h-4" />
                  <span>Çalışan Ekle</span>
                </button>
              </div>
              
              <div className="space-y-3">
                {client.employees?.map(employee => (
                  <div
                    key={employee.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <div className="font-medium text-gray-900">{employee.name}</div>
                      <div className="text-sm text-gray-500">{employee.role}</div>
                      {employee.department && (
                        <div className="text-xs text-gray-500">{employee.department}</div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedEmployee(employee);
                          setShowEmployeeModal(true);
                        }}
                        className="p-1 text-gray-500 hover:text-gray-700"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setEmployeeToDelete(employee)}
                        className="p-1 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
                {(!client.employees || client.employees.length === 0) && (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Henüz çalışan eklenmemiş</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showEmployeeModal && (
        <ClientEmployeeModal
          onClose={() => {
            setShowEmployeeModal(false);
            setSelectedEmployee(null);
          }}
          onSave={selectedEmployee ? handleUpdateEmployee : handleAddEmployee}
          initialEmployee={selectedEmployee || undefined}
          mode={selectedEmployee ? 'edit' : 'add'}
        />
      )}

      {employeeToDelete && (
        <ConfirmationModal
          title="Çalışanı Sil"
          message={`"${employeeToDelete.name}" çalışanını silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`}
          onConfirm={handleDeleteEmployee}
          onCancel={() => setEmployeeToDelete(null)}
        />
      )}
    </div>
  );
};

export default ClientDetailsModal;