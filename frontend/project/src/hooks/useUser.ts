import { useState } from 'react';

interface User {
  name: string;
  email: string;
  avatar?: string;
}

export const useUser = (initialUser: User) => {
  const [user, setUser] = useState<User>(initialUser);

  const updateProfile = (updates: Partial<User>) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  const changePassword = (oldPassword: string, newPassword: string) => {
    // In a real application, this would make an API call to update the password
    console.log('Password changed:', { oldPassword, newPassword });
    // You would typically show a success message here
  };

  return {
    user,
    updateProfile,
    changePassword,
  };
};