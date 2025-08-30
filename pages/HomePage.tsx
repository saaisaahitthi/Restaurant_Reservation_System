import React, { useState } from 'react';
import { mockApi } from '../services/mockApi';
import { useAuth } from '../hooks/useAuth';
import { ReservationForm } from '../components/ReservationForm';
import { AvailabilityDisplay } from '../components/AvailabilityDisplay';
import type { AvailabilitySlot, Reservation } from '../types';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
  const [searchParams, setSearchParams] = useState<{ date: string; guests: number } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSearch = async (date: Date, guests: number) => {
    setIsLoading(true);
    setAvailability([]);
    const dateString = date.toISOString().split('T')[0];
    setSearchParams({ date: dateString, guests });
    try {
      const slots = await mockApi.getAvailability(date, guests);
      setAvailability(slots);
      if (slots.length === 0) {
        toast.error('No tables available for the selected date and party size.');
      }
    } catch (error) {
      toast.error('Could not fetch availability. Please try again.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBook = async (time: string, tableId: string) => {
    if (!user) {
      toast.error('Please log in to make a reservation.');
      navigate('/auth');
      return;
    }
    if (!searchParams) return;
    
    try {
      const newReservation = await mockApi.createReservation({
        userId: user.id,
        tableId,
        date: searchParams.date,
        time,
        guests: searchParams.guests,
        notes: "Booked online",
      });
      toast.success(`Reservation confirmed for ${newReservation.guests} guests at ${new Date(newReservation.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}!`);
      setAvailability([]);
      setSearchParams(null);
      navigate('/my-reservations');
    } catch (error) {
       const errorMessage = error instanceof Error ? error.message : 'Failed to book reservation.';
       toast.error(errorMessage);
    }
  };

  return (
    <div>
      <div className="relative bg-[url('https://picsum.photos/1600/800?image=20')] bg-cover bg-center h-96">
        <div className="absolute inset-0 bg-black/60 flex flex-col justify-center items-center text-center">
          <h1 className="text-5xl font-extrabold text-white tracking-tight leading-tight">Experience Exquisite Dining</h1>
          <p className="mt-4 text-xl text-gray-200 max-w-2xl">
            Reserve your table at The Gilded Spoon and savor an unforgettable culinary journey.
          </p>
        </div>
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-20 relative z-10">
        <ReservationForm onSearch={handleSearch} isLoading={isLoading} />
        {isLoading && (
            <div className="text-center p-8">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-800 mx-auto"></div>
                <p className="mt-4 text-lg text-gray-600">Finding available tables...</p>
            </div>
        )}
        {availability.length > 0 && searchParams && (
          <AvailabilityDisplay
            slots={availability}
            onBook={handleBook}
            date={searchParams.date}
            guests={searchParams.guests}
          />
        )}
      </div>
    </div>
  );
};

export default HomePage;
