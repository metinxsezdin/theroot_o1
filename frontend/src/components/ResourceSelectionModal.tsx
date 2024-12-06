import React, { useState } from 'react';
import { X, Search } from 'lucide-react';
import { Personnel } from '../types';
import LoadingSpinner from './LoadingSpinner';

interface ResourceSelectionModalProps {
  resources: Personnel[];
  selectedResources: Personnel[];
  onClose: () => void;
  onSave: (resources: Personnel[]) => void;
  loading?: boolean;
}

const ResourceSelectionModal = ({
  resources,
  selectedResources,
  onClose,
  onSave,
  loading = false
}: ResourceSelectionModalProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedResourceIds, setSelectedResourceIds] = useState<Set<string>>(
    new Set(selectedResources.map(r => r.id))
  );

  const filteredResources = resources.filter(resource =>
    resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resource.role?.toLowerCase().includes(searchQuery.toLowerCase() || '')
  );

  const handleToggleResource = (resource: Personnel) => {
    const newSelectedIds = new Set(selectedResourceIds);
    if (newSelectedIds.has(resource.id)) {
      newSelectedIds.delete(resource.id);
    } else {
      newSelectedIds.add(resource.id);
    }
    setSelectedResourceIds(newSelectedIds);
  };

  const handleSave = () => {
    const selectedResourceList = resources.filter(r => selectedResourceIds.has(r.id));
    onSave(selectedResourceList);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Select Resources</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search resources..."
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto min-h-[300px] border border-gray-200 rounded-lg">
          <div className="divide-y divide-gray-200">
            {filteredResources.map((resource) => (
              <div
                key={resource.id}
                className="flex items-center p-4 hover:bg-gray-50 cursor-pointer"
                onClick={() => handleToggleResource(resource)}
              >
                <input
                  type="checkbox"
                  checked={selectedResourceIds.has(resource.id)}
                  onChange={() => handleToggleResource(resource)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <div className="ml-3 flex items-center flex-1">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                    <span className="text-indigo-600 font-medium">
                      {resource.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{resource.name}</p>
                    <p className="text-sm text-gray-500">{resource.role}</p>
                  </div>
                </div>
              </div>
            ))}
            {filteredResources.length === 0 && (
              <div className="p-4 text-center text-gray-500">
                No resources found
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
          >
            {selectedResourceIds.size} Resources Selected
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResourceSelectionModal;