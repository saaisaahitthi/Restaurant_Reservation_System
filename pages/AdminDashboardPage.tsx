import React, { useState, useEffect, useCallback } from 'react';
import { mockApi } from '../services/mockApi';
import type { Reservation } from '../types';
import ReservationList from '../components/ReservationList';
import toast from 'react-hot-toast';

const AdminDashboardPage: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const fetchReservations = useCallback(async () => {
    setIsLoading(true);
    try {
      const allReservations = await mockApi.getReservationsForAdmin();
      setReservations(allReservations.sort((a, b) => b.startTime.getTime() - a.startTime.getTime()));
    } catch (error) {
      toast.error("Failed to fetch reservations.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);
  
  const handleCancel = async (reservationId: string) => {
    try {
      await mockApi.cancelReservation(reservationId);
      toast.success('Reservation cancelled successfully.');
      fetchReservations(); // Refetch to update list
    } catch (error) {
      toast.error('Failed to cancel reservation.');
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">All Reservations</h2>
        {isLoading ? (
          <div className="text-center">Loading reservations...</div>
        ) : (
          <ReservationList reservations={reservations} onCancel={handleCancel} userRole="admin" />
        )}
      </div>
    </div>
  );
};

export default AdminDashboardPage;
