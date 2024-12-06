import { useState, useEffect } from 'react';
import { Booking } from '../types';
import { bookingApi } from '../api/endpoints';
import { useApi } from './useApi';

export const useBookings = (initialBookings: Booking[]) => {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);

  const {
    execute: fetchBookings,
    loading: loadingBookings,
    error: bookingsError
  } = useApi(bookingApi.getAll, {
    onSuccess: (data) => setBookings(data)
  });

  const {
    execute: createBooking,
    loading: creatingBooking
  } = useApi(bookingApi.create, {
    successMessage: 'Booking created successfully',
    onSuccess: (newBooking) => {
      setBookings(prev => [...prev, newBooking]);
    }
  });

  const {
    execute: deleteBooking,
    loading: deletingBooking
  } = useApi(bookingApi.delete, {
    successMessage: 'Booking deleted successfully',
    onSuccess: (_, id) => {
      setBookings(prev => prev.filter(booking => booking.id !== id));
    }
  });

  const {
    execute: updateBooking,
    loading: updatingBooking
  } = useApi(bookingApi.update, {
    successMessage: 'Booking updated successfully',
    onSuccess: (updatedBooking) => {
      setBookings(prev => prev.map(booking =>
        booking.id === updatedBooking.id ? updatedBooking : booking
      ));
    }
  });

  useEffect(() => {
    fetchBookings();
  }, []);

  return {
    bookings,
    createBooking,
    deleteBooking,
    updateBooking,
    loading: loadingBookings || creatingBooking || deletingBooking || updatingBooking,
    error: bookingsError
  };
};