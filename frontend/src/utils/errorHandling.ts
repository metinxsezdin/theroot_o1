import { AxiosError } from 'axios';
import { toast } from 'react-toastify';

interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, string[]>;
}

export function handleApiError(error: AxiosError<ApiError>) {
  if (error.response) {
    const status = error.response.status;
    const data = error.response.data;

    switch (status) {
      case 401:
        toast.error('Please log in to continue');
        localStorage.removeItem('token');
        window.location.href = '/login';
        break;
      case 403:
        toast.error('You do not have permission to perform this action');
        break;
      case 404:
        toast.error(data.message || 'Resource not found');
        break;
      case 422:
        if (data.details) {
          Object.entries(data.details).forEach(([field, errors]) => {
            errors.forEach(error => toast.error(`${field}: ${error}`));
          });
        } else {
          toast.error(data.message || 'Validation error');
        }
        break;
      case 500:
        toast.error('An unexpected error occurred. Please try again later.');
        break;
      default:
        toast.error(data.message || 'An error occurred');
    }
  } else if (error.request) {
    toast.error('Unable to connect to the server. Please check your connection.');
  } else {
    toast.error('An unexpected error occurred');
  }

  throw error;
}