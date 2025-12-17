import { create } from "zustand";
import { supabase } from "../config/supabaseClient";

export const useAuthStore = create((set) => ({
  user: null,
  session: null,
  loading: true,

  // 1. Initialize Auth Listener (Run this once when app starts)
  initializeAuth: async () => {
    set({ loading: true });

    // Get initial session
    const {
      data: { session },
    } = await supabase.auth.getSession();
    set({ session, user: session?.user ?? null, loading: false });

    // Listen for changes (login, logout, auto-refresh)
    supabase.auth.onAuthStateChange((_event, session) => {
      set({ session, user: session?.user ?? null, loading: false });
    });
  },

  // 2. Register Action (REQUIRED for RegisterForm)
  register: async (name, email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
      },
    });
    if (error) throw error;
    return data;
  },

  // 3. Login Action (REQUIRED for LoginForm)
  login: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  },

  // 4. Social Login Action (REQUIRED for Google/GitHub buttons)
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

  // 5. Logout Action
  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, session: null });
  },
}));
