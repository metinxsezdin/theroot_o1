import { useState, useCallback } from 'react';
import { AxiosError, AxiosResponse } from 'axios';
import { toast } from 'react-toastify';

interface UseApiOptions<T> {
  onSuccess?: (data: T, ...args: any[]) => void;
  onError?: (error: AxiosError) => void;
  successMessage?: string;
}

export function useApi<T = any>(
  apiCall: (...args: any[]) => Promise<AxiosResponse<T>>,
  options: UseApiOptions<T> = {}
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AxiosError | null>(null);

  const execute = useCallback(
    async (...args: any[]) => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiCall(...args);
        
        if (options.successMessage) {
          toast.success(options.successMessage);
        }
        
        if (options.onSuccess) {
          options.onSuccess(response.data, ...args);
        }
        
        return response.data;
      } catch (err) {
        const axiosError = err as AxiosError;
        setError(axiosError);
        
        if (options.onError) {
          options.onError(axiosError);
        } else {
          toast.error(axiosError.response?.data?.message || 'An error occurred');
        }
        
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [apiCall, options]
  );

  return {
    loading,
    error,
    execute
  };
}