import { useEffect, useState } from "react";
import { supabase } from "../../../config/supabaseClient";
import { useProfile } from "../../../hooks/useProfile";
import toast from "react-hot-toast";

export function useLinks() {
  const { profile } = useProfile();
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. FETCH LINKS
  useEffect(() => {
    if (!profile?.id) return;

    const fetchLinks = async () => {
      try {
        const { data, error } = await supabase
          .from("links")
          .select("*")
          .eq("profile_id", profile.id)
          .order("sort_order", { ascending: true }); // Important: Sort by order

        if (error) throw error;
        setLinks(data || []);
      } catch (error) {
        console.error("Fetch Error:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLinks();
  }, [profile?.id]);

  // 2. ADD LINK
  const addLink = async ({ title, url }) => {
    try {
      if (!profile?.id) throw new Error("Profile not loaded");

      // New link goes to the bottom
      const currentLength = links.length;

      const { data, error } = await supabase
        .from("links")
        .insert([
          {
            profile_id: profile.id,
            user_id: profile.id,
            title,
            url,
            is_active: true,
            sort_order: currentLength,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      setLinks((prev) => [...prev, data]);
      return data;
    } catch (error) {
      toast.error(`Error: ${error.message}`);
      throw error;
    }
  };

  // 3. UPDATE LINK
  const updateLink = async (id, updates) => {
    try {
      // Optimistic Update
      setLinks((prev) =>
        prev.map((link) => (link.id === id ? { ...link, ...updates } : link))
      );

      const { error } = await supabase
        .from("links")
        .update(updates)
        .eq("id", id);
      if (error) throw error;
    } catch (error) {
      console.error("Update error", error);
      toast.error("Failed to update");
    }
  };

  // 4. DELETE LINK
  const deleteLink = async (id) => {
    try {
      setLinks((prev) => prev.filter((link) => link.id !== id));
      const { error } = await supabase.from("links").delete().eq("id", id);
      if (error) throw error;
    } catch (error) {
      toast.error("Failed to delete");
    }
  };

  // 5. UPLOAD THUMBNAIL
  const uploadThumbnail = async (id, file) => {
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${id}-${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("link_thumbnails")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from("link_thumbnails")
        .getPublicUrl(filePath);
      const publicUrl = data.publicUrl;

      await updateLink(id, { thumbnail_url: publicUrl });
      return publicUrl;
    } catch (error) {
      console.error("Upload Error:", error);
      toast.error("Image upload failed");
      throw error;
    }
  };

  // 6. REORDER LINKS (FIXED)
  const reorderLinks = async (newLinks) => {
    // 1. Optimistic Update (Update UI instantly)
    setLinks(newLinks);

    try {
      // 2. Simple Batch Update: Only touch 'sort_order'
      // This avoids RLS errors because we aren't touching sensitive columns like 'user_id'
      const updates = newLinks.map((link, index) =>
        supabase.from("links").update({ sort_order: index }).eq("id", link.id)
      );

      // Execute all updates in parallel
      await Promise.all(updates);
    } catch (error) {
      console.error("Reorder Error:", error);
      toast.error("Failed to save order");
    }
  };

  return {
    links,
    loading,
    addLink,
    updateLink,
    deleteLink,
    uploadThumbnail,
    reorderLinks,
  };
}
