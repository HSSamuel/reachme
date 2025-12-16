import { useState, useEffect } from "react";
import { supabase } from "../../../config/supabaseClient";

export function usePublicProfile(username) {
  const [profile, setProfile] = useState(null);
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!username) return;

    async function fetchData() {
      try {
        setLoading(true);
        // 1. Get Profile
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("username", username)
          .single();

        if (profileError || !profileData) throw new Error("Profile not found");

        // 2. Get Links
        const { data: linkData, error: linkError } = await supabase
          .from("links")
          .select("*")
          .eq("profile_id", profileData.id)
          .eq("active", true) // Only show active links
          .order("position", { ascending: true });

        if (linkError) throw linkError;

        setProfile(profileData);
        setLinks(linkData || []);
      } catch (err) {
        console.error("Public Profile Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [username]);

  return { profile, links, loading, error };
}
