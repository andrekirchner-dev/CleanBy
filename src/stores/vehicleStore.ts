import { create } from 'zustand';
import { fetchVehicles, addVehicle, deleteVehicle } from '../lib/db';
import type { Vehicle } from '../types';

interface VehicleState {
  vehicles: Vehicle[];
  loading: boolean;
  fetch: (userId: string) => Promise<void>;
  add: (data: Omit<Vehicle, 'id'>) => Promise<Vehicle>;
  remove: (vehicleId: string) => Promise<void>;
}

export const useVehicleStore = create<VehicleState>((set) => ({
  vehicles: [],
  loading: false,

  fetch: async (userId) => {
    set({ loading: true });
    const vehicles = await fetchVehicles(userId).catch(() => [] as Vehicle[]);
    set({ vehicles, loading: false });
  },

  add: async (data) => {
    const vehicle = await addVehicle(data);
    set((s) => ({ vehicles: [...s.vehicles, vehicle] }));
    return vehicle;
  },

  remove: async (vehicleId) => {
    await deleteVehicle(vehicleId);
    set((s) => ({ vehicles: s.vehicles.filter((v) => v.id !== vehicleId) }));
  },
}));
