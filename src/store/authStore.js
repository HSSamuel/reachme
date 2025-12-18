import { create } from "zustand";
import { supabase } from "../config/supabaseClient";

export const useAuthStore = create((set) => ({
  user: null,
  session: null,
  loading: true,

  // 1. Initialize Auth
  initializeAuth: async () => {
    set({ loading: true });
    const {
      data: { session },
    } = await supabase.auth.getSession();
    set({ session, user: session?.user ?? null, loading: false });

    supabase.auth.onAuthStateChange((_event, session) => {
      set({ session, user: session?.user ?? null, loading: false });
    });
  },

  // 2. Register Action
  // ✅ FIX: Standardized order: (email, password, name)
  register: async (email, password, name) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
      },
    });

    if (error) throw error;

    // If session exists (Email confirmation OFF), update store immediately
    if (data.session) {
      set({ session: data.session, user: data.user });
    }

    return data;
  },

  // 3. Login Action
  login: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    if (data.session) {
      set({ session: data.session, user: data.user });
    }
    return data;
  },

  // 4. Social Login
  signInWithSocial: async (provider) => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: provider,
      options: {
        redirectTo: window.location.origin + "/dashboard",
      },
    });
    if (error) throw error;
    return data;
  },

  // 5. Sign Out
  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, session: null });
  },
}));
