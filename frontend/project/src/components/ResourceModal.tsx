import React, { useState } from 'react';
import { Resource, Department } from '../types';
import { X } from 'lucide-react';

interface ResourceModalProps {
  departments: Department[];
  onClose: () => void;
  onSave: (resource: Omit<Resource, 'id'>) => void;
  initialResource?: Resource;
  mode?: 'add' | 'edit';
}

const ResourceModal = ({ departments, onClose, onSave, initialResource, mode = 'add' }: ResourceModalProps) => {
  const [formData, setFormData] = useState({
    name: initialResource?.name || '',
    role: initialResource?.role || '',
    departmentId: initialResource?.departmentId || departments[0]?.id || '',
    availability: {
      start: initialResource?.availability.start || '09:00',
      end: initialResource?.availability.end || '17:00',
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {mode === 'add' ? 'Yeni Kaynak Ekle' : 'Kaynağı Düzenle'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                İsim
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Rol
              </label>
              <input
                type="text"
                value={formData.role}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, role: e.target.value }))
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Departman
              </label>
              <select
                value={formData.departmentId}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, departmentId: e.target.value }))
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                {departments.map((department) => (
                  <option key={department.id} value={department.id}>
                    {department.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Başlangıç Saati
                </label>
                <input
                  type="time"
                  value={formData.availability.start}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      availability: { ...prev.availability, start: e.target.value },
                    }))
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Bitiş Saati
                </label>
                <input
                  type="time"
                  value={formData.availability.end}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      availability: { ...prev.availability, end: e.target.value },
                    }))
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              İptal
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
            >
              {mode === 'add' ? 'Kaynak Ekle' : 'Değişiklikleri Kaydet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResourceModal;