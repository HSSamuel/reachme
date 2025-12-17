import { useEffect, useState } from "react";
import { supabase } from "../../../config/supabaseClient";
import { useProfile } from "../../../hooks/useProfile";
import toast from "react-hot-toast";

export function useProducts() {
  const { profile } = useProfile();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. FETCH PRODUCTS
  useEffect(() => {
    if (!profile?.id) return;

    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("profile_id", profile.id)
          .order("sort_order", { ascending: true });

        if (error) throw error;
        setProducts(data || []);
      } catch (error) {
        console.error("Fetch Error:", error.message);
        toast.error("Could not load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [profile?.id]);

  // 2. ADD PRODUCT
  const addProduct = async ({ title, price, product_url, image_url }) => {
    try {
      // Optimistic Update (Optional: handled by state update below)
      const currentLength = products.length;

      const { data, error } = await supabase
        .from("products")
        .insert([
          {
            profile_id: profile.id,
            title,
            price,
            product_url,
            image_url,
            sort_order: currentLength,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      // Update local state immediately
      setProducts((prev) => [...prev, data]);
      return data;
    } catch (error) {
      console.error("Add Error:", error);
      toast.error("Failed to add product");
      throw error;
    }
  };

  // 3. DELETE PRODUCT
  const deleteProduct = async (id) => {
    try {
      // Optimistic UI update
      setProducts((prev) => prev.filter((p) => p.id !== id));

      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;

      toast.success("Product deleted");
    } catch (error) {
      console.error("Delete Error:", error);
      toast.error("Failed to delete");
      // Optional: Re-fetch products here if delete fails to sync state
    }
  };

  // 4. TOGGLE ACTIVE STATUS
  const toggleProductActive = async (id, isActive) => {
    try {
      // Optimistic UI update
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, is_active: isActive } : p))
      );

      const { error } = await supabase
        .from("products")
        .update({ is_active: isActive })
        .eq("id", id);

      if (error) throw error;
    } catch (error) {
      console.error("Update Error:", error);
      toast.error("Update failed");
    }
  };

  // 5. UPLOAD IMAGE
  const uploadProductImage = async (file) => {
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${profile.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("product_images")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from("product_images")
        .getPublicUrl(filePath);
      return data.publicUrl;
    } catch (error) {
      console.error("Upload Error:", error);
      toast.error("Image upload failed");
      throw error;
    }
  };

  return {
    products,
    loading,
    addProduct,
    deleteProduct,
    toggleProductActive,
    uploadProductImage,
  };
}
