import React, { useState } from 'react';
import { Hash, Plus, Search } from 'lucide-react';
import { ChatMessage, ChatChannel, Personnel } from '../types';

interface ChatPageProps {
  messages: ChatMessage[];
  loading: boolean;
  onSendMessage: (message: Omit<ChatMessage, 'id'>) => void;
  selectedPerson: Personnel | null;
  onSelectPerson: (person: Personnel | null) => void;
  currentUser: { id: string; name: string };
  personnel: Personnel[];
}

const defaultChannels: ChatChannel[] = [
  { id: '1', name: 'genel', description: 'Genel konuşmalar', isPrivate: false, members: [] },
  { id: '2', name: 'projeler', description: 'Proje tartışmaları', isPrivate: false, members: [] },
  { id: '3', name: 'duyurular', description: 'Önemli duyurular', isPrivate: false, members: [] },
];

const ChatPage = ({
  messages,
  loading,
  onSendMessage,
  selectedPerson,
  onSelectPerson,
  currentUser,
  personnel
}: ChatPageProps) => {
  const [selectedChannel, setSelectedChannel] = useState<ChatChannel | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPersonnel = personnel.filter(person =>
    person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    person.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSend = () => {
    if (inputValue.trim()) {
      const newMessage: Omit<ChatMessage, 'id'> = {
        senderId: currentUser.id,
        senderName: currentUser.name,
        content: inputValue,
        timestamp: new Date(),
        channelId: selectedChannel?.id,
        recipientId: selectedPerson?.id
      };

      onSendMessage(newMessage);
      setInputValue('');
    }
  };

  return (
    <div className="flex-1 bg-gray-50 flex overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col overflow-y-auto">
        <div className="p-4">
          <div className="flex items-center justify-between text-gray-900 mb-4">
            <h2 className="text-xl font-semibold">Messages</h2>
          </div>
          
          {/* Search */}
          <div className="relative mb-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="w-full px-3 py-2 bg-gray-50 text-gray-900 rounded-md border border-gray-300 placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500"
            />
            <Search className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" />
          </div>

          {/* Channels */}
          <div className="mb-6">
            <div className="flex items-center justify-between text-gray-500 mb-2">
              <span className="text-sm font-medium">Channels</span>
              <button className="hover:text-gray-700">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-1">
              {defaultChannels.map(channel => (
                <button
                  key={channel.id}
                  onClick={() => {
                    setSelectedChannel(channel);
                    onSelectPerson(null);
                  }}
                  className={`w-full flex items-center px-2 py-1 rounded-md ${
                    selectedChannel?.id === channel.id
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Hash className="w-4 h-4 mr-2" />
                  <span>{channel.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Direct Messages */}
          <div>
            <div className="flex items-center justify-between text-gray-500 mb-2">
              <span className="text-sm font-medium">Direct Messages</span>
              <button className="hover:text-gray-700">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-1">
              {filteredPersonnel.map(person => (
                <button
                  key={person.id}
                  onClick={() => {
                    onSelectPerson(person);
                    setSelectedChannel(null);
                  }}
                  className={`w-full flex items-center px-2 py-1 rounded-md ${
                    selectedPerson?.id === person.id
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-gray-200 text-gray-600 mr-2 flex items-center justify-center text-xs">
                    {person.name.charAt(0)}
                  </div>
                  <span>{person.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Chat Header */}
        {(selectedChannel || selectedPerson) && (
          <div className="border-b border-gray-200 px-6 py-4 flex items-center">
            {selectedChannel ? (
              <>
                <Hash className="w-5 h-5 text-gray-400 mr-2" />
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{selectedChannel.name}</h3>
                  {selectedChannel.description && (
                    <p className="text-sm text-gray-500">{selectedChannel.description}</p>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                  <span className="text-indigo-600 font-medium">
                    {selectedPerson?.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{selectedPerson?.name}</h3>
                  <p className="text-sm text-gray-500">{selectedPerson?.role}</p>
                </div>
              </>
            )}
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6">
          {(selectedChannel || selectedPerson) ? (
            loading ? (
              <div className="h-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map(msg => (
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
                ))}
              </div>
            )
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              <p>Select a channel or person to start chatting</p>
            </div>
          )}
        </div>

        {/* Input Area */}
        {(selectedChannel || selectedPerson) && (
          <div className="border-t border-gray-200 px-6 py-4">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSend();
                  }
                }}
                placeholder="Type your message..."
                className="flex-1 rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
              />
              <button
                onClick={handleSend}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Send
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;