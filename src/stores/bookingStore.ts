import { create } from 'zustand';
import { onSnapshot, query, collection, where, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { createBooking, updateBookingStatus } from '../lib/db';
import type { Service, Vehicle, Establishment, Booking, BookingStatus } from '../types';

interface BookingDraft {
  service: Service | null;
  establishment: Establishment | null;
  vehicle: Vehicle | null;
  date: string | null;
  time: string | null;
  paymentType: 'reserva' | 'completo' | 'no_local' | null;
}

interface BookingState {
  draft: BookingDraft;
  bookings: Booking[];
  bookingsLoading: boolean;
  setService: (service: Service, establishment: Establishment) => void;
  setVehicle: (vehicle: Vehicle) => void;
  setDate: (date: string) => void;
  setTime: (time: string) => void;
  setPaymentType: (type: 'reserva' | 'completo' | 'no_local') => void;
  resetDraft: () => void;
  confirm: (userId: string) => Promise<Booking>;
  subscribeBookings: (userId: string) => () => void;
  cancelBooking: (bookingId: string) => Promise<void>;
}

const emptyDraft: BookingDraft = {
  service: null,
  establishment: null,
  vehicle: null,
  date: null,
  time: null,
  paymentType: null,
};

export const useBookingStore = create<BookingState>((set, get) => ({
  draft: emptyDraft,
  bookings: [],
  bookingsLoading: false,

  setService: (service, establishment) =>
    set((s) => ({ draft: { ...s.draft, service, establishment } })),

  setVehicle: (vehicle) =>
    set((s) => ({ draft: { ...s.draft, vehicle } })),

  setDate: (date) =>
    set((s) => ({ draft: { ...s.draft, date, time: null } })),

  setTime: (time) =>
    set((s) => ({ draft: { ...s.draft, time } })),

  setPaymentType: (paymentType) =>
    set((s) => ({ draft: { ...s.draft, paymentType } })),

  resetDraft: () => set({ draft: emptyDraft }),

  confirm: async (userId) => {
    const { draft } = get();
    if (!draft.service || !draft.establishment || !draft.vehicle || !draft.date || !draft.time || !draft.paymentType) {
      throw new Error('Draft incompleto');
    }
    const total = draft.service.price;
    const paid = draft.paymentType === 'reserva' ? total * 0.3 : draft.paymentType === 'completo' ? total : 0;

    const data: Omit<Booking, 'id'> = {
      user_id: userId,
      service_id: draft.service.id,
      vehicle_id: draft.vehicle.id,
      establishment_id: draft.establishment.id,
      date: draft.date,
      time: draft.time,
      status: 'aguardando_confirmacao',
      payment_type: draft.paymentType,
      amount_paid: paid,
      total_amount: total,
      service_name: draft.service.name,
      establishment_name: draft.establishment.name,
      vehicle_model: draft.vehicle.model,
      vehicle_plate: draft.vehicle.plate,
      created_at: new Date().toISOString(),
    };

    return createBooking(data);
  },

  // Returns unsubscribe fn — caller must call it on unmount
  subscribeBookings: (userId) => {
    set({ bookingsLoading: true });
    const q = query(
      collection(db, 'bookings'),
      where('user_id', '==', userId),
      orderBy('created_at', 'desc'),
    );
    const unsub = onSnapshot(q, (snap) => {
      const bookings = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Booking));
      set({ bookings, bookingsLoading: false });
    }, () => { set({ bookingsLoading: false }); });
    return unsub;
  },

  cancelBooking: async (bookingId) => {
    await updateBookingStatus(bookingId, 'cancelado');
    set((s) => ({
      bookings: s.bookings.map((b) => b.id === bookingId ? { ...b, status: 'cancelado' } : b),
    }));
  },
}));
