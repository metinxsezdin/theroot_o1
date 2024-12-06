
import { Department, Resource, Project, Booking, Personnel, Client, User } from '../types';

export const sampleDepartments: Department[] = [
  {
    id: '1',
    name: 'Engineering',
    description: 'Handles all engineering tasks'
  },
  {
    id: '2',
    name: 'Design',
    description: 'Creative design department'
  },
  {
    id: '3',
    name: 'Marketing',
    description: 'Marketing and outreach'
  }
];

export const sampleProjects: Project[] = [
  {
    id: 'proj1',
    name: 'Web Development',
    description: 'Developing a new website',
    startDate: '2024-01-01',
    endDate: '2024-06-01',
    status: 'Active'
  },
  {
    id: 'proj2',
    name: 'Mobile App',
    description: 'Creating a mobile application',
    startDate: '2023-08-01',
    endDate: '2023-12-01',
    status: 'Completed'
  }
];

export const samplePersonnel: Personnel[] = [
  {
    id: 'person1',
    name: 'Alice Johnson',
    position: 'Developer',
    department: 'Engineering',
    email: 'alice.johnson@example.com',
    phone: '555-1234',
    status: 'Active',
    availability: 'Full-time'
  },
  {
    id: 'person2',
    name: 'Bob Smith',
    position: 'Designer',
    department: 'Design',
    email: 'bob.smith@example.com',
    phone: '555-5678',
    status: 'Active',
    availability: 'Part-time'
  }
];

export const sampleBookings: Booking[] = [
  {
    id: 'booking1',
    resource: 'Meeting Room A',
    bookedBy: 'Alice Johnson',
    date: '2024-01-15',
    time: '10:00 AM - 12:00 PM' // Ensuring time is present
  },
  {
    id: 'booking2',
    resource: 'Conference Room B',
    bookedBy: 'Bob Smith',
    date: '2024-01-20',
    time: '2:00 PM - 4:00 PM' // Ensuring time is present
  }
];

export const sampleClients: Client[] = [
  {
    id: 'client1',
    name: 'Tech Solutions',
    email: 'contact@techsolutions.com',
    phone: '555-9876',
    companyName: 'Tech Solutions Ltd'
  },
  {
    id: 'client2',
    name: 'Creative Agency',
    email: 'info@creativeagency.com',
    phone: '555-6543',
    companyName: 'Creative Agency Inc'
  }
];

export const sampleUser: User = {
  id: 'user1',
  name: 'Admin User',
  email: 'admin@example.com',
  role: 'admin'
};
