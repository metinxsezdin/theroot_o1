import { useState, useEffect } from 'react';
import { Client } from '../types';
import { clientApi } from '../api/endpoints';
import { useApi } from './useApi';

export const useClients = (initialClients: Client[] = []) => {
  const [clients, setClients] = useState<Client[]>(initialClients);

  const {
    execute: fetchClients,
    loading: loadingClients,
    error: clientsError
  } = useApi(clientApi.getAll, {
    onSuccess: (data) => setClients(data)
  });

  const {
    execute: createClient,
    loading: creatingClient
  } = useApi(clientApi.create, {
    successMessage: 'Client created successfully',
    onSuccess: (newClient) => {
      setClients(prev => [...prev, newClient]);
    }
  });

  const {
    execute: updateClient,
    loading: updatingClient
  } = useApi(clientApi.update, {
    successMessage: 'Client updated successfully',
    onSuccess: (updatedClient) => {
      setClients(prev => prev.map(client =>
        client.id === updatedClient.id ? updatedClient : client
      ));
    }
  });

  const {
    execute: deleteClient,
    loading: deletingClient
  } = useApi(clientApi.delete, {
    successMessage: 'Client deleted successfully',
    onSuccess: (_, id) => {
      setClients(prev => prev.filter(client => client.id !== id));
    }
  });

  useEffect(() => {
    fetchClients();
  }, []);

  return {
    clients,
    createClient,
    updateClient,
    deleteClient,
    loading: loadingClients || creatingClient || updatingClient || deletingClient || !clients,
    error: clientsError
  };
};