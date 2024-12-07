import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Filter, X } from 'lucide-react';
import KeyboardShortcutsInfo from './KeyboardShortcutsInfo';
import { ColorFilterType, Resource } from '../types';

interface HeaderProps {
  currentDate: Date;
  onDateChange: (newDate: Date) => void; // Tarih güncelleme işlevi
  onAddBooking: () => void; // Rezervasyon ekleme işlevi
  view: 'week' | 'day';
  onViewChange: (view: 'week' | 'day') => void;
  colorFilter: ColorFilterType;
  onColorFilterChange: (filter: ColorFilterType) => void;
  focusedResource: Resource | null;
  onClearFocus: () => void;
}

const Header = ({
  currentDate,
  onDateChange,
  onAddBooking,
  view,
  onViewChange,
  colorFilter,
  onColorFilterChange,
  focusedResource,
  onClearFocus,
}: HeaderProps) => {
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  const handlePreviousWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 7); // Bir önceki hafta
    onDateChange(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 7); // Bir sonraki hafta
    onDateChange(newDate);
  };

  const formatDateRange = () => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    };

    if (view === 'day') {
      return currentDate.toLocaleDateString('tr-TR', options);
    }

    const startOfWeek = new Date(currentDate);
    const endOfWeek = new Date(currentDate);
    startOfWeek.setDate(startOfWeek.getDate() - (currentDate.getDay() || 7) + 1);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    if (startOfWeek.getMonth() === endOfWeek.getMonth()) {
      return `${startOfWeek.getDate()} - ${endOfWeek.getDate()} ${startOfWeek.toLocaleDateString('tr-TR', {
        month: 'long',
        year: 'numeric',
      })}`;
    }

    return `${startOfWeek.toLocaleDateString('tr-TR', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })} - ${endOfWeek.toLocaleDateString('tr-TR', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })}`;
  };

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={handlePreviousWeek}
            className="p-2 hover:bg-gray-100 rounded-full"
            aria-label="Önceki hafta"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={handleNextWeek}
            className="p-2 hover:bg-gray-100 rounded-full"
            aria-label="Sonraki hafta"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
          <h2 className="text-lg font-semibold text-gray-900">
            {formatDateRange()}
          </h2>
          {focusedResource && (
            <div className="ml-4 flex items-center space-x-2 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full">
              <span className="text-sm font-medium">{focusedResource.name}</span>
              <button onClick={onClearFocus} className="hover:text-indigo-900">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
          <div className="ml-4 flex rounded-lg overflow-hidden border border-gray-200">
            <button
              onClick={() => onViewChange('week')}
              className={`px-3 py-1 text-sm ${
                view === 'week'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Haftalık
            </button>
            <button
              onClick={() => onViewChange('day')}
              className={`px-3 py-1 text-sm ${
                view === 'day'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Günlük
            </button>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              console.log('Rezervasyon Ekle butonu tetiklendi');
              onAddBooking();
            }}
            className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
            title="Rezervasyon Ekle (R)"
          >
            <Plus className="w-4 h-4" />
            <span>Rezervasyon Ekle</span>
          </button>
          <KeyboardShortcutsInfo />
        </div>
      </div>
    </div>
  );
};

export default Header;
