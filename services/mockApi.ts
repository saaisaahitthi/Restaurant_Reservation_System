import { Role, User, Table, Reservation, ReservationStatus, AvailabilitySlot } from '../types';

// --- MOCK DATABASE ---

const initialUsers: User[] = [
  { id: 'user-1', name: 'Alice Johnson', email: 'alice@example.com', phone: '555-0101', role: Role.CUSTOMER },
  { id: 'user-2', name: 'Bob Smith', email: 'bob@example.com', phone: '555-0102', role: Role.CUSTOMER },
  { id: 'admin-1', name: 'Charlie Brown', email: 'admin@example.com', phone: '555-0199', role: Role.ADMIN },
];

const initialTables: Table[] = [
  { id: 'table-1', label: 'T1', capacity: 2 },
  { id: 'table-2', label: 'T2', capacity: 2 },
  { id: 'table-3', label: 'T3', capacity: 4 },
  { id: 'table-4', label: 'T4', capacity: 4 },
  { id: 'table-5', label: 'T5', capacity: 6 },
  { id: 'table-6', label: 'T6', capacity: 8 },
];

const initialReservations: Reservation[] = [
  {
    id: 'res-1',
    userId: 'user-1',
    tableId: 'table-3',
    startTime: new Date(new Date().setHours(18, 30, 0, 0)),
    endTime: new Date(new Date().setHours(20, 0, 0, 0)),
    guests: 4,
    status: ReservationStatus.CONFIRMED,
  },
   {
    id: 'res-2',
    userId: 'user-2',
    tableId: 'table-1',
    startTime: new Date(new Date().setDate(new Date().getDate() + 1)),
    endTime: new Date(new Date(new Date().setDate(new Date().getDate() + 1)).setHours(20, 0, 0, 0)),
    guests: 2,
    status: ReservationStatus.CONFIRMED,
  },
];


// Use localStorage to persist data across reloads
let users: User[] = JSON.parse(localStorage.getItem('mock_users') || 'null') || initialUsers;
let tables: Table[] = JSON.parse(localStorage.getItem('mock_tables') || 'null') || initialTables;
let reservations: Reservation[] = JSON.parse(localStorage.getItem('mock_reservations') || '[]').map((r: any) => ({...r, startTime: new Date(r.startTime), endTime: new Date(r.endTime) })) || initialReservations;

const updateLocalStorage = () => {
  localStorage.setItem('mock_users', JSON.stringify(users));
  localStorage.setItem('mock_tables', JSON.stringify(tables));
  localStorage.setItem('mock_reservations', JSON.stringify(reservations));
}

updateLocalStorage();

const simulateDelay = (delay = 500) => new Promise(res => setTimeout(res, delay));

// --- API FUNCTIONS ---

export const mockApi = {
  async login(email: string, pass: string): Promise<User> {
    await simulateDelay();
    const user = users.find(u => u.email === email);
    // In a real app, you'd check a hashed password. Here we just check for existence.
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      return user;
    }
    throw new Error('Invalid email or password');
  },

  async signup(name: string, email: string, phone: string, pass: string): Promise<User> {
    await simulateDelay();
    if (users.some(u => u.email === email)) {
      throw new Error('An account with this email already exists.');
    }
    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      phone,
      role: Role.CUSTOMER,
    };
    users.push(newUser);
    updateLocalStorage();
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    return newUser;
  },

  async logout(): Promise<void> {
    await simulateDelay(200);
    localStorage.removeItem('currentUser');
  },

  async getCurrentUser(): Promise<User | null> {
    await simulateDelay(100);
    const userJson = localStorage.getItem('currentUser');
    return userJson ? JSON.parse(userJson) : null;
  },
  
  async getAvailability(date: Date, guests: number): Promise<AvailabilitySlot[]> {
      await simulateDelay(1000);
      const availableTables = tables.filter(t => t.capacity >= guests);
      const targetDate = date.toISOString().split('T')[0];

      const bookedSlots: { [key: string]: string[] } = {}; // { '18:00': ['table-1'], '18:30': ['table-1'] }
      
      reservations
        .filter(r => r.startTime.toISOString().split('T')[0] === targetDate && r.status !== ReservationStatus.CANCELLED)
        .forEach(r => {
            const time = `${r.startTime.getHours().toString().padStart(2, '0')}:${r.startTime.getMinutes().toString().padStart(2, '0')}`;
            if (!bookedSlots[time]) {
                bookedSlots[time] = [];
            }
            bookedSlots[time].push(r.tableId);
        });

      const slots: AvailabilitySlot[] = [];
      // Generate slots from 5 PM to 9 PM every 30 minutes
      for (let hour = 17; hour < 22; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
          const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
          const tablesForSlot = availableTables.filter(t => !bookedSlots[time]?.includes(t.id));
          if (tablesForSlot.length > 0) {
            // Pick the smallest table that fits
            const bestTable = tablesForSlot.sort((a,b) => a.capacity - b.capacity)[0];
            slots.push({ time, tableId: bestTable.id });
          }
        }
      }
      return slots;
  },

  async createReservation(details: { userId: string; tableId: string; date: string; time: string; guests: number; notes?: string }): Promise<Reservation> {
      await simulateDelay();
      const { userId, tableId, date, time, guests, notes } = details;
      const [hour, minute] = time.split(':').map(Number);
      const startTime = new Date(date);
      startTime.setHours(hour, minute, 0, 0);

      const endTime = new Date(startTime.getTime() + 90 * 60000); // 90 minute duration

      const newReservation: Reservation = {
          id: `res-${Date.now()}`,
          userId,
          tableId,
          startTime,
          endTime,
          guests,
          status: ReservationStatus.CONFIRMED,
          notes,
      };
      
      reservations.push(newReservation);
      updateLocalStorage();
      return newReservation;
  },

  async getReservationsForUser(userId: string): Promise<Reservation[]> {
      await simulateDelay();
      return reservations
        .filter(r => r.userId === userId)
        .map(r => ({
            ...r,
            table: tables.find(t => t.id === r.tableId)
        }));
  },

  async getReservationsForAdmin(): Promise<Reservation[]> {
      await simulateDelay();
      return reservations.map(r => ({
          ...r,
          user: users.find(u => u.id === r.userId),
          table: tables.find(t => t.id === r.tableId)
      }));
  },

  async cancelReservation(reservationId: string): Promise<Reservation> {
    await simulateDelay();
    const reservation = reservations.find(r => r.id === reservationId);
    if (!reservation) {
        throw new Error("Reservation not found");
    }
    reservation.status = ReservationStatus.CANCELLED;
    updateLocalStorage();
    return reservation;
  }
};
