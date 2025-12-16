import { useState, useEffect } from "react";
import { supabase } from "../../../config/supabaseClient";
import toast from "react-hot-toast";
import { useAuthStore } from "../../../store/authStore";

export function useLinks() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  // 1. Fetch Links on Load
  useEffect(() => {
    if (!user) return;

    async function fetchLinks() {
      // First get the profile ID for this user
      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (profile) {
        const { data: linkData, error } = await supabase
          .from("links")
          .select("*")
          .eq("profile_id", profile.id)
          .order("position", { ascending: true });

        if (error) toast.error("Could not load links");
        else setLinks(linkData || []);
      }
      setLoading(false);
    }

    fetchLinks();
  }, [user]);

  // 2. Add Link
  const addLink = async (title, url) => {
    const tempId = Date.now();
    // Optimistic Update
    const newLink = {
      id: tempId,
      title,
      url,
      position: links.length,
      active: true,
    };

    setLinks([...links, newLink]);

    // DB Insert
    const { data: profile } = await supabase
      .from("profiles")
      .select("id")
      .eq("user_id", user.id)
      .single();

    const { data, error } = await supabase
      .from("links")
      .insert({
        user_id: user.id,
        profile_id: profile.id,
        title,
        url,
        position: links.length,
      })
      .select()
      .single();

    if (error) {
      setLinks(links); // Revert
      toast.error("Failed to add link");
    } else {
      // Replace temp ID with real DB ID
      setLinks((prev) => prev.map((l) => (l.id === tempId ? data : l)));
      toast.success("Link added");
    }
  };

  // 3. Delete Link
  const deleteLink = async (id) => {
    const oldLinks = [...links];
    setLinks(links.filter((l) => l.id !== id));

    const { error } = await supabase.from("links").delete().eq("id", id);

    if (error) {
      setLinks(oldLinks);
      toast.error("Failed to delete");
    }
  };

  // 4. Reorder Links (Drag & Drop Logic)
  const reorderLinks = async (newLinks) => {
    setLinks(newLinks); // Immediate UI update

    // Prepare updates for DB
    const updates = newLinks.map((link, index) => ({
      id: link.id,
      position: index,
      // We need these to satisfy RLS/Supabase requirements typically
      title: link.title,
      url: link.url,
      user_id: user.id,
    }));

    const { error } = await supabase.from("links").upsert(updates);
    if (error) toast.error("Could not save order");
  };

  return { links, loading, addLink, deleteLink, reorderLinks };
}
