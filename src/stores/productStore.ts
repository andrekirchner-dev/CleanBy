import { create } from 'zustand';
import { fetchProducts } from '../lib/db';
import type { Product } from '../types';

interface ProductState {
  products: Product[];
  loading: boolean;
  fetch: (category?: string) => Promise<void>;
}

export const useProductStore = create<ProductState>((set) => ({
  products: [],
  loading: false,

  fetch: async (category) => {
    set({ loading: true });
    const products = await fetchProducts(category).catch(() => [] as Product[]);
    set({ products, loading: false });
  },
}));
