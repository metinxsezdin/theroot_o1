import { useState, useEffect } from 'react';
import { activityApi } from '../api/endpoints';
import { useApi } from './useApi';

export const useActivities = (projectId?: string) => {
  const [activities, setActivities] = useState<string[]>([]);

  const {
    execute: fetchActivities,
    loading: loadingActivities,
    error: activitiesError
  } = useApi(projectId ? activityApi.getByProject : activityApi.getAll, {
    onSuccess: (data) => setActivities(data)
  });

  const {
    execute: createActivity,
    loading: creatingActivity
  } = useApi(activityApi.create, {
    successMessage: 'Activity type created successfully',
    onSuccess: (newActivity) => {
      setActivities(prev => [...prev, newActivity]);
    }
  });

  const {
    execute: deleteActivity,
    loading: deletingActivity
  } = useApi(activityApi.delete, {
    successMessage: 'Activity type deleted successfully',
    onSuccess: (_, name) => {
      setActivities(prev => prev.filter(activity => activity !== name));
    }
  });

  const {
    execute: addToProject,
    loading: addingToProject
  } = useApi(activityApi.addToProject, {
    successMessage: 'Activities added to project successfully'
  });

  const {
    execute: removeFromProject,
    loading: removingFromProject
  } = useApi(activityApi.removeFromProject, {
    successMessage: 'Activity removed from project successfully'
  });

  useEffect(() => {
    if (projectId) {
      fetchActivities(projectId);
    } else {
      fetchActivities();
    }
  }, [projectId]);

  return {
    activities,
    createActivity,
    deleteActivity,
    addToProject,
    removeFromProject,
    loading: loadingActivities || creatingActivity || deletingActivity || addingToProject || removingFromProject,
    error: activitiesError
  };
};