export interface Personnel {
  id: string;
  name: string;
  role: string;
  departmentId: string;
  profileImage?: {
    url: string;
    name: string;
  };
  availability: {
    start: string;
    end: string;
  };
}

export interface Department {
  id: string;
  name: string;
  color: string;
  description?: string;
}

export interface Booking {
  id: string;
  resourceId: string;
  projectName: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  color: string;
  clientName?: string;
}

export interface Project {
  id: string;
  name: string;
  color: string;
  clientName: string;
  startDate?: string;
  endDate?: string;
  billable: boolean;
  activityTypes: string[];
  description?: string;
  budget?: number;
  status: 'active' | 'completed' | 'on-hold';
  personnel?: Personnel[];
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  logo?: string;
  color: string;
  description?: string;
  employees?: ClientEmployee[];
}

export interface ClientEmployee {
  id: string;
  name: string;
  role: string;
  email: string;
  phone?: string;
  department?: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
  status?: 'sent' | 'delivered' | 'read';
  channelId?: string;
  recipientId?: string;
}

export interface ChatChannel {
  id: string;
  name: string;
  description?: string;
  isPrivate: boolean;
  members: string[];
}

export type ColorFilterType = 'none' | 'client' | 'project';