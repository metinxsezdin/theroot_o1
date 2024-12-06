import { useState, useEffect } from 'react';
import { Project } from '../types';
import { projectApi } from '../api/endpoints';
import { useApi } from './useApi';

export const useProjects = (initialProjects: Project[]) => {
  const [projects, setProjects] = useState<Project[]>(initialProjects);

  const {
    execute: fetchProjects,
    loading: loadingProjects,
    error: projectsError
  } = useApi(projectApi.getAll, {
    onSuccess: (data) => setProjects(data)
  });

  const {
    execute: createProject,
    loading: creatingProject
  } = useApi(projectApi.create, {
    successMessage: 'Project created successfully',
    onSuccess: (newProject) => {
      setProjects(prev => [...prev, newProject]);
    }
  });

  const {
    execute: updateProject,
    loading: updatingProject
  } = useApi(projectApi.update, {
    successMessage: 'Project updated successfully',
    onSuccess: (updatedProject) => {
      setProjects(prev => prev.map(project =>
        project.id === updatedProject.id ? updatedProject : project
      ));
    }
  });

  const {
    execute: deleteProject,
    loading: deletingProject
  } = useApi(projectApi.delete, {
    successMessage: 'Project deleted successfully',
    onSuccess: (_, id) => {
      setProjects(prev => prev.filter(project => project.id !== id));
    }
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  return {
    projects,
    createProject,
    updateProject,
    deleteProject,
    loading: loadingProjects || creatingProject || updatingProject || deletingProject,
    error: projectsError
  };
};