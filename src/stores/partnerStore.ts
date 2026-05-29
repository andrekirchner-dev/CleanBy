import { create } from 'zustand';
import { onSnapshot, query, collection, where, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import {
  fetchPartnerEstablishment, createEstablishment, updateEstablishment,
  fetchServices, addService, updateService, removeService,
  updateBookingStatus,
} from '../lib/db';
import type { Establishment, Service, Booking, BookingStatus } from '../types';

interface PartnerState {
  establishment: Establishment | null;
  services: Service[];
  bookings: Booking[];
  loading: boolean;

  fetchEstablishment: (partnerId: string) => Promise<void>;
  createEstablishment: (data: Omit<Establishment, 'id' | 'is_open'>) => Promise<Establishment>;
  updateEstablishment: (data: Partial<Omit<Establishment, 'id' | 'is_open'>>) => Promise<void>;

  fetchServices: () => Promise<void>;
  addService: (data: Omit<Service, 'id'>) => Promise<Service>;
  editService: (serviceId: string, data: Partial<Omit<Service, 'id'>>) => Promise<void>;
  deleteService: (serviceId: string) => Promise<void>;

  // Returns unsubscribe fn
  subscribeBookings: () => (() => void) | undefined;
  confirmBooking: (bookingId: string) => Promise<void>;
  rejectBooking: (bookingId: string) => Promise<void>;
  completeBooking: (bookingId: string) => Promise<void>;
}

export const usePartnerStore = create<PartnerState>((set, get) => ({
  establishment: null,
  services: [],
  bookings: [],
  loading: false,

  fetchEstablishment: async (partnerId) => {
    set({ loading: true });
    const establishment = await fetchPartnerEstablishment(partnerId).catch(() => null);
    set({ establishment, loading: false });
    if (establishment) await get().fetchServices();
  },

  createEstablishment: async (data) => {
    const est = await createEstablishment(data);
    set({ establishment: est });
    return est;
  },

  updateEstablishment: async (data) => {
    const { establishment } = get();
    if (!establishment) return;
    await updateEstablishment(establishment.id, data);
    set({ establishment: { ...establishment, ...data } });
  },

  fetchServices: async () => {
    const { establishment } = get();
    if (!establishment) return;
    const services = await fetchServices(establishment.id).catch(() => [] as Service[]);
    set({ services });
  },

  addService: async (data) => {
    const service = await addService(data);
    set((s) => ({ services: [...s.services, service] }));
    return service;
  },

  editService: async (serviceId, data) => {
    await updateService(serviceId, data);
    set((s) => ({
      services: s.services.map((sv) => sv.id === serviceId ? { ...sv, ...data } : sv),
    }));
  },

  deleteService: async (serviceId) => {
    await removeService(serviceId);
    set((s) => ({ services: s.services.filter((sv) => sv.id !== serviceId) }));
  },

  subscribeBookings: () => {
    const { establishment } = get();
    if (!establishment) return undefined;
    const q = query(
      collection(db, 'bookings'),
      where('establishment_id', '==', establishment.id),
      orderBy('date', 'asc'),
    );
    return onSnapshot(q, (snap) => {
      const bookings = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Booking));
      set({ bookings });
    }, () => {});
  },

  confirmBooking: async (bookingId) => {
    await updateBookingStatus(bookingId, 'confirmado');
    set((s) => ({
      bookings: s.bookings.map((b) => b.id === bookingId ? { ...b, status: 'confirmado' } : b),
    }));
  },

  rejectBooking: async (bookingId) => {
    await updateBookingStatus(bookingId, 'cancelado');
    set((s) => ({
      bookings: s.bookings.map((b) => b.id === bookingId ? { ...b, status: 'cancelado' } : b),
    }));
  },

  completeBooking: async (bookingId) => {
    await updateBookingStatus(bookingId, 'concluido');
    set((s) => ({
      bookings: s.bookings.map((b) => b.id === bookingId ? { ...b, status: 'concluido' } : b),
    }));
  },
}));
