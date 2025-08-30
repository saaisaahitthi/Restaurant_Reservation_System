import React from 'react';
import type { AvailabilitySlot } from '../types';
import { ClockIcon } from './icons/ClockIcon';

interface AvailabilityDisplayProps {
  slots: AvailabilitySlot[];
  date: string;
  guests: number;
  onBook: (time: string, tableId: string) => void;
}

export const AvailabilityDisplay: React.FC<AvailabilityDisplayProps> = ({ slots, onBook, date, guests }) => {
  const formattedDate = new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="mt-8 bg-white p-6 sm:p-8 rounded-xl shadow-lg animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Available Times</h2>
      <p className="text-gray-600 mb-6">
        For a party of <span className="font-semibold text-amber-800">{guests}</span> on <span className="font-semibold text-amber-800">{formattedDate}</span>
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {slots.map((slot) => (
          <button
            key={`${slot.time}-${slot.tableId}`}
            onClick={() => onBook(slot.time, slot.tableId)}
            className="flex items-center justify-center gap-2 bg-amber-100 text-amber-800 font-semibold py-3 px-4 rounded-md hover:bg-amber-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-all duration-200 transform hover:scale-105"
          >
            <ClockIcon />
            {slot.time}
          </button>
        ))}
      </div>
    </div>
  );
};
