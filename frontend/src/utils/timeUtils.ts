
export function formatTime(time: string | undefined): string {
  if (!time) {
    return 'N/A'; // Handle undefined or missing time values
  }
  
  try {
    const [hours, minutes] = time.split(':');
    return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
  } catch {
    return time;
  }
}

export function calculateBookingWidth(startTime: string, endTime: string): number {
  const start = new Date(`1970-01-01T${startTime}`);
  const end = new Date(`1970-01-01T${endTime}`);
  return (end.getTime() - start.getTime()) / 60000; // Duration in minutes
}

export function getDepartmentAbbreviation(departmentName: string): string {
  return departmentName
    .split(' ')
    .map(word => word[0].toUpperCase())
    .join(''); // Return abbreviation of department name
}

export function getOverlappingBookings(bookings: { startTime: string; endTime: string }[]): number[] {
  const overlapping: number[] = [];
  bookings.forEach((booking, index) => {
    bookings.forEach((otherBooking, otherIndex) => {
      if (
        index !== otherIndex &&
        booking.startTime < otherBooking.endTime &&
        booking.endTime > otherBooking.startTime
      ) {
        overlapping.push(index);
      }
    });
  });
  return overlapping;
}

export function generateTimeSlots(startTime: string, endTime: string, interval: number): string[] {
  const slots = [];
  let current = new Date(`1970-01-01T${startTime}`);
  const end = new Date(`1970-01-01T${endTime}`);

  while (current < end) {
    slots.push(formatTime(current.toISOString().slice(11, 16))); // Extract HH:mm format
    current = new Date(current.getTime() + interval * 60000); // Add interval in minutes
  }

  return slots;
}


export function calculateBookingPosition(booking: any, cellHeight: number) {
    const startTime = new Date(booking.startTime);
    const endTime = new Date(booking.endTime);
    const duration = (endTime.getTime() - startTime.getTime()) / 60000; // Duration in minutes

    const top = startTime.getHours() * cellHeight + (startTime.getMinutes() / 60) * cellHeight;
    const height = (duration / 60) * cellHeight;

    return { top, height };
}

export function calculateBookingOffset(booking: any, overlappingBookings: any[]) {
    const index = overlappingBookings.findIndex(b => b.id === booking.id);
    return index * 10; // Example offset, adjust as needed
}
