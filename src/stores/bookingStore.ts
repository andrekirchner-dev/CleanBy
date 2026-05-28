import { create } from 'zustand';
import type { Service, Vehicle, Establishment } from '../types';

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
  setService: (service: Service, establishment: Establishment) => void;
  setVehicle: (vehicle: Vehicle) => void;
  setDate: (date: string) => void;
  setTime: (time: string) => void;
  setPaymentType: (type: 'reserva' | 'completo' | 'no_local') => void;
  resetDraft: () => void;
}

const emptyDraft: BookingDraft = {
  service: null,
  establishment: null,
  vehicle: null,
  date: null,
  time: null,
  paymentType: null,
};

export const useBookingStore = create<BookingState>((set) => ({
  draft: emptyDraft,

  setService: (service, establishment) =>
    set((state) => ({ draft: { ...state.draft, service, establishment } })),

  setVehicle: (vehicle) =>
    set((state) => ({ draft: { ...state.draft, vehicle } })),

  setDate: (date) =>
    set((state) => ({ draft: { ...state.draft, date, time: null } })),

  setTime: (time) =>
    set((state) => ({ draft: { ...state.draft, time } })),

  setPaymentType: (paymentType) =>
    set((state) => ({ draft: { ...state.draft, paymentType } })),

  resetDraft: () => set({ draft: emptyDraft }),
}));
