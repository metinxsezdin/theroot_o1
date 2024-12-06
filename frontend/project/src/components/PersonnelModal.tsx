import React, { useState, useRef } from 'react';
import { X, Upload, Trash2 } from 'lucide-react';
import { Personnel, Department } from '../types';
import { personnelApi } from '../api/endpoints';
import { useApi } from '../hooks/useApi';
import LoadingSpinner from './LoadingSpinner';

interface PersonnelModalProps {
  departments: Department[];
  onClose: () => void;
  onSuccess?: () => void;
  initialPerson?: Personnel;
  mode?: 'add' | 'edit';
}

const PersonnelModal = ({ departments, onClose, onSuccess, initialPerson, mode = 'add' }: PersonnelModalProps) => {
  const [formData, setFormData] = useState({
    name: initialPerson?.name || '',
    role: initialPerson?.role || '',
    profileImage: initialPerson?.profileImage,
    departmentId: initialPerson?.departmentId || departments[0]?.id || '',
    availability: {
      start: initialPerson?.availability.start || '09:00',
      end: initialPerson?.availability.end || '17:00',
    },
  });
  
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(initialPerson?.profileImage?.url);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { execute: savePersonnel, loading } = useApi(
    mode === 'add' ? personnelApi.create : personnelApi.update,
    {
      successMessage: `Personnel ${mode === 'add' ? 'created' : 'updated'} successfully`,
      onSuccess: () => {
        onSuccess?.();
        onClose();
      }
    }
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const url = reader.result as string;
        setPreviewUrl(url);
        setFormData(prev => ({
          ...prev,
          profileImage: {
            url,
            name: file.name
          }
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setPreviewUrl(undefined);
    setFormData(prev => ({
      ...prev,
      profileImage: undefined
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (mode === 'add') {
        await savePersonnel(formData);
      } else if (initialPerson) {
        await savePersonnel(initialPerson.id, formData);
      }
    } catch (error) {
      // Error handling is managed by useApi hook
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {mode === 'add' ? 'Add New Personnel' : 'Edit Personnel'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profile Image
              </label>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl text-gray-400">
                        {formData.name.charAt(0)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col space-y-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload Image</span>
                  </button>
                  {previewUrl && (
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="flex items-center space-x-2 px-3 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Remove Image</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
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
                Role
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
                Department
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
                  Start Time
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
                  End Time
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
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? (
                <LoadingSpinner size="sm" className="mx-6" />
              ) : (
                mode === 'add' ? 'Add Personnel' : 'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PersonnelModal;