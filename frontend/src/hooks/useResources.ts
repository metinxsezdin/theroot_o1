import { useState } from 'react';
import { Personnel } from '../types';
import { generateId } from '../utils/helpers';

export const usePersonnel = (initialPersonnel: Personnel[]) => {
  const [personnel, setPersonnel] = useState<Personnel[]>(initialPersonnel);

  const addPersonnel = (person: Omit<Personnel, 'id'>) => {
    const newPerson = {
      ...person,
      id: generateId(),
    };
    setPersonnel((prev) => [...prev, newPerson]);
  };

  const updatePersonnel = (id: string, updates: Partial<Personnel>) => {
    setPersonnel((prev) =>
      prev.map((person) =>
        person.id === id ? { ...person, ...updates } : person
      )
    );
  };

  const deletePersonnel = (id: string) => {
    setPersonnel((prev) => prev.filter((person) => person.id !== id));
  };

  return {
    personnel,
    addPersonnel,
    updatePersonnel,
    deletePersonnel,
  };
};