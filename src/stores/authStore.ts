import { create } from 'zustand';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  onAuthStateChanged,
  type User as FirebaseUser,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, name: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  setFirebaseUser: (fbUser: FirebaseUser | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  firebaseUser: null,
  loading: true,

  setFirebaseUser: async (fbUser) => {
    if (!fbUser) {
      set({ firebaseUser: null, user: null, loading: false });
      return;
    }
    const snap = await getDoc(doc(db, 'users', fbUser.uid)).catch(() => null);
    const data = snap?.data();
    set({
      firebaseUser: fbUser,
      loading: false,
      user: {
        id: fbUser.uid,
        name: data?.name ?? fbUser.displayName ?? 'Usuário',
        email: fbUser.email ?? '',
        avatar_url: data?.avatar_url ?? fbUser.photoURL ?? undefined,
        plan: data?.plan ?? 'free',
        pro_pay_on_site_quota: data?.pro_pay_on_site_quota ?? 0,
        loyalty_stamps: data?.loyalty_stamps ?? 0,
        created_at: data?.created_at ?? new Date().toISOString(),
      },
    });
  },

  signIn: async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return {};
    } catch (e: any) {
      const msg: Record<string, string> = {
        'auth/user-not-found': 'E-mail não encontrado',
        'auth/wrong-password': 'Senha incorreta',
        'auth/invalid-credential': 'E-mail ou senha incorretos',
        'auth/too-many-requests': 'Muitas tentativas. Tente mais tarde.',
      };
      return { error: msg[e.code] ?? 'Erro ao entrar. Tente novamente.' };
    }
  },

  signUp: async (email, password, name) => {
    try {
      const { user: fbUser } = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(fbUser, { displayName: name });
      await setDoc(doc(db, 'users', fbUser.uid), {
        name,
        email,
        plan: 'free',
        pro_pay_on_site_quota: 0,
        loyalty_stamps: 0,
        created_at: new Date().toISOString(),
      });
      return {};
    } catch (e: any) {
      const msg: Record<string, string> = {
        'auth/email-already-in-use': 'Este e-mail já está em uso',
        'auth/weak-password': 'Senha fraca. Use pelo menos 6 caracteres.',
        'auth/invalid-email': 'E-mail inválido',
      };
      return { error: msg[e.code] ?? 'Erro ao criar conta. Tente novamente.' };
    }
  },

  signOut: async () => {
    await firebaseSignOut(auth);
    set({ user: null, firebaseUser: null });
  },
}));
