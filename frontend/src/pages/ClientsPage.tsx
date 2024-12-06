import React, { useState } from 'react';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { Client } from '../types';
import ClientModal from '../components/ClientModal';
import ClientDetailsModal from '../components/ClientDetailsModal';
import ConfirmationModal from '../components/ConfirmationModal';
import LoadingSpinner from '../components/LoadingSpinner';

interface ClientsPageProps {
  clients: Client[];
  loading?: boolean;
  error?: string | null;
  onAddClient?: (client: Omit<Client, 'id'>) => void;
  onUpdateClient?: (id: string, updates: Partial<Client>) => void;
  onDeleteClient?: (id: string) => void;
}

const ClientsPage: React.FC<ClientsPageProps> = ({ 
  clients = [], 
  loading = false,
  error = null,
  onAddClient, 
  onUpdateClient, 
  onDeleteClient 
}) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleEditClient = (client: Client) => {
    setSelectedClient(client);
    setShowModal(true);
  };

  const handleSaveClient = (clientData: Omit<Client, 'id'>) => {
    if (selectedClient) {
      onUpdateClient?.(selectedClient.id, clientData);
    } else {
      onAddClient?.(clientData);
    }
  };

  const handleConfirmDelete = () => {
    if (clientToDelete) {
      onDeleteClient?.(clientToDelete.id);
      setClientToDelete(null);
    }
  };

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-50 p-6">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Müşteriler</h1>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Müşteri ara..."
              className="w-64 pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          </div>
          <button
            onClick={() => {
              setSelectedClient(null);
              setShowModal(true);
            }}
            className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            <Plus className="w-4 h-4" />
            <span>Müşteri Ekle</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.map((client) => (
          <div
            onClick={() => {
              setSelectedClient(client);
              setShowDetailsModal(true);
            }}
            key={client.id}
            className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${client.color}20`, color: client.color }}
                  >
                    <span className="text-lg font-semibold">
                      {client.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {client.name}
                    </h3>
                    <p className="text-sm text-gray-500">{client.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditClient(client);
                    }}
                    className="p-1 text-gray-500 hover:text-gray-700"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setClientToDelete(client);
                    }}
                    className="p-1 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              {client.phone && (
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-medium">Telefon:</span> {client.phone}
                </p>
              )}
              {client.address && (
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-medium">Adres:</span> {client.address}
                </p>
              )}
              {client.description && (
                <p className="text-sm text-gray-600 mt-3">{client.description}</p>
              )}
              {client.employees && client.employees.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Çalışan Sayısı:</span>{' '}
                    {client.employees.length}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <ClientModal
          onClose={() => {
            setShowModal(false);
            setSelectedClient(null);
          }}
          onSave={handleSaveClient}
          initialClient={selectedClient || undefined}
          mode={selectedClient ? 'edit' : 'add'}
        />
      )}

      {clientToDelete && (
        <ConfirmationModal
          title="Müşteriyi Sil"
          message={`"${clientToDelete.name}" müşterisini silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setClientToDelete(null)}
        />
      )}

      {showDetailsModal && selectedClient && (
        <ClientDetailsModal
          client={selectedClient}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedClient(null);
          }}
          onUpdateClient={onUpdateClient}
        />
      )}
    </div>
  );
};

export default ClientsPage;