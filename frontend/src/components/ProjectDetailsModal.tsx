import React, { useState } from 'react';
import { X, Calendar, Hash, Building2, Tags, Clock, Users, DollarSign, Edit2, Save } from 'lucide-react';
import { Project } from '../types';
import { formatDate } from '../utils/helpers';

interface ProjectDetailsModalProps {
  project: Project;
  onClose: () => void;
  onUpdate?: (id: string, updates: Partial<Project>) => void;
}

const ProjectDetailsModal = ({ project, onClose, onUpdate }: ProjectDetailsModalProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: project.name,
    clientName: project.clientName,
    startDate: project.startDate || '',
    endDate: project.endDate || '',
    billable: project.billable,
    status: project.status,
    description: project.description || '',
    budget: project.budget?.toString() || '',
    activityTypes: project.activityTypes,
  });

  const [activityType, setActivityType] = useState('');

  const handleSave = () => {
    if (onUpdate) {
      onUpdate(project.id, {
        ...formData,
        budget: formData.budget ? Number(formData.budget) : undefined,
      });
    }
    setIsEditing(false);
  };

  const handleAddActivityType = () => {
    if (activityType.trim()) {
      setFormData(prev => ({
        ...prev,
        activityTypes: [...prev.activityTypes, activityType.trim()]
      }));
      setActivityType('');
    }
  };

  const handleRemoveActivityType = (index: number) => {
    setFormData(prev => ({
      ...prev,
      activityTypes: prev.activityTypes.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div 
              className="w-4 h-4 rounded-full" 
              style={{ backgroundColor: project.color }}
            />
            {isEditing ? (
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="text-xl font-semibold text-gray-900 border-b border-gray-300 focus:border-indigo-500 focus:ring-0"
              />
            ) : (
              <h2 className="text-xl font-semibold text-gray-900">{project.name}</h2>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {onUpdate && (
              isEditing ? (
                <button
                  onClick={handleSave}
                  className="flex items-center space-x-1 text-indigo-600 hover:text-indigo-700"
                >
                  <Save className="w-5 h-5" />
                  <span>Save</span>
                </button>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center space-x-1 text-gray-600 hover:text-gray-700"
                >
                  <Edit2 className="w-5 h-5" />
                  <span>Edit</span>
                </button>
              )
            )}
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Hash className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="text-sm text-gray-500">Project Code</div>
                  <div className="font-medium">{project.id}</div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Building2 className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="text-sm text-gray-500">Client</div>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.clientName}
                      onChange={(e) => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  ) : (
                    <div className="font-medium">{project.clientName}</div>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Tags className="w-5 h-5 text-gray-400" />
                <div className="flex-1">
                  <div className="text-sm text-gray-500">Activity Types</div>
                  {isEditing ? (
                    <div className="mt-1">
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={activityType}
                          onChange={(e) => setActivityType(e.target.value)}
                          className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          placeholder="Enter activity type"
                        />
                        <button
                          type="button"
                          onClick={handleAddActivityType}
                          className="px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                        >
                          Add
                        </button>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {formData.activityTypes?.map((type, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                          >
                            {type}
                        )) || <span>No activity types available</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveActivityType(index)}
                              className="ml-1 text-indigo-600 hover:text-indigo-900"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="font-medium flex flex-wrap gap-2 mt-1">
                      {project.activityTypes?.map((type, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                        >
                          {type}
                      )) || <span>No activity types available</span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div className="flex-1">
                  <div className="text-sm text-gray-500">Start and End Date</div>
                  {isEditing ? (
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      <input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                      <input
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                  ) : (
                    <div className="font-medium">
                      {project.startDate && project.endDate
                        ? `${formatDate(new Date(project.startDate))} - ${formatDate(new Date(project.endDate))}`
                        : 'Not set'}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="text-sm text-gray-500">Status</div>
                  {isEditing ? (
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as Project['status'] }))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                      <option value="active">Active</option>
                      <option value="completed">Completed</option>
                      <option value="on-hold">On Hold</option>
                    </select>
                  ) : (
                    <div className="font-medium capitalize">{project.status}</div>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <DollarSign className="w-5 h-5 text-gray-400" />
                <div className="flex-1">
                  <div className="text-sm text-gray-500">Budget</div>
                  {isEditing ? (
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">$</span>
                      </div>
                      <input
                        type="number"
                        value={formData.budget}
                        onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                        className="block w-full pl-7 rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                        placeholder="0.00"
                      />
                    </div>
                  ) : (
                    <div className="font-medium">
                      {project.budget ? `$${project.budget.toLocaleString()}` : 'Not set'}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <DollarSign className="w-5 h-5 text-gray-400" />
                <div className="flex items-center space-x-2">
                  <div className="text-sm text-gray-500">Billable</div>
                  <div className="relative inline-block w-10 mr-2 align-middle select-none">
                    <input 
                      type="checkbox" 
                      checked={isEditing ? formData.billable : project.billable}
                      onChange={(e) => isEditing && setFormData(prev => ({ ...prev, billable: e.target.checked }))}
                      disabled={!isEditing}
                      className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                    />
                    <label className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Description</h3>
            {isEditing ? (
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Add a description..."
              />
            ) : (
              <p className="text-gray-600">{project.description || 'No description provided.'}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailsModal;