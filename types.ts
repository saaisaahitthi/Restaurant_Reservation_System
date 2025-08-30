export enum Role {
  CUSTOMER = 'customer',
  ADMIN = 'admin',
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
}

export interface Table {
  id: string;
  label: string;
  capacity: number;
}

export enum ReservationStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
}

export interface Reservation {
  id: string;
  userId: string;
  user?: User;
  tableId: string;
  table?: Table;
  startTime: Date;
  endTime: Date;
  guests: number;
  status: ReservationStatus;
  notes?: string;
}

export interface AvailabilitySlot {
  time: string;
  tableId: string;
}
