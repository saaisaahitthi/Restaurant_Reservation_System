import React from 'react';
import type { Reservation, Role } from '../types';
import { ReservationStatus } from '../types';

interface ReservationListProps {
  reservations: Reservation[];
  onCancel?: (reservationId: string) => void;
  userRole: Role;
}

const statusStyles: { [key in ReservationStatus]: string } = {
  [ReservationStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
  [ReservationStatus.CONFIRMED]: 'bg-green-100 text-green-800',
  [ReservationStatus.CANCELLED]: 'bg-red-100 text-red-800',
  [ReservationStatus.COMPLETED]: 'bg-blue-100 text-blue-800',
};

const ReservationCard: React.FC<{ reservation: Reservation; onCancel?: (id: string) => void; userRole: Role }> = ({ reservation, onCancel, userRole }) => {
  const canCancel = reservation.status === ReservationStatus.CONFIRMED || reservation.status === ReservationStatus.PENDING;
  
  return (
    <li className="bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <div className="flex items-center gap-3 mb-2">
            <span
                className={`px-3 py-1 text-xs font-semibold rounded-full ${statusStyles[reservation.status]}`}
            >
                {reservation.status}
            </span>
            <p className="font-bold text-lg text-gray-800">
                {new Date(reservation.startTime).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </p>
        </div>
        <p className="text-gray-600">
          <span className="font-semibold">{reservation.guests} guests</span> at <span className="font-semibold">{new Date(reservation.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span> on Table <span className="font-semibold">{reservation.table?.label}</span>
        </p>
        {userRole === 'admin' && reservation.user && (
           <p className="text-sm text-gray-500 mt-1">Booked by: <span className="font-medium">{reservation.user.name}</span> ({reservation.user.email})</p>
        )}
      </div>
      {onCancel && canCancel && (
        <button onClick={() => onCancel(reservation.id)} className="bg-red-600 text-white text-sm font-medium py-2 px-4 rounded-md hover:bg-red-700 transition-colors self-start sm:self-center">
            Cancel
        </button>
      )}
    </li>
  );
};


const ReservationList: React.FC<ReservationListProps> = ({ reservations, onCancel, userRole }) => {
  if (reservations.length === 0) {
    return <p className="text-center text-gray-500 py-8">No reservations found.</p>;
  }
  
  return (
    <ul className="space-y-4">
      {reservations.map((reservation) => (
        <ReservationCard key={reservation.id} reservation={reservation} onCancel={onCancel} userRole={userRole} />
      ))}
    </ul>
  );
};

export default ReservationList;
