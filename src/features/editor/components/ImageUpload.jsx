import { useState } from "react";
import { supabase } from "../../../config/supabaseClient";
import { Upload, Loader2, X } from "lucide-react";
import toast from "react-hot-toast";

export function ImageUpload({ onUpload, currentImage, label, shape = "square" }) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (event) => {
    try {
      setUploading(true);
      const file = event.target.files[0];
      if (!file) return;

      // 1. Create a unique file name
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      // 2. Upload to Supabase
      const { error: uploadError } = await supabase.storage
        .from("images") // Must match your bucket name
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 3. Get the Public URL
      const { data } = supabase.storage.from("images").getPublicUrl(filePath);

      // 4. Pass URL back to parent
      onUpload(data.publicUrl);
      toast.success("Image uploaded!");
    } catch (error) {
      toast.error("Error uploading image");
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-700">{label}</label>
      
      <div className="flex items-center gap-4">
        {/* Preview Area */}
        <div className={`
          relative overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center shrink-0
          ${shape === "circle" ? "w-20 h-20 rounded-full" : "w-24 h-16 rounded-lg"}
        `}>
          {currentImage ? (
            <img src={currentImage} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <div className="text-slate-300">
               <Upload size={20} />
            </div>
          )}
          
          {uploading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Loader2 className="animate-spin text-white" />
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2">
          <label className="cursor-pointer inline-flex items-center justify-center px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
            <span>{uploading ? "Uploading..." : "Choose Image"}</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleUpload}
              disabled={uploading}
            />
          </label>
          
          {currentImage && (
            <button 
              onClick={() => onUpload(null)} 
              className="text-xs text-red-500 hover:text-red-600 font-medium text-left px-1"
            >
              Remove image
            </button>
          )}
        </div>
      </div>
    </div>
  );
}