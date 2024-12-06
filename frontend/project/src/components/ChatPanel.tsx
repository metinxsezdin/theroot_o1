import React, { useState, useRef, useEffect } from 'react';
import { X, Minimize2, Maximize2, Smile, Image, Hash, ChevronDown } from 'lucide-react';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { GiphyFetch } from '@giphy/js-fetch-api';
import { Grid } from '@giphy/react-components';
import { ChatMessage, Personnel, ChatChannel } from '../types';

interface ChatPanelProps {
  onClose: () => void;
  messages: ChatMessage[];
  loading: boolean;
  onSendMessage: (message: Omit<ChatMessage, 'id'>) => void;
  selectedPerson: Personnel | null;
  onSelectPerson: (person: Personnel | null) => void;
  personnel: Personnel[];
  currentUser: { id: string; name: string };
}

const gf = new GiphyFetch('pLURtkhVrUXr3KG25Gy5IvzziV5OrZGa');

const defaultChannels: ChatChannel[] = [
  { id: '1', name: 'genel', description: 'Genel konuşmalar', isPrivate: false, members: [] },
  { id: '2', name: 'projeler', description: 'Proje tartışmaları', isPrivate: false, members: [] },
  { id: '3', name: 'duyurular', description: 'Önemli duyurular', isPrivate: false, members: [] },
];

const ChatPanel = ({ 
  onClose,
  messages,
  loading,
  onSendMessage,
  selectedPerson,
  onSelectPerson,
  personnel,
  currentUser
}: ChatPanelProps) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [position, setPosition] = useState({ x: -1, y: -1 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const panelRef = useRef<HTMLDivElement>(null);
  
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showGifPicker, setShowGifPicker] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState<ChatChannel | null>(null);

  useEffect(() => {
    if (position.x === -1 && position.y === -1 && panelRef.current) {
      const rect = panelRef.current.getBoundingClientRect();
      setPosition({
        x: window.innerWidth - rect.width - 16,
        y: window.innerHeight - rect.height - 16
      });
    }
  }, [position]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target instanceof HTMLElement && e.target.closest('.chat-header')) {
      setIsDragging(true);
      const rect = panelRef.current?.getBoundingClientRect();
      if (rect) {
        setDragOffset({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
      }
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && panelRef.current) {
        const newX = e.clientX - dragOffset.x;
        const newY = e.clientY - dragOffset.y;
        
        // Keep the panel within viewport bounds
        const maxX = window.innerWidth - panelRef.current.offsetWidth;
        const maxY = window.innerHeight - panelRef.current.offsetHeight;
        
        setPosition({
          x: Math.max(0, Math.min(newX, maxX)),
          y: Math.max(0, Math.min(newY, maxY))
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  const handleEmojiSelect = (emoji: any) => {
    setInputValue(prev => prev + emoji.native);
    setShowEmojiPicker(false);
  };

  const handleGifSelect = (gif: any) => {
    const newMessage: Omit<ChatMessage, 'id'> = {
      senderId: currentUser.id,
      senderName: currentUser.name,
      content: `<img src="${gif.images.fixed_height.url}" alt="GIF" style="max-height: 150px;" />`,
      timestamp: new Date(),
      recipientId: selectedPerson?.id
    };
    onSendMessage(newMessage);
    setShowGifPicker(false);
  };

  const handleSend = () => {
    if (inputValue.trim()) {
      const newMessage: Omit<ChatMessage, 'id'> = {
        senderId: currentUser.id,
        senderName: currentUser.name,
        content: inputValue,
        timestamp: new Date(),
        recipientId: selectedPerson?.id
      };
      onSendMessage(newMessage);
      setInputValue('');
    }
  };

  return (
    <div
      ref={panelRef}
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        cursor: isDragging ? 'grabbing' : 'default'
      }}
      className={`w-96 bg-white rounded-lg shadow-xl overflow-hidden z-50 transition-all duration-200 ${
      isMinimized ? 'h-12' : 'h-[480px]'
    }`}>
      <div
        onMouseDown={handleMouseDown}
        className="chat-header flex items-center justify-between px-4 py-2 border-b border-gray-200 bg-indigo-600 text-white cursor-grab active:cursor-grabbing"
      >
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center space-x-2 text-white hover:text-gray-100"
          >
            <span className="text-lg font-semibold">
              {selectedChannel ? (
                <div className="flex items-center space-x-2">
                  <Hash className="w-4 h-4" />
                  <span>{selectedChannel.name}</span>
                </div>
              ) : selectedPerson ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded-full bg-white text-indigo-600 flex items-center justify-center text-xs">
                    {selectedPerson.name.charAt(0)}
                  </div>
                  <span>{selectedPerson.name}</span>
                </div>
              ) : (
                'Messages'
              )}
            </span>
            <ChevronDown className="w-4 h-4" />
          </button>

          {showDropdown && (
            <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-lg z-50">
              <div className="p-2">
                <div className="mb-4">
                  <div className="px-3 py-2 text-xs font-semibold text-gray-500">Channels</div>
                  {defaultChannels.map(channel => (
                    <button
                      key={channel.id}
                      onClick={() => {
                        setSelectedChannel(channel);
                        onSelectPerson(null);
                        setShowDropdown(false);
                      }}
                      className="w-full flex items-center space-x-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                    >
                      <Hash className="w-4 h-4" />
                      <span>{channel.name}</span>
                    </button>
                  ))}
                </div>
                <div>
                  <div className="px-3 py-2 text-xs font-semibold text-gray-500">Direct Messages</div>
                  {personnel.map(person => (
                    <button
                      key={person.id}
                      onClick={() => {
                        onSelectPerson(person);
                        setSelectedChannel(null);
                        setShowDropdown(false);
                      }}
                      className="w-full flex items-center space-x-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                    >
                      <div className="w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center text-xs">
                        {person.name.charAt(0)}
                      </div>
                      <span>{person.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="text-white hover:text-gray-200"
          >
            {isMinimized ? (
              <Maximize2 className="w-4 h-4" />
            ) : (
              <Minimize2 className="w-4 h-4" />
            )}
          </button>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {!isMinimized && (
        <>
          <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ height: 'calc(480px - 120px)' }}>
            {!selectedChannel && !selectedPerson ? (
              <div className="h-full flex items-center justify-center text-gray-500">
                <p>Select a channel or person to start chatting</p>
              </div>
            ) : loading ? (
              <div className="h-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              </div>
            ) : (
              messages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex ${msg.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg px-4 py-2 ${
                      msg.senderId === currentUser.id
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <div className="text-xs opacity-75 mb-1">
                      {msg.senderId === currentUser.id ? 'You' : msg.senderName}
                    </div>
                    <div dangerouslySetInnerHTML={{ __html: msg.content }} />
                    <div className="text-xs opacity-75 mt-1">
                      {msg.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
            {(selectedChannel || selectedPerson) && (
            <div className="flex space-x-2">
              <div className="relative">
                <button
                  onClick={() => {
                    setShowEmojiPicker(!showEmojiPicker);
                    setShowGifPicker(false);
                  }}
                  className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
                >
                  <Smile className="w-5 h-5" />
                </button>
                {showEmojiPicker && (
                  <div className="absolute bottom-12 left-0 z-50">
                    <Picker
                      data={data}
                      onEmojiSelect={handleEmojiSelect}
                      theme="light"
                    />
                  </div>
                )}
              </div>
              <div className="relative">
                <button
                  onClick={() => {
                    setShowGifPicker(!showGifPicker);
                    setShowEmojiPicker(false);
                  }}
                  className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
                >
                  <Image className="w-5 h-5" />
                </button>
                {showGifPicker && (
                  <div className="absolute bottom-12 left-0 z-50 bg-white rounded-lg shadow-xl p-4 w-[320px] h-[400px] overflow-y-auto">
                    <Grid width={300} columns={2} fetchGifs={(offset) => gf.trending({ offset, limit: 10 })} onGifClick={(gif, e) => handleGifSelect(gif)} />
                  </div>
                )}
              </div>

              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSend();
                  }
                }}
                placeholder="Mesajınızı yazın..."
                className="flex-1 rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 min-h-[40px]"
              />
              <button
                onClick={handleSend}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Gönder
              </button>
            </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ChatPanel;