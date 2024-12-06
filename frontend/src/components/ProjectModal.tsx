import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { Personnel, Project, Client } from '../types';
import { generateColor } from '../utils/helpers';
import ResourceSelectionModal from './ResourceSelectionModal';
import ClientModal from './ClientModal';
import { useActivities } from '../hooks/useActivities';
import LoadingSpinner from './LoadingSpinner';

interface ProjectModalProps {
  onClose: () => void;
  onSuccess?: () => void;
  resources: Personnel[];
  clients: Client[];
  initialProject?: Project;
  mode?: 'add' | 'edit';
}

const ProjectModal = ({
  onClose,
  onSuccess,
  resources,
  clients,
  initialProject,
  mode = 'add',
}: ProjectModalProps) => {
  const [formData, setFormData] = useState({
    name: initialProject?.name || '',
    clientName: initialProject?.clientName || clients[0]?.name || '',
    startDate: initialProject?.startDate || '',
    endDate: initialProject?.endDate || '',
    billable: initialProject?.billable || false,
    activityTypes: initialProject?.activityTypes || [],
    description: initialProject?.description || '',
    budget: initialProject?.budget?.toString() || '',
    status: initialProject?.status || ('active' as const),
  });

  const [showResourceModal, setShowResourceModal] = useState(false);
  const [selectedResources, setSelectedResources] = useState<Personnel[]>(
    initialProject?.personnel || []
  );
  const [showClientModal, setShowClientModal] = useState(false);
  const [activityType, setActivityType] = useState('');
  const { activities: availableActivities, createActivity, loading: activitiesLoading } = useActivities();

  // Yeni handleSubmit fonksiyonu
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      // Form verilerini backend'e gönderme işlemi
      console.log('Form submitted:', formData, selectedResources);

      if (onSuccess) {
        onSuccess(); // Başarılı işlem sonrası modal'ı kapatabilir veya listeyi yenileyebilirsiniz
      }

      onClose(); // Modal'ı kapat
    } catch (error) {
      console.error('Error submitting the form:', error);
    }
  };

  const handleClientChange = (clientName: string) => {
    setFormData((prev) => ({ ...prev, clientName }));
  };

  const handleAddActivityType = async () => {
    if (activityType.trim()) {
      try {
        await createActivity(activityType.trim());
        setFormData((prev) => ({
          ...prev,
          activityTypes: [...prev.activityTypes, activityType.trim()],
        }));
        setActivityType('');
      } catch (error) {
        // Error handling is managed by useApi hook
      }
    }
  };

  const handleRemoveActivityType = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      activityTypes: prev.activityTypes.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{mode === 'add' ? 'Add New Project' : 'Edit Project'}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Form fields */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Project Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Client Name *</label>
              <div className="flex space-x-2">
                <select
                  value={formData.clientName}
                  onChange={(e) => handleClientChange(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                >
                  <option value="">Select a client</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.name}>
                      {client.name}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setShowClientModal(true)}
                  className="mt-1 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          {/* Other form fields */}
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
            >
              {mode === 'add' ? 'Create Project' : 'Update Project'}
            </button>
          </div>
        </form>
      </div>
      {/* Modals */}
      {showResourceModal && (
        <ResourceSelectionModal
          resources={resources}
          selectedResources={selectedResources}
          onClose={() => setShowResourceModal(false)}
          onSave={(resources) => {
            setSelectedResources(resources);
            setShowResourceModal(false);
          }}
        />
      )}
      {showClientModal && (
        <ClientModal
          onClose={() => setShowClientModal(false)}
          onSuccess={() => {
            setShowClientModal(false);
            // Refresh clients list if needed
          }}
          mode="add"
        />
      )}
    </div>
  );
};

export default ProjectModal;
