import {
  collection, doc, getDoc, getDocs, addDoc, deleteDoc,
  query, where, orderBy, limit,
} from 'firebase/firestore';
import { db } from './firebase';
import type { Vehicle, Establishment, Service, Booking, Review } from '../types';

// ── Helpers ─────────────────────────────────────────────────────────────────

export function isOpen(opening_hours: Record<string, { open: string; close: string }>): boolean {
  const now = new Date();
  const days = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab'];
  const hours = opening_hours[days[now.getDay()]];
  if (!hours) return false;
  const [oh, om] = hours.open.split(':').map(Number);
  const [ch, cm] = hours.close.split(':').map(Number);
  const nowMin = now.getHours() * 60 + now.getMinutes();
  return nowMin >= oh * 60 + om && nowMin < ch * 60 + cm;
}

export function computeDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ── Vehicles ─────────────────────────────────────────────────────────────────

export async function fetchVehicles(userId: string): Promise<Vehicle[]> {
  const q = query(collection(db, 'vehicles'), where('user_id', '==', userId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Vehicle));
}

export async function addVehicle(data: Omit<Vehicle, 'id'>): Promise<Vehicle> {
  const ref = await addDoc(collection(db, 'vehicles'), data);
  return { id: ref.id, ...data };
}

export async function deleteVehicle(vehicleId: string): Promise<void> {
  await deleteDoc(doc(db, 'vehicles', vehicleId));
}

// ── Establishments ────────────────────────────────────────────────────────────

export async function fetchEstablishments(): Promise<Establishment[]> {
  const snap = await getDocs(collection(db, 'establishments'));
  return snap.docs.map((d) => {
    const data = d.data();
    return { id: d.id, ...data, is_open: isOpen(data.opening_hours ?? {}) } as Establishment;
  });
}

export async function fetchEstablishment(id: string): Promise<Establishment | null> {
  const snap = await getDoc(doc(db, 'establishments', id));
  if (!snap.exists()) return null;
  const data = snap.data();
  return { id: snap.id, ...data, is_open: isOpen(data.opening_hours ?? {}) } as Establishment;
}

// ── Services ──────────────────────────────────────────────────────────────────

export async function fetchServices(establishmentId: string): Promise<Service[]> {
  const q = query(collection(db, 'services'), where('establishment_id', '==', establishmentId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Service));
}

// ── Bookings ──────────────────────────────────────────────────────────────────

export async function fetchUserBookings(userId: string): Promise<Booking[]> {
  const q = query(
    collection(db, 'bookings'),
    where('user_id', '==', userId),
    orderBy('created_at', 'desc'),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Booking));
}

export async function createBooking(data: Omit<Booking, 'id'>): Promise<Booking> {
  const ref = await addDoc(collection(db, 'bookings'), data);
  return { id: ref.id, ...data };
}

// ── Reviews ───────────────────────────────────────────────────────────────────

export async function fetchReviews(establishmentId: string): Promise<Review[]> {
  const q = query(
    collection(db, 'reviews'),
    where('establishment_id', '==', establishmentId),
    orderBy('created_at', 'desc'),
    limit(20),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Review));
}
