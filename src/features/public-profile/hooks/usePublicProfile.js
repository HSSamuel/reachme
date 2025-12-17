import { useState, useEffect } from "react";
import { supabase } from "../../../config/supabaseClient";

// ✅ We use 'export const' here. This forces a named export.
export const usePublicProfile = (username) => {
  const [profile, setProfile] = useState(null);
  const [links, setLinks] = useState([]);
  const [products, setProducts] = useState([]);
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
        const { data: linkData } = await supabase
          .from("links")
          .select("*")
          .eq("profile_id", profileData.id)
          .eq("active", true)
          .order("position", { ascending: true });

        // 3. Get Products
        const { data: productData } = await supabase
          .from("products")
          .select("*")
          .eq("profile_id", profileData.id)
          .order("created_at", { ascending: false });

        setProfile(profileData);
        setLinks(linkData || []);
        setProducts(productData || []);
      } catch (err) {
        console.error("Public Profile Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [username]);

  return { profile, links, products, loading, error };
};
