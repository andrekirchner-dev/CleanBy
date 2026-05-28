import { create } from 'zustand';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  type User as FirebaseUser,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import type { User } from '../types';
import { Platform } from 'react-native';

interface AuthState {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  googleLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, name: string) => Promise<{ error?: string }>;
  signInWithGoogle: () => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  setFirebaseUser: (fbUser: FirebaseUser | null) => void;
}

const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('email');
googleProvider.addScope('profile');

async function upsertUserDoc(fbUser: FirebaseUser) {
  const ref = doc(db, 'users', fbUser.uid);
  const snap = await getDoc(ref).catch(() => null);
  if (!snap?.exists()) {
    await setDoc(ref, {
      name: fbUser.displayName ?? 'Usuário',
      email: fbUser.email ?? '',
      avatar_url: fbUser.photoURL ?? null,
      plan: 'free',
      pro_pay_on_site_quota: 0,
      loyalty_stamps: 0,
      created_at: new Date().toISOString(),
    }).catch(() => null);
  }
  return snap?.data();
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  firebaseUser: null,
  loading: true,
  googleLoading: false,

  setFirebaseUser: async (fbUser) => {
    if (!fbUser) {
      set({ firebaseUser: null, user: null, loading: false });
      return;
    }
    const data = await upsertUserDoc(fbUser).catch(() => null);
    set({
      firebaseUser: fbUser,
      loading: false,
      user: {
        id: fbUser.uid,
        name: data?.name ?? fbUser.displayName ?? 'Usuário',
        email: fbUser.email ?? '',
        avatar_url: data?.avatar_url ?? fbUser.photoURL ?? undefined,
        plan: data?.plan ?? 'free',
        role: data?.role ?? 'cliente',
        pro_pay_on_site_quota: data?.pro_pay_on_site_quota ?? 0,
        loyalty_stamps: data?.loyalty_stamps ?? 0,
        created_at: data?.created_at ?? new Date().toISOString(),
      },
    });
  },

  signInWithGoogle: async () => {
    set({ googleLoading: true });
    try {
      if (Platform.OS === 'web') {
        // Popup não recarrega a página — evita race condition com onAuthStateChanged
        await signInWithPopup(auth, googleProvider);
      } else {
        await signInWithRedirect(auth, googleProvider);
      }
      return {};
    } catch (e: any) {
      const msg: Record<string, string> = {
        'auth/popup-closed-by-user': 'Login cancelado.',
        'auth/popup-blocked': 'Popup bloqueado. Permita popups para este site e tente novamente.',
        'auth/cancelled-popup-request': 'Login cancelado.',
        'auth/account-exists-with-different-credential': 'Já existe uma conta com este e-mail.',
      };
      return { error: msg[e.code] ?? `Erro ao entrar com Google. (${e.code ?? 'unknown'})` };
    } finally {
      set({ googleLoading: false });
    }
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
        avatar_url: null,
        plan: 'free',
        role: 'cliente',
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
