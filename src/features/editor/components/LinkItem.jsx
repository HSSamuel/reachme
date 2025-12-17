import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { supabase } from "../../../config/supabaseClient";
import { Card } from "../../../components/ui/Card";
import { Switch } from "../../../components/ui/Switch";
import {
  Trash2,
  GripVertical,
  Image as ImageIcon,
  Lock,
  BarChart2,
} from "lucide-react";
import { ImageUpload } from "./ImageUpload";
import { Input } from "../../../components/ui/Input";
import toast from "react-hot-toast";

export function LinkItem({ link, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [showLockInput, setShowLockInput] = useState(false);

  // DND Hook
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: link.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.5 : 1,
  };

  const toggleActive = async () => {
    try {
      const { error } = await supabase
        .from("links")
        .update({ active: !link.active })
        .eq("id", link.id);
      if (error) throw error;
      onUpdate();
    } catch (err) {
      toast.error("Failed to update");
    }
  };

  const deleteLink = async () => {
    if (!window.confirm("Delete this link?")) return;
    try {
      const { error } = await supabase.from("links").delete().eq("id", link.id);
      if (error) throw error;
      toast.success("Link deleted");
      onUpdate();
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  const updateGateCode = async (code) => {
    // If empty string, set to null to remove lock
    const val = code.trim() === "" ? null : code.trim();
    await supabase.from("links").update({ gate_code: val }).eq("id", link.id);
    onUpdate();
  };

  return (
    <div ref={setNodeRef} style={style} className="touch-none">
      <Card
        className={`group transition-all ${
          !link.active ? "opacity-60 bg-slate-50" : "hover:border-brand-300"
        }`}
      >
        <div className="p-4 flex items-center gap-4">
          {/* DRAG HANDLE */}
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-600 p-1"
          >
            <GripVertical size={20} />
          </button>

          {/* Thumbnail Preview */}
          <div className="w-10 h-10 rounded-lg bg-slate-100 overflow-hidden shrink-0">
            {link.thumbnail_url ? (
              <img
                src={link.thumbnail_url}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-300">
                <ImageIcon size={16} />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0" onClick={() => setEditing(!editing)}>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-800 truncate cursor-pointer hover:text-brand-600 transition-colors">
                {link.title}
              </h3>
              {link.gate_code && <Lock size={12} className="text-red-500" />}
            </div>
            <p className="text-xs text-slate-400 truncate">{link.url}</p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-1 text-xs text-slate-400">
              <BarChart2 size={14} /> {link.clicks || 0}
            </div>
            <Switch checked={link.active} onCheckedChange={toggleActive} />
          </div>
        </div>

        {/* Editing Dropdown Area */}
        {editing && (
          <div className="px-4 pb-4 pt-0 animate-slide-up">
            <div className="pt-4 border-t border-slate-100 space-y-4">
              {/* 1. Image Upload */}
              <ImageUpload
                label="Thumbnail"
                shape="square"
                currentImage={link.thumbnail_url}
                onUpload={async (url) => {
                  await supabase
                    .from("links")
                    .update({ thumbnail_url: url })
                    .eq("id", link.id);
                  onUpdate();
                }}
              />

              {/* 2. Lock / Gate Code */}
              <div>
                <button
                  onClick={() => setShowLockInput(!showLockInput)}
                  className={`text-xs font-bold flex items-center gap-1 ${
                    link.gate_code
                      ? "text-red-500"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  <Lock size={14} />{" "}
                  {link.gate_code
                    ? "Link is Locked (Click to change)"
                    : "Add Lock / PIN Code"}
                </button>

                {showLockInput && (
                  <div className="mt-2 flex gap-2">
                    <Input
                      placeholder="Enter PIN (e.g. 1234)"
                      defaultValue={link.gate_code || ""}
                      onChange={(e) => updateGateCode(e.target.value)}
                    />
                    <div className="text-xs text-slate-400 flex items-center">
                      Leave empty to remove lock.
                    </div>
                  </div>
                )}
              </div>

              {/* 3. Footer Actions */}
              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={deleteLink}
                  className="text-red-500 text-sm hover:underline flex items-center gap-1"
                >
                  <Trash2 size={14} /> Delete Link
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="text-slate-500 text-sm hover:text-slate-800"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
