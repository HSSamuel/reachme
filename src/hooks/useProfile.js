import { useEffect, useState } from "react";
import { supabase } from "../config/supabaseClient";
import toast from "react-hot-toast";

export function useProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates) => {
    try {
      // 1. Optimistic Update
      setProfile((prev) => ({ ...prev, ...updates }));

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("No user logged in");

      const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", user.id);

      if (error) throw error;
      // toast.success("Profile updated"); // Optional: Removed to reduce noise on auto-save
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update profile");
    }
  };

  const uploadAvatar = async (file) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
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
