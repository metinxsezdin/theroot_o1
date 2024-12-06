import React from 'react';
import { Users, Calendar, Settings, Briefcase, Building2, MessageSquare } from 'lucide-react';
import { useCallback } from 'react';

interface SidebarProps {
  currentView: 'schedule' | 'personnel' | 'projects' | 'clients' | 'settings' | 'chat';
  onViewChange: (view: 'schedule' | 'personnel' | 'projects' | 'clients' | 'settings' | 'chat') => void;
}

const Sidebar = ({ currentView, onViewChange }: SidebarProps) => {
  const handleNavigation = useCallback((view: typeof currentView) => {
    if (typeof onViewChange === 'function') {
      onViewChange(view);
    }
  }, [onViewChange]);

  return (
    <div className="w-64 bg-white h-screen border-r border-gray-200 p-4">
      <div className="flex items-center space-x-2 mb-8">
        <Users className="w-6 h-6 text-indigo-600" />
        <h1 className="text-xl font-bold text-gray-800">TheRoots</h1>
      </div>
      
      <nav className="space-y-2">
        <NavItem
          icon={<Calendar />}
          text="Takvim"
          isActive={currentView === 'schedule'}
          onClick={() => handleNavigation('schedule')}
        />
        <NavItem
          icon={<Users />}
          text="Personel"
          isActive={currentView === 'personnel'}
          onClick={() => handleNavigation('personnel')}
        />
        <NavItem
          icon={<Briefcase />}
          text="Projeler"
          isActive={currentView === 'projects'}
          onClick={() => handleNavigation('projects')}
        />
        <NavItem
          icon={<Building2 />}
          text="Müşteriler"
          isActive={currentView === 'clients'}
          onClick={() => handleNavigation('clients')}
        />
        <NavItem
          icon={<MessageSquare />}
          text="Mesajlar"
          isActive={currentView === 'chat'}
          onClick={() => handleNavigation('chat')}
        />
        <NavItem
          icon={<Settings />}
          text="Ayarlar"
          isActive={currentView === 'settings'}
          onClick={() => handleNavigation('settings')}
        />
      </nav>
    </div>
  );
};

interface NavItemProps {
  icon: React.ReactNode;
  text: string;
  isActive?: boolean;
  onClick?: () => void;
}

const NavItem = ({ icon, text, isActive = false, onClick }: NavItemProps) => {
  return (
    <div
      onClick={onClick}
      className={`flex items-center space-x-3 px-4 py-2 rounded-lg cursor-pointer ${
        isActive ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50'
      }`}
    >
      {icon}
      <span className="font-medium">{text}</span>
    </div>
  );
};

export default Sidebar;