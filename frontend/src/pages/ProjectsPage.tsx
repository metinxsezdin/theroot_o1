import React, { useState } from 'react';
import { Plus, Trash2, Search } from 'lucide-react';
import { Project, Personnel, Client } from '../types';
import ProjectModal from '../components/ProjectModal';
import ProjectDetailsModal from '../components/ProjectDetailsModal';
import ConfirmationModal from '../components/ConfirmationModal';
import LoadingSpinner from '../components/LoadingSpinner';

interface ProjectsPageProps {
  projects: Project[];
  resources: Personnel[];
  clients: Client[];
  loading?: boolean;
}

const ProjectsPage = ({
  projects,
  resources,
  clients,
  loading = false
}: ProjectsPageProps) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProjects = (projects || []).filter(project => {
    const searchLower = searchQuery.toLowerCase();
    const clientName = project?.clientName?.toLowerCase() || '';
    const projectName = project?.name?.toLowerCase() || '';
    
    return clientName.includes(searchLower) || projectName.includes(searchLower);
  });

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-50 p-6">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects..."
              className="w-64 pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            <Plus className="w-4 h-4" />
            <span>Add Project</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Project Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProjects.map((project) => (
                <tr 
                  key={project.id} 
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => setSelectedProject(project)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div
                        className="w-3 h-3 rounded-full mr-3"
                        style={{ backgroundColor: project.color }}
                      />
                      <div className="text-sm font-medium text-gray-900">
                        {project.name}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {project.clientName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      project.status === 'active' ? 'bg-green-100 text-green-800' :
                      project.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setProjectToDelete(project);
                      }}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <ProjectModal
          onClose={() => setShowModal(false)}
          resources={resources}
          clients={clients}
        />
      )}

      {selectedProject && (
        <ProjectDetailsModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}

      {projectToDelete && (
        <ConfirmationModal
          title="Delete Project"
          message={`Are you sure you want to delete "${projectToDelete.name}"? This action cannot be undone.`}
          onConfirm={() => setProjectToDelete(null)}
          onCancel={() => setProjectToDelete(null)}
        />
      )}
    </div>
  );
};

export default ProjectsPage;