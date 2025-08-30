import React, { useState, useEffect, useCallback } from 'react';
import { mockApi } from '../services/mockApi';
import { useAuth } from '../hooks/useAuth';
import type { Reservation } from '../types';
import ReservationList from '../components/ReservationList';
import toast from 'react-hot-toast';

const MyReservationsPage: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  const fetchReservations = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const userReservations = await mockApi.getReservationsForUser(user.id);
      setReservations(userReservations.sort((a, b) => b.startTime.getTime() - a.startTime.getTime()));
    } catch (error) {
      toast.error("Failed to fetch your reservations.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);
  
  const handleCancel = async (reservationId: string) => {
    try {
      await mockApi.cancelReservation(reservationId);
      toast.success('Reservation cancelled successfully.');
      fetchReservations();
    } catch (error) {
      toast.error('Failed to cancel reservation.');
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">My Reservations</h1>
        {isLoading ? (
          <div className="text-center">Loading reservations...</div>
        ) : (
          <ReservationList reservations={reservations} onCancel={handleCancel} userRole="customer" />
        )}
      </div>
    </div>
  );
};

export default MyReservationsPage;
