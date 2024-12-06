import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Booking, Personnel, Department } from '../types';
import { 
  formatTime, 
  calculateBookingPosition,
  getOverlappingBookings,
  calculateBookingWidth,
  calculateBookingOffset,
  getDepartmentAbbreviation
} from '../utils/timeUtils';
import ZoomControls from './ZoomControls';

interface TimelineProps {
  personnel: Personnel[];
  bookings: Booking[];
  startDate?: Date;
  daysToShow?: number;
  departments: Department[];
  onDeleteBooking: (id: string) => void;
}

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 2;
const BASE_CELL_HEIGHT = 160;

const Timeline = ({ 
  personnel = [], 
  bookings = [], 
  startDate = new Date(), 
  daysToShow = 7, 
  departments = [], 
  onDeleteBooking 
}: TimelineProps) => {
  const [zoomLevel, setZoomLevel] = useState(1);

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.2, MAX_ZOOM));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.2, MIN_ZOOM));
  };

  const dates = Array.from({ length: daysToShow }, (_, i) => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    return date;
  });

  const getBookingsForCell = (personId: string, date: Date) => {
    return bookings.filter(
      (booking) =>
        booking.resourceId === personId &&
        new Date(booking.startDate).toDateString() === date.toDateString()
    );
  };

  const cellHeight = BASE_CELL_HEIGHT * zoomLevel;

  return (
    <>
    {!personnel?.length ? (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        <p>No personnel data available</p>
      </div>
    ) : (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Fixed Zoom Controls */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-200 p-2 flex justify-end shadow-sm">
        <ZoomControls
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          zoomLevel={zoomLevel}
          minZoom={MIN_ZOOM}
          maxZoom={MAX_ZOOM}
        />
      </div>

      <div className="flex-1 overflow-auto">
        <div className="min-w-max">
          {/* Timeline Header */}
          <div className="flex border-b border-gray-200 bg-white sticky top-0 z-10">
            <div className="w-48 flex-shrink-0" />
            {dates.map((date) => (
              <div
                key={date.toISOString()}
                className="w-48 flex-shrink-0 px-4 py-2 text-sm font-medium text-gray-900 border-r border-gray-200"
              >
                {date.toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                })}
              </div>
            ))}
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
                {dates.map((date) => {
                  const cellBookings = getBookingsForCell(person.id, date);
                  return (
                    <div
                      key={`${person.id}-${date.toISOString()}`}
                      className="w-48 flex-shrink-0 border-r border-gray-200 bg-white relative"
                      style={{ height: `${cellHeight}px` }}
                    >
                      {cellBookings.map((booking) => {
                        const { top, height } = calculateBookingPosition(booking, cellHeight);
                        const overlappingBookings = getOverlappingBookings(cellBookings);
                        const width = calculateBookingWidth(booking.startTime, booking.endTime);
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
                              width: `${width}%`,
                              left: `${left}px`,
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
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    )}
    </>
  );
};

export default Timeline;