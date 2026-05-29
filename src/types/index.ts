export type Plan = 'free' | 'pro';
export type UserRole = 'cliente' | 'parceiro' | 'admin';

export type BookingStatus =
  | 'aguardando_confirmacao'
  | 'confirmado'
  | 'em_andamento'
  | 'concluido'
  | 'cancelado';

export type ServiceCategory =
  | 'lavagem_simples'
  | 'lavagem_completa'
  | 'higienizacao_interna'
  | 'polimento'
  | 'cristalizacao'
  | 'blindagem_pintura'
  | 'estetica_completa'
  | 'vai_ate_voce';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  plan: Plan;
  role: UserRole;
  pro_pay_on_site_quota: number;
  loyalty_stamps: number;
  created_at: string;
}

export interface Vehicle {
  id: string;
  user_id: string;
  plate: string;
  model: string;
  color: string;
  year?: number;
}

export interface Establishment {
  id: string;
  partner_id?: string;
  name: string;
  slug: string;
  description?: string;
  cover_url?: string;
  logo_url?: string;
  rating: number;
  review_count: number;
  address: string;
  city?: string;
  latitude: number;
  longitude: number;
  distance_km?: number;
  is_open: boolean;
  opening_hours: Record<string, { open: string; close: string }>;
  has_mobile_service: boolean;
  mobile_radius_km?: number;
  categories: ServiceCategory[];
}

export interface Service {
  id: string;
  establishment_id: string;
  name: string;
  description?: string;
  price: number;
  duration_min: number;
  photo_url?: string;
  pro_discount_eligible: boolean;
  has_special_slots: boolean;
  category: ServiceCategory;
}

export interface TimeSlot {
  time: string;
  available: boolean;
  is_special: boolean;
}

export interface Booking {
  id: string;
  user_id: string;
  service_id: string;
  vehicle_id: string;
  establishment_id: string;
  date: string;
  time: string;
  status: BookingStatus;
  payment_type: 'reserva' | 'completo' | 'no_local';
  amount_paid: number;
  total_amount: number;
  // Denormalized for efficient list rendering
  service_name: string;
  establishment_name: string;
  vehicle_model: string;
  vehicle_plate: string;
  service?: Service;
  establishment?: Establishment;
  vehicle?: Vehicle;
  created_at: string;
}

export interface LoyaltyVoucher {
  id: string;
  user_id: string;
  qr_code: string;
  redeemed: boolean;
  redeemed_at?: string;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  category: string;
  pro_points?: number;
}

export interface Review {
  id: string;
  user_id: string;
  establishment_id: string;
  booking_id: string;
  rating: number;
  comment?: string;
  user?: Pick<User, 'name' | 'avatar_url'>;
  created_at: string;
}
