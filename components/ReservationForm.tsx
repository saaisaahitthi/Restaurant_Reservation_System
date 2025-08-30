import React, { useState } from 'react';
import { CalendarIcon } from './icons/CalendarIcon';
import { UserIcon } from './icons/UserIcon';

interface ReservationFormProps {
  onSearch: (date: Date, guests: number) => void;
  isLoading: boolean;
}

export const ReservationForm: React.FC<ReservationFormProps> = ({ onSearch, isLoading }) => {
  const [guests, setGuests] = useState(2);
  const today = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(today);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(new Date(date), guests);
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
        <div>
          <label htmlFor="guests" className="block text-sm font-medium text-gray-700 mb-1">Party Size</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <UserIcon />
            </div>
            <select
              id="guests"
              name="guests"
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
            >
              {[...Array(10)].map((_, i) => (
                <option key={i + 1} value={i + 1}>{i + 1} {i + 1 > 1 ? 'people' : 'person'}</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Date</label>
           <div className="relative">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <CalendarIcon />
             </div>
             <input
              type="date"
              id="date"
              name="date"
              value={date}
              min={today}
              onChange={(e) => setDate(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
            />
           </div>
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-amber-800 text-white font-bold py-2 px-4 rounded-md hover:bg-amber-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors disabled:bg-amber-400 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Searching...' : 'Find a Table'}
        </button>
      </form>
    </div>
  );
};
