import {
  collection, doc, getDoc, getDocs, addDoc, deleteDoc, updateDoc,
  query, where, orderBy, limit, increment,
} from 'firebase/firestore';
import { db } from './firebase';
import type { Vehicle, Establishment, Service, Booking, Review, BookingStatus, User, Product } from '../types';

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

export async function fetchPartnerEstablishment(partnerId: string): Promise<Establishment | null> {
  const q = query(collection(db, 'establishments'), where('partner_id', '==', partnerId));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  const data = d.data();
  return { id: d.id, ...data, is_open: isOpen(data.opening_hours ?? {}) } as Establishment;
}

export async function createEstablishment(data: Omit<Establishment, 'id' | 'is_open'>): Promise<Establishment> {
  const ref = await addDoc(collection(db, 'establishments'), data);
  return { id: ref.id, ...data, is_open: isOpen((data as any).opening_hours ?? {}) };
}

export async function updateEstablishment(estId: string, data: Partial<Omit<Establishment, 'id' | 'is_open'>>): Promise<void> {
  await updateDoc(doc(db, 'establishments', estId), data as Record<string, unknown>);
}

// ── Services ──────────────────────────────────────────────────────────────────

export async function fetchServices(establishmentId: string): Promise<Service[]> {
  const q = query(collection(db, 'services'), where('establishment_id', '==', establishmentId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Service));
}

export async function addService(data: Omit<Service, 'id'>): Promise<Service> {
  const ref = await addDoc(collection(db, 'services'), data);
  return { id: ref.id, ...data };
}

export async function updateService(serviceId: string, data: Partial<Omit<Service, 'id'>>): Promise<void> {
  await updateDoc(doc(db, 'services', serviceId), data as Record<string, unknown>);
}

export async function removeService(serviceId: string): Promise<void> {
  await deleteDoc(doc(db, 'services', serviceId));
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

export async function fetchEstablishmentBookings(establishmentId: string): Promise<Booking[]> {
  const q = query(
    collection(db, 'bookings'),
    where('establishment_id', '==', establishmentId),
    orderBy('date', 'asc'),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Booking));
}

export async function createBooking(data: Omit<Booking, 'id'>): Promise<Booking> {
  const ref = await addDoc(collection(db, 'bookings'), data);
  return { id: ref.id, ...data };
}

export async function updateBookingStatus(bookingId: string, status: BookingStatus): Promise<void> {
  await updateDoc(doc(db, 'bookings', bookingId), { status });
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

export async function createReview(data: Omit<Review, 'id'>): Promise<Review> {
  const ref = await addDoc(collection(db, 'reviews'), data);
  return { id: ref.id, ...data };
}

// ── Users ─────────────────────────────────────────────────────────────────────

export async function updateUser(userId: string, data: Partial<Omit<User, 'id'>>): Promise<void> {
  await updateDoc(doc(db, 'users', userId), data as Record<string, unknown>);
}

export async function incrementLoyaltyStamps(userId: string, amount: number): Promise<void> {
  await updateDoc(doc(db, 'users', userId), { loyalty_stamps: increment(amount) });
}

// ── Availability ──────────────────────────────────────────────────────────────

export async function fetchBookedTimes(establishmentId: string, date: string): Promise<string[]> {
  const q = query(
    collection(db, 'bookings'),
    where('establishment_id', '==', establishmentId),
    where('date', '==', date),
    where('status', 'in', ['aguardando_confirmacao', 'confirmado', 'em_andamento']),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data().time as string);
}

// ── Products ──────────────────────────────────────────────────────────────────

export async function fetchProducts(category?: string): Promise<Product[]> {
  const q = category
    ? query(collection(db, 'products'), where('category', '==', category), orderBy('name'))
    : query(collection(db, 'products'), orderBy('name'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Product));
}
