import { useState, useEffect } from 'react';
import { Department } from '../types';
import { departmentApi } from '../api/endpoints';
import { useApi } from './useApi';

export const useDepartments = (initialDepartments: Department[]) => {
  const [departments, setDepartments] = useState<Department[]>(initialDepartments);

  const {
    execute: fetchDepartments,
    loading: loadingDepartments,
    error: departmentsError
  } = useApi(departmentApi.getAll, {
    onSuccess: (data) => setDepartments(data)
  });

  const {
    execute: createDepartment,
    loading: creatingDepartment
  } = useApi(departmentApi.create, {
    successMessage: 'Department created successfully',
    onSuccess: (newDepartment) => {
      setDepartments(prev => [...prev, newDepartment]);
    }
  });

  const {
    execute: updateDepartment,
    loading: updatingDepartment
  } = useApi(departmentApi.update, {
    successMessage: 'Department updated successfully',
    onSuccess: (updatedDepartment) => {
      setDepartments(prev => prev.map(department =>
        department.id === updatedDepartment.id ? updatedDepartment : department
      ));
    }
  });

  const {
    execute: deleteDepartment,
    loading: deletingDepartment
  } = useApi(departmentApi.delete, {
    successMessage: 'Department deleted successfully',
    onSuccess: (_, id) => {
      setDepartments(prev => prev.filter(department => department.id !== id));
    }
  });

  useEffect(() => {
    fetchDepartments();
  }, []);

  return {
    departments,
    createDepartment,
    updateDepartment,
    deleteDepartment,
    loading: loadingDepartments || creatingDepartment || updatingDepartment || deletingDepartment,
    error: departmentsError
  };
};