import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import PersonnelList from './components/PersonnelList';
import Timeline from './components/Timeline';
import DailyView from './components/DailyView';
import BookingModal from './components/BookingModal';
import ClientsPage from './pages/ClientsPage';
import PersonnelPage from './pages/PersonnelPage';
import SettingsPage from './pages/SettingsPage';
import ProjectsPage from './pages/ProjectsPage';
import ChatPage from './pages/ChatPage';
import AuthPage from './AuthPage';
import { usePersonnel } from './hooks/usePersonnel';
import { useBookings } from './hooks/useBookings';
import { useDepartments } from './hooks/useDepartments';
import { useProjects } from './hooks/useProjects';
import { useClients } from './hooks/useClients';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const App = () => {
  const [currentView, setCurrentView] = useState<'schedule' | 'personnel' | 'projects' | 'clients' | 'settings' | 'chat'>('schedule');
  const navigate = useNavigate();
  const location = useLocation();

  // Sync route with current view
  useEffect(() => {
    const pathToView: Record<string, typeof currentView> = {
      '/': 'schedule',
      '/personnel': 'personnel',
      '/projects': 'projects',
      '/clients': 'clients',
      '/settings': 'settings',
      '/chat': 'chat'
    };
    setCurrentView(pathToView[location.pathname] || 'schedule');
  }, [location.pathname]);

  const handleViewChange = (view: typeof currentView) => {
    const viewToPath: Record<typeof currentView, string> = {
      schedule: '/',
      personnel: '/personnel',
      projects: '/projects',
      clients: '/clients',
      settings: '/settings',
      chat: '/chat'
    };
    setCurrentView(view);
    navigate(viewToPath[view]);
  };

  const {
    personnel,
    loading: loadingPersonnel,
    error: personnelError
  } = usePersonnel();

  const {
    departments,
    loading: loadingDepartments,
    error: departmentsError
  } = useDepartments();

  const {
    bookings,
    loading: loadingBookings,
    error: bookingsError
  } = useBookings();

  const {
    projects,
    loading: loadingProjects,
    error: projectsError
  } = useProjects();

  const {
    clients,
    loading: loadingClients,
    error: clientsError
  } = useClients();

  // Check if user is authenticated
  const token = localStorage.getItem('token');
  if (!token) {
    return <AuthPage />;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar currentView={currentView} onViewChange={handleViewChange} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Routes>
          <Route path="/personnel" element={
            <PersonnelPage 
              personnel={personnel}
              departments={departments}
              loading={loadingPersonnel || loadingDepartments}
              error={personnelError || departmentsError}
            />
          } />
          <Route path="/projects" element={
            <ProjectsPage 
              projects={projects}
              resources={personnel}
              clients={clients}
              loading={loadingProjects}
              error={projectsError}
            />
          } />
          <Route path="/clients" element={
            <ClientsPage 
              clients={clients || []}
              loading={loadingClients}
              error={clientsError}
            />
          } />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/" element={
            <>
              <Header />
              <div className="flex-1 flex overflow-hidden bg-gray-50">
                <PersonnelList
                  personnel={personnel || []}
                  departments={departments || []}
                  loading={loadingPersonnel || loadingDepartments}
                />
                <Timeline
                  personnel={personnel || []}
                  bookings={bookings || []}
                  departments={departments || []}
                  loading={loadingBookings}
                  onDeleteBooking={(id) => console.log('Delete booking:', id)}
                />
              </div>
            </>
          } />
        </Routes>
      </div>
    </div>
  );
};

export default App;