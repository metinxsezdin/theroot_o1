import React from 'react';
import { X, Clock, Focus } from 'lucide-react';
import { Personnel } from '../types';
import { formatTime } from '../utils/timeUtils';

interface ResourceAvailabilityModalProps {
  person: Personnel;
  onClose: () => void;
  onFocusPerson: (person: Personnel) => void;
  isFocused: boolean;
}

const ResourceAvailabilityModal = ({ 
  person,
  onClose, 
  onFocusPerson,
  isFocused 
}: ResourceAvailabilityModalProps) => {
  const weekDays = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
              <span className="text-indigo-600 font-medium">
                {person.name.charAt(0)}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{person.name}</h2>
              <p className="text-sm text-gray-500">{person.role}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onFocusPerson(person)}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-md ${
                isFocused
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Focus className="w-4 h-4" />
              <span>{isFocused ? 'Focused' : 'Focus Timeline'}</span>
            </button>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center space-x-2 text-gray-600">
            <Clock className="w-5 h-5" />
            <span>Haftalık Çalışma Saatleri</span>
          </div>

          <div className="grid gap-4">
            {weekDays.map((day) => (
              <div
                key={day}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <span className="font-medium text-gray-700">{day}</span>
                <div className="text-gray-600">
                  {formatTime(person.availability.start)} - {formatTime(person.availability.end)}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 text-sm text-gray-500">
            * Varsayılan çalışma saatleri gösterilmektedir. Özel durumlar için rezervasyonları kontrol ediniz.
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResourceAvailabilityModal;