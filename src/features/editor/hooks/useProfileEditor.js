import { useState, useEffect } from "react";
import { supabase } from "../../../config/supabaseClient";
import { useAuthStore } from "../../../store/authStore";
import toast from "react-hot-toast";

// ✅ CRITICAL: Must include "export" before "function"
export function useProfileEditor() {
  const { user } = useAuthStore();
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!user) return;
    fetchProfile();
  }, [user]);

  async function fetchProfile() {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error) throw error;
      setProfile(data || {});
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile(updates) {
    try {
      setUpdating(true);
      // Optimistic UI update
      setProfile({ ...profile, ...updates });

      const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("user_id", user.id);

      if (error) throw error;
      toast.success("Saved changes");
    } catch (error) {
      toast.error("Failed to save");
      console.error(error);
      fetchProfile(); // Revert on error
    } finally {
      setUpdating(false);
    }
  }

  return { profile, loading, updating, updateProfile };
}
