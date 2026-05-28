import { create } from 'zustand';
import { fetchEstablishments, fetchEstablishment, computeDistance } from '../lib/db';
import type { Establishment } from '../types';

interface EstablishmentState {
  establishments: Establishment[];
  loading: boolean;
  fetch: (userLat?: number, userLon?: number) => Promise<void>;
  getById: (id: string) => Promise<Establishment | null>;
}

export const useEstablishmentStore = create<EstablishmentState>((set) => ({
  establishments: [],
  loading: false,

  fetch: async (userLat, userLon) => {
    set({ loading: true });
    const data = await fetchEstablishments().catch(() => [] as Establishment[]);
    const withDistance = data.map((e) => ({
      ...e,
      distance_km:
        userLat != null && userLon != null
          ? Math.round(computeDistance(userLat, userLon, e.latitude, e.longitude) * 10) / 10
          : undefined,
    }));
    set({ establishments: withDistance, loading: false });
  },

  getById: (id) => fetchEstablishment(id),
}));
