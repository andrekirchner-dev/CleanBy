import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

const supabaseUrl =
  Constants.expoConfig?.extra?.supabaseUrl ??
  process.env.EXPO_PUBLIC_SUPABASE_URL ??
  'https://placeholder.supabase.co';

const supabaseAnonKey =
  Constants.expoConfig?.extra?.supabaseAnonKey ??
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ??
  'placeholder-anon-key';

export const isSupabaseConfigured =
  supabaseUrl !== 'https://placeholder.supabase.co';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
