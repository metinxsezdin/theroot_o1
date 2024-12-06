import React, { useState } from 'react';
import { X } from 'lucide-react';
import { ClientEmployee } from '../types';
import { generateId } from '../utils/helpers';

interface ClientEmployeeModalProps {
  onClose: () => void;
  onSave: (employee: ClientEmployee) => void; // Backend çağrısı için tanımlı
  initialEmployee?: ClientEmployee;
  mode?: 'add' | 'edit';
}

const ClientEmployeeModal = ({
  onClose,
  onSave,
  initialEmployee,
  mode = 'add',
}: ClientEmployeeModalProps) => {
  const [formData, setFormData] = useState({
    id: initialEmployee?.id || generateId(),
    name: initialEmployee?.name || '',
    role: initialEmployee?.role || '',
    email: initialEmployee?.email || '',
    phone: initialEmployee?.phone || '',
    department: initialEmployee?.department || '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Form verilerinin eksiksiz olduğunu kontrol et
    if (!formData.name || !formData.role || !formData.email) {
      setError('Zorunlu alanlar eksik!');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Backend'e POST isteği
      const response = await fetch('http://localhost:5000/employees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Çalışan eklenemedi.');
      }

      const newEmployee = await response.json();

      // Başarılı olursa parent bileşene haber ver
      onSave(newEmployee);

      // Modal'ı kapat
      onClose();
    } catch (err) {
      console.error(err);
      setError('Çalışan kaydedilemedi, lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {mode === 'add' ? 'Yeni Çalışan Ekle' : 'Çalışanı Düzenle'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Ad Soyad</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Pozisyon</label>
              <input
                type="text"
                value={formData.role}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, role: e.target.value }))
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Departman</label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, department: e.target.value }))
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">E-posta</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Telefon</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, phone: e.target.value }))
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 text-sm font-medium text-white rounded-md ${
                loading ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {loading ? 'Kaydediliyor...' : mode === 'add' ? 'Çalışan Ekle' : 'Değişiklikleri Kaydet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClientEmployeeModal;
