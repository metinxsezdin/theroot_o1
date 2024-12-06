import React, { useState } from 'react';
import { Resource, Department } from '../types';
import { ChevronDown, ChevronRight, Search } from 'lucide-react';

interface ResourceListProps {
  resources: Resource[];
  departments: Department[];
  onResourceClick: (resource: Resource) => void;
}

const ResourceList = ({ resources, departments, onResourceClick }: ResourceListProps) => {
  const [expandedDepartments, setExpandedDepartments] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');

  const toggleDepartment = (departmentId: string) => {
    setExpandedDepartments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(departmentId)) {
        newSet.delete(departmentId);
      } else {
        newSet.add(departmentId);
      }
      return newSet;
    });
  };

  const filteredResources = resources.filter(resource => 
    resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resource.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const resourcesByDepartment = departments.map(department => {
    const departmentResources = filteredResources.filter(
      resource => resource.departmentId === department.id
    );
    return {
      ...department,
      resources: departmentResources
    };
  }).filter(dept => dept.resources.length > 0);

  return (
    <div className="w-64 border-r border-gray-200 bg-white flex flex-col h-screen overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex-shrink-0 space-y-3">
        <h2 className="text-lg font-semibold text-gray-800">Resources</h2>
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Kaynak ara..."
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
        </div>
      </div>
      <div className="divide-y divide-gray-200 overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        {resourcesByDepartment.map(({ id, name, color, resources: departmentResources }) => (
          <div key={id} className="bg-gray-50">
            <button
              onClick={() => toggleDepartment(id)}
              className="w-full px-4 py-2 flex items-center justify-between hover:bg-gray-100"
            >
              <div className="flex items-center space-x-2">
                {expandedDepartments.has(id) ? (
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                )}
                <span className="font-medium text-sm" style={{ color }}>
                  {name}
                </span>
                <span className="text-xs text-gray-500">
                  ({departmentResources.length})
                </span>
                <span className="flex-1" />
              </div>
            </button>
            {expandedDepartments.has(id) && (
              <div className="divide-y divide-gray-100">
                {departmentResources.map((resource) => (
                  <div
                    key={resource.id}
                    onClick={() => onResourceClick(resource)}
                    className="pl-8 pr-4 py-2 hover:bg-gray-50 cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                        {resource.avatar ? (
                          <img
                            src={resource.avatar}
                            alt={resource.name}
                            className="w-8 h-8 rounded-full"
                          />
                        ) : (
                          <span className="text-indigo-600 font-medium">
                            {resource.name.charAt(0)}
                          </span>
                        )}
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">
                          {resource.name}
                        </h3>
                        <p className="text-xs text-gray-500">{resource.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResourceList;