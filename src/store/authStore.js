import { create } from "zustand";
import { supabase } from "../config/supabaseClient";

export const useAuthStore = create((set) => ({
  user: null,
  session: null,
  loading: true,

  // Initialize Auth Listener (Run this once when app starts)
  initializeAuth: async () => {
    set({ loading: true });

    // 1. Get initial session
    const {
      data: { session },
    } = await supabase.auth.getSession();
    set({ session, user: session?.user ?? null, loading: false });

    // 2. Listen for changes (login, logout, auto-refresh)
    supabase.auth.onAuthStateChange((_event, session) => {
      set({ session, user: session?.user ?? null, loading: false });
    });
  },

  // Logout Action
  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, session: null });
  },
}));
