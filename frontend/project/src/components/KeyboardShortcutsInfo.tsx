import React, { useState } from 'react';
import { Keyboard, X } from 'lucide-react';

const KeyboardShortcutsInfo = () => {
  const [isOpen, setIsOpen] = useState(false);

  const shortcuts = [
    {
      key: 'R',
      description: 'Yeni rezervasyon ekle',
    },
    // Gelecekte eklenecek kısayollar için hazır
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
        title="Klavye Kısayolları"
      >
        <Keyboard className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-2">
                <Keyboard className="w-5 h-5 text-gray-600" />
                <h2 className="text-xl font-semibold text-gray-900">Klavye Kısayolları</h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              {shortcuts.map(({ key, description }) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-gray-600">{description}</span>
                  <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-sm font-mono">
                    {key}
                  </kbd>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default KeyboardShortcutsInfo;