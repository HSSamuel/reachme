import { useEffect, useState } from "react";
import { supabase } from "../config/supabaseClient";
import { useAuthStore } from "../store/authStore"; // ✅ Import Auth Store
import toast from "react-hot-toast";

export function useProfile() {
  const { user } = useAuthStore(); // ✅ Get the reactive user object
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ RE-FETCH WHEN USER CHANGES
  // This ensures that if the account switches, the profile switches too.
  useEffect(() => {
    if (user?.id) {
      fetchProfile(user.id);
    } else {
      setProfile(null);
      setLoading(false);
    }
  }, [user?.id]); // 👈 The key fix: Dependency on user.id

  const fetchProfile = async (userId) => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId) // ✅ Use the ID passed from the store
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
      // Don't show toast on 406 (No profile found yet), let the UI handle empty state
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates) => {
    try {
      if (!user) throw new Error("No user logged in");

      // 1. Optimistic Update
      setProfile((prev) => ({ ...prev, ...updates }));

      const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", user.id);

      if (error) throw error;
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update profile");
    }
  };

  const uploadAvatar = async (file) => {
    try {
      if (!user) throw new Error("No user");

      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);

      await updateProfile({ avatar_url: data.publicUrl });
      return data.publicUrl;
    } catch (error) {
      console.error("Avatar Upload Error:", error);
      toast.error("Failed to upload image");
    }
  };

  return { profile, loading, updateProfile, uploadAvatar };
}
