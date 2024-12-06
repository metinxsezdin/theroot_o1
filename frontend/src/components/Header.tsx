import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Filter, X } from 'lucide-react';
import KeyboardShortcutsInfo from './KeyboardShortcutsInfo';
import { ColorFilterType, Resource } from '../types';

interface HeaderProps {
  onPreviousWeek: () => void;
  onNextWeek: () => void;
  onAddBooking: () => void;
  currentDate: Date;
  view: 'week' | 'day';
  onViewChange: (view: 'week' | 'day') => void;
  colorFilter: ColorFilterType;
  onColorFilterChange: (filter: ColorFilterType) => void;
  focusedResource: Resource | null;
  onClearFocus: () => void;
}

const Header = ({ 
  onPreviousWeek, 
  onNextWeek, 
  onAddBooking, 
  currentDate,
  view,
  onViewChange,
  colorFilter,
  onColorFilterChange,
  focusedResource,
  onClearFocus
}: HeaderProps) => {
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  const startOfWeek = new Date(currentDate);
  const endOfWeek = new Date(currentDate);
  endOfWeek.setDate(endOfWeek.getDate() + 6);

  const formatDateRange = () => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    };

    if (view === 'day') {
      return currentDate.toLocaleDateString('tr-TR', options);
    }

    if (startOfWeek.getMonth() === endOfWeek.getMonth()) {
      return `${startOfWeek.getDate()} - ${endOfWeek.getDate()} ${startOfWeek.toLocaleDateString('tr-TR', {
        month: 'long',
        year: 'numeric'
      })}`;
    } else if (startOfWeek.getFullYear() === endOfWeek.getFullYear()) {
      return `${startOfWeek.toLocaleDateString('tr-TR', { month: 'short' })} ${startOfWeek.getDate()} - ${endOfWeek.toLocaleDateString('tr-TR', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })}`;
    } else {
      return `${startOfWeek.toLocaleDateString('tr-TR', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })} - ${endOfWeek.toLocaleDateString('tr-TR', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })}`;
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onPreviousWeek}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={onNextWeek}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
          <h2 className="text-lg font-semibold text-gray-900">
            {formatDateRange()}
          </h2>
          {focusedResource && (
            <div className="ml-4 flex items-center space-x-2 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full">
              <span className="text-sm font-medium">{focusedResource.name}</span>
              <button
                onClick={onClearFocus}
                className="hover:text-indigo-900"
              >
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
          <div className="relative inline-block">
            <button
              onClick={() => setShowFilterMenu(!showFilterMenu)}
              className="flex items-center space-x-2 px-3 py-1 text-sm border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <Filter className="w-4 h-4" />
              <span>Renk Filtresi</span>
            </button>
            {showFilterMenu && (
              <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                <div className="py-1" role="menu">
                  <button
                    onClick={() => {
                      onColorFilterChange('none');
                      setShowFilterMenu(false);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm ${
                      colorFilter === 'none' ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                    } hover:bg-gray-100`}
                  >
                    Varsayılan
                  </button>
                  <button
                    onClick={() => {
                      onColorFilterChange('client');
                      setShowFilterMenu(false);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm ${
                      colorFilter === 'client' ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                    } hover:bg-gray-100`}
                  >
                    Müşteriye Göre
                  </button>
                  <button
                    onClick={() => {
                      onColorFilterChange('project');
                      setShowFilterMenu(false);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm ${
                      colorFilter === 'project' ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                    } hover:bg-gray-100`}
                  >
                    Projeye Göre
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={onAddBooking}
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