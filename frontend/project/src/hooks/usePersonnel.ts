import { useState, useEffect } from 'react';
import { Personnel } from '../types';
import { personnelApi } from '../api/endpoints';
import { useApi } from './useApi';

export const usePersonnel = (initialPersonnel: Personnel[]) => {
  const [personnel, setPersonnel] = useState<Personnel[]>(initialPersonnel);

  const {
    execute: fetchPersonnel,
    loading: loadingPersonnel,
    error: personnelError
  } = useApi(personnelApi.getAll, {
    onSuccess: (data) => setPersonnel(data)
  });

  const {
    execute: createPersonnel,
    loading: creatingPersonnel
  } = useApi(personnelApi.create, {
    successMessage: 'Personnel created successfully',
    onSuccess: (newPerson) => {
      setPersonnel(prev => [...prev, newPerson]);
    }
  });

  const {
    execute: updatePersonnel,
    loading: updatingPersonnel
  } = useApi(personnelApi.update, {
    successMessage: 'Personnel updated successfully',
    onSuccess: (updatedPerson) => {
      setPersonnel(prev => prev.map(person =>
        person.id === updatedPerson.id ? updatedPerson : person
      ));
    }
  });

  const {
    execute: deletePersonnel,
    loading: deletingPersonnel
  } = useApi(personnelApi.delete, {
    successMessage: 'Personnel deleted successfully',
    onSuccess: (_, id) => {
      setPersonnel(prev => prev.filter(person => person.id !== id));
    }
  });

  useEffect(() => {
    fetchPersonnel();
  }, []);

  return {
    personnel,
    createPersonnel,
    updatePersonnel,
    deletePersonnel,
    loading: loadingPersonnel || creatingPersonnel || updatingPersonnel || deletingPersonnel,
    error: personnelError
  };
};