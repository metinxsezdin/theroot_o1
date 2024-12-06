import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Client } from '../types';
import { clientApi } from '../api/endpoints';
import { useApi } from '../hooks/useApi';
import LoadingSpinner from './LoadingSpinner';

interface ClientModalProps {
  onClose: () => void;
  onSuccess?: () => void;
  initialClient?: Client;
  mode?: 'add' | 'edit';
}

const ClientModal = ({ onClose, onSuccess, initialClient, mode = 'add' }: ClientModalProps) => {
  const [formData, setFormData] = useState({
    name: initialClient?.name || '',
    email: initialClient?.email || '',
    phone: initialClient?.phone || '',
    address: initialClient?.address || '',
    description: initialClient?.description || '',
    color: initialClient?.color || '#818cf8',
  });

  const { execute: saveClient, loading } = useApi(
    mode === 'add' ? clientApi.create : clientApi.update,
    {
      successMessage: `Client ${mode === 'add' ? 'created' : 'updated'} successfully`,
      onSuccess: () => {
        onSuccess?.();
        onClose();
      }
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (mode === 'add') {
        await saveClient(formData);
      } else if (initialClient) {
        await saveClient(initialClient.id, formData);
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
            {mode === 'add' ? 'Add New Client' : 'Edit Client'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Client Name
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
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, phone: e.target.value }))
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <textarea
                value={formData.address}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, address: e.target.value }))
                }
                rows={2}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, description: e.target.value }))
                }
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Color
              </label>
              <div className="mt-1 flex items-center space-x-2">
                <input
                  type="color"
                  value={formData.color}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, color: e.target.value }))
                  }
                  className="h-8 w-8 rounded-md border border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={formData.color}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, color: e.target.value }))
                  }
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  pattern="^#[0-9A-Fa-f]{6}$"
                  placeholder="#000000"
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
                mode === 'add' ? 'Add Client' : 'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClientModal;