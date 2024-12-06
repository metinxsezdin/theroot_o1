import React from 'react';
import { Booking, Personnel, Department } from '../types';
import { Trash2 } from 'lucide-react';
import { 
  formatTime, 
  calculateBookingPosition,
  getOverlappingBookings,
  calculateBookingWidth,
  calculateBookingOffset,
  getDepartmentAbbreviation
} from '../utils/timeUtils';

interface DailyViewProps {
  personnel: Personnel[];
  bookings: Booking[];
  currentDate: Date;
  departments: Department[];
  onDeleteBooking: (id: string) => void;
}

const CELL_HEIGHT = 160;

const DailyView = ({ personnel, bookings, currentDate, departments, onDeleteBooking }: DailyViewProps) => {
  const getBookingsForDay = (personId: string) => {
    return bookings.filter(
      (booking) =>
        booking.resourceId === personId &&
        new Date(booking.startDate).toDateString() === currentDate.toDateString()
    );
  };

  return (
    <div className="flex-1 overflow-x-auto">
      <div className="min-w-max">
        {/* Timeline Header */}
        <div className="flex border-b border-gray-200 bg-white sticky top-0 z-10">
          <div className="w-48 flex-shrink-0" />
          <div className="flex-1 px-4 py-2 text-sm font-medium text-gray-900 border-r border-gray-200">
            {currentDate.toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric'
            })}
          </div>
        </div>

        {/* Timeline Grid */}
        <div className="relative">
          {personnel.map((person) => (
            <div key={person.id} className="flex border-b border-gray-200">
              <div className="w-48 flex-shrink-0 px-4 py-3 bg-white sticky left-0 z-10">
                <div className="font-medium text-sm text-gray-900">
                  {person.name}
                </div>
                <div className="text-xs text-gray-500">
                  {formatTime(person.availability.start)} - {formatTime(person.availability.end)}
                </div>
              </div>
              <div
                className="flex-1 border-r border-gray-200 bg-white relative"
                style={{ height: `${CELL_HEIGHT}px` }}
              >
                {getBookingsForDay(person.id).map((booking) => {
                  const { top, height } = calculateBookingPosition(booking, CELL_HEIGHT);
                  const overlappingBookings = getOverlappingBookings(booking, getBookingsForDay(person.id));
                  const width = calculateBookingWidth(booking, overlappingBookings);
                  const left = calculateBookingOffset(booking, overlappingBookings);
                  const department = departments.find(d => d.id === person.departmentId);

                  return (
                    <div
                      key={booking.id}
                      className="absolute px-2 py-1 text-xs rounded shadow-sm transition-all group hover:z-10"
                      style={{
                        backgroundColor: booking.color,
                        top: `${top}px`,
                        height: `${height}px`,
                        width,
                        left,
                      }}
                    >
                      <div className="flex items-center justify-between h-full">
                        <div className="overflow-hidden w-full">
                          <div className="text-[10px] opacity-75 font-medium mb-0.5">
                            {getDepartmentAbbreviation(department?.name || '')}
                          </div>
                          <div className="font-medium truncate">{booking.projectName}</div>
                          <div className="text-xs opacity-75">
                            {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                          </div>
                        </div>
                        <button
                          onClick={() => onDeleteBooking(booking.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity ml-1"
                        >
                          <Trash2 className="w-3 h-3 text-gray-700 hover:text-red-600" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DailyView;