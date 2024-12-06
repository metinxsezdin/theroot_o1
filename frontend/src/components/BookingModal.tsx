import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Personnel, Booking, Project, Client, Department } from '../types';
import { formatDate, generateColor } from '../utils/helpers';
import { generateTimeSlots, formatTime } from '../utils/timeUtils';

interface BookingModalProps {
  personnel: Personnel[];
  departments: Department[];
  projects: Project[];
  clients: Client[];
  onClose: () => void;
  onSave: (booking: Omit<Booking, 'id'>) => void;
}

const BookingModal = ({ personnel, departments, projects, clients, onClose, onSave }: BookingModalProps) => {
  const timeSlots = generateTimeSlots();
  const [formData, setFormData] = useState({
    bookingType: 'individual' as 'individual' | 'department',
    departmentId: departments[0]?.id || '',
    resourceId: personnel[0]?.id || '',
    clientName: clients[0]?.name || '',
    projectName: projects.find(p => p.clientName === clients[0]?.name)?.name || '',
    startDate: formatDate(new Date()),
    endDate: formatDate(new Date()),
    startTime: '09:00',
    endTime: '17:00',
  });

  const handleClientChange = (clientName: string) => {
    const clientProjects = projects.filter(p => p.clientName === clientName);
    setFormData(prev => ({
      ...prev,
      clientName,
      projectName: clientProjects[0]?.name || ''
    }));
  };

  const filteredProjects = projects.filter(p => p.clientName === formData.clientName);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.bookingType === 'department') {
      // Create bookings for all personnel in department
      const departmentPersonnel = personnel.filter(p => p.departmentId === formData.departmentId);
      departmentPersonnel.forEach(person => {
        const newBooking: Omit<Booking, 'id'> = {
          ...formData,
          resourceId: person.id,
          color: generateColor(),
        };
        onSave(newBooking);
      });
    } else {
      const newBooking: Omit<Booking, 'id'> = {
        ...formData,
        color: generateColor(),
      };
      onSave(newBooking);
    }
    
    onClose();
  };

  const selectedPerson = personnel.find(p => p.id === formData.resourceId);
  const availableTimeSlots = timeSlots.filter(time => 
    selectedPerson ? time >= selectedPerson.availability.start && time <= selectedPerson.availability.end : true
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">New Booking</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Booking Type
              </label>
              <select
                value={formData.bookingType}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  bookingType: e.target.value as 'individual' | 'department' 
                }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="individual">Individual Personnel</option>
                <option value="department">Entire Department</option>
              </select>
            </div>

            {formData.bookingType === 'department' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Department
                </label>
                <select
                  value={formData.departmentId}
                  onChange={(e) => setFormData(prev => ({ ...prev, departmentId: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                >
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Personnel
                </label>
                <select
                  value={formData.resourceId}
                  onChange={(e) => setFormData(prev => ({ ...prev, resourceId: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                >
                  {personnel.map((person) => (
                    <option key={person.id} value={person.id}>
                      {person.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Client
              </label>
              <select
                value={formData.clientName}
                onChange={(e) => handleClientChange(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              >
                {clients.map((client) => (
                  <option key={client.id} value={client.name}>
                    {client.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Project
              </label>
              <select
                value={formData.projectName}
                onChange={(e) => setFormData(prev => ({ ...prev, projectName: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              >
                {filteredProjects.map((project) => (
                  <option key={project.id} value={project.name}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Start Date
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  End Date
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Start Time
                </label>
                <select
                  value={formData.startTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                >
                  {availableTimeSlots.map((time) => (
                    <option key={time} value={time}>
                      {formatTime(time)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  End Time
                </label>
                <select
                  value={formData.endTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                >
                  {availableTimeSlots
                    .filter((time) => time > formData.startTime)
                    .map((time) => (
                      <option key={time} value={time}>
                        {formatTime(time)}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
            >
              Create Booking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;