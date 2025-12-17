import { useState } from "react";
import { supabase } from "../../../config/supabaseClient";
import { useAuthStore } from "../../../store/authStore";
import { Card } from "../../../components/ui/Card";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { Plus, Zap } from "lucide-react";
import toast from "react-hot-toast";

export function AddLinkForm({ onSuccess }) {
  const { user } = useAuthStore();
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [adding, setAdding] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !url) return;

    setAdding(true);
    try {
      // Get current link count to set position
      const { count } = await supabase
        .from("links")
        .select("*", { count: "exact", head: true })
        .eq("profile_id", user.id);

      const { error } = await supabase.from("links").insert([
        {
          profile_id: user.id,
          user_id: user.id,
          title,
          url,
          position: count || 0,
        },
      ]);

      if (error) throw error;

      setTitle("");
      setUrl("");
      toast.success("Link added!");
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error(error);
      toast.error("Failed to add link");
    } finally {
      setAdding(false);
    }
  };

  return (
    <Card className="p-4 border-2 border-slate-200 bg-slate-50/50 focus-within:border-brand-500 focus-within:bg-white transition-all shadow-sm">
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3">
        <div className="flex-1">
          <Input
            placeholder="Link Title (e.g. My Portfolio)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={adding}
            className="bg-transparent border-0 focus:ring-0 px-0 text-lg font-bold placeholder:text-slate-400"
          />
          <Input
            placeholder="URL (https://...)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={adding}
            className="bg-transparent border-0 focus:ring-0 px-0 text-sm text-slate-500 placeholder:text-slate-300 h-8"
          />
        </div>
        <div className="flex items-center">
          <Button 
            type="submit" 
            disabled={adding || !title || !url}
            className="w-full md:w-auto rounded-full aspect-square p-0 w-12 h-12 flex items-center justify-center shadow-lg shadow-brand-500/20"
          >
            {adding ? <Zap className="animate-pulse" size={20} /> : <Plus size={24} />}
          </Button>
        </div>
      </form>
    </Card>
  );
}