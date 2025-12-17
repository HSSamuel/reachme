import { useState, useRef } from "react";
import { useProfile } from "../../../hooks/useProfile";
import { PhonePreview } from "./PhonePreview";
import {
  Upload,
  X,
  Instagram,
  Twitter,
  Linkedin,
  Share2,
  LayoutDashboard,
  Heart,
  Type,
  Mail,
  Loader2,
  Eye,
  Palette,
  Layout,
  ChevronDown,
  ChevronUp,
  Phone, // For Phone Number
  MessageCircle, // For WhatsApp
  Music2, // For TikTok
  Ghost, // For Snapchat
  Facebook, // For Facebook
  Youtube, // For YouTube
  Gamepad2, // For Discord
  Mic2, // For Spotify
  Github, // For GitHub
} from "lucide-react";
import { supabase } from "../../../config/supabaseClient";
import { Card } from "../../../components/ui/Card";
import { Switch } from "../../../components/ui/Switch";
import { Input } from "../../../components/ui/Input";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

export function AppearanceEditor() {
  const { profile, loading, updateProfile } = useProfile();
  const [uploading, setUploading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  // State to track which section is open (default to 'profile')
  const [openSection, setOpenSection] = useState("profile");

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  const handleFileUpload = async (e, field) => {
    try {
      setUploading(true);
      const file = e.target.files[0];
      if (!file) return;

      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const bucket = field === "avatar_url" ? "avatars" : "link_thumbnails";
      const filePath = `${profile.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
      await updateProfile({ [field]: data.publicUrl });
      toast.success("Image uploaded!");
    } catch (error) {
      console.error(error);
      toast.error("Error uploading image");
    } finally {
      setUploading(false);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="animate-spin text-slate-300" size={32} />
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto pb-24 px-4 relative">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Appearance</h1>
          <p className="text-slate-500 mt-1 text-sm">
            Customize your page branding.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
        {/* LEFT COLUMN: ACCORDION EDITOR */}
        <div className="xl:col-span-2 space-y-3">
          {/* 1. PROFILE DETAILS */}
          <AccordionItem
            title="Profile"
            icon={<Layout size={18} />}
            isOpen={openSection === "profile"}
            onClick={() => toggleSection("profile")}
          >
            <div className="flex items-start gap-5">
              <div className="relative group shrink-0">
                <div className="w-20 h-20 rounded-full overflow-hidden bg-slate-100 ring-2 ring-slate-100 shadow-sm">
                  {profile.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                      <Upload size={20} />
                    </div>
                  )}
                </div>
                <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-full text-white font-bold text-[10px] uppercase tracking-wide">
                  Change
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, "avatar_url")}
                    disabled={uploading}
                  />
                </label>
              </div>
              <div className="flex-1 space-y-3 min-w-0">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">
                    Username
                  </label>
                  <input
                    type="text"
                    disabled
                    value={`@${profile.username}`}
                    className="w-full text-sm font-bold text-slate-500 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 cursor-not-allowed"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">
                    Bio
                  </label>
                  <textarea
                    placeholder="Bio"
                    rows="2"
                    className="w-full text-sm text-slate-700 border border-slate-200 rounded-lg px-3 py-2 focus:border-indigo-500 outline-none resize-none bg-white transition-colors"
                    value={profile.bio || ""}
                    onChange={(e) => updateProfile({ bio: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </AccordionItem>

          {/* 2. BACKGROUND & THEME */}
          <AccordionItem
            title="Background & Theme"
            icon={<Palette size={18} />}
            isOpen={openSection === "theme"}
            onClick={() => toggleSection("theme")}
          >
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">
                  Page Background
                </label>
                <div className="grid grid-cols-4 gap-3">
                  <ColorPreset
                    color="#f8fafc"
                    label="Light"
                    onClick={() =>
                      updateProfile({
                        background_url: null,
                        background_color: "#f8fafc",
                      })
                    }
                    active={profile.background_color === "#f8fafc"}
                  />
                  <ColorPreset
                    color="#0f172a"
                    label="Dark"
                    onClick={() =>
                      updateProfile({
                        background_url: null,
                        background_color: "#0f172a",
                      })
                    }
                    active={profile.background_color === "#0f172a"}
                  />

                  {/* Custom Color */}
                  <div className="relative h-16 rounded-lg border border-slate-200 overflow-hidden group">
                    <input
                      type="color"
                      value={profile.background_color || "#ffffff"}
                      onChange={(e) =>
                        updateProfile({
                          background_url: null,
                          background_color: e.target.value,
                        })
                      }
                      className="absolute inset-0 w-[150%] h-[150%] -left-2 -top-2 cursor-pointer"
                    />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-white/50 group-hover:bg-transparent transition-colors">
                      <span className="text-[10px] font-bold text-slate-600">
                        Custom
                      </span>
                    </div>
                  </div>

                  {/* Image Upload */}
                  <div className="relative h-16 rounded-lg border-2 border-dashed border-slate-200 hover:border-indigo-300 transition-colors flex flex-col items-center justify-center text-slate-400 cursor-pointer bg-slate-50 hover:bg-white group overflow-hidden">
                    {profile.background_url ? (
                      <>
                        <img
                          src={profile.background_url}
                          className="absolute inset-0 w-full h-full object-cover opacity-60"
                          alt="bg"
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            updateProfile({ background_url: null });
                          }}
                          className="absolute top-1 right-1 bg-white shadow-sm p-1 rounded-full text-red-500 z-10 hover:scale-110 transition-transform"
                        >
                          <X size={12} />
                        </button>
                      </>
                    ) : (
                      <Upload size={16} />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={(e) => handleFileUpload(e, "background_url")}
                      disabled={uploading}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t border-slate-100">
                <label className="text-xs font-bold text-slate-500 uppercase">
                  Button & Text Color
                </label>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-full relative rounded-lg border border-slate-200 overflow-hidden flex items-center px-3 gap-3 bg-white">
                    <input
                      type="color"
                      value={profile.theme_color || "#000000"}
                      onChange={(e) =>
                        updateProfile({ theme_color: e.target.value })
                      }
                      className="w-6 h-6 rounded-md cursor-pointer border-0 p-0"
                    />
                    <span className="text-xs font-mono text-slate-500 uppercase">
                      {profile.theme_color}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </AccordionItem>

          {/* 3. BUTTON STYLE */}
          <AccordionItem
            title="Buttons"
            icon={<LayoutDashboard size={18} />}
            isOpen={openSection === "buttons"}
            onClick={() => toggleSection("buttons")}
          >
            <div className="grid grid-cols-4 gap-3">
              {[
                "rounded-full",
                "rounded-xl",
                "rounded-none",
                "shadow-hard",
              ].map((style) => (
                <button
                  key={style}
                  onClick={() => updateProfile({ button_style: style })}
                  className={`h-12 text-[10px] font-bold border transition-all rounded-lg flex items-center justify-center uppercase tracking-wide ${
                    profile.button_style === style
                      ? "bg-slate-900 text-white border-slate-900 shadow-md transform scale-105"
                      : "bg-white text-slate-500 border-slate-200 hover:border-indigo-300 hover:text-indigo-600"
                  }`}
                >
                  {style.replace("rounded-", "").replace("shadow-", "")}
                </button>
              ))}
            </div>
          </AccordionItem>

          {/* 4. TYPOGRAPHY */}
          <AccordionItem
            title="Typography"
            icon={<Type size={18} />}
            isOpen={openSection === "typography"}
            onClick={() => toggleSection("typography")}
          >
            <div className="grid grid-cols-1 gap-2">
              {[
                { val: "Inter", label: "Modern (Inter)" },
                { val: "DM Sans", label: "Friendly (DM Sans)" },
                { val: "Playfair Display", label: "Elegant (Playfair)" },
                { val: "Space Mono", label: "Technical (Space Mono)" },
                { val: "Pacifico", label: "Playful (Pacifico)" },
              ].map((font) => (
                <button
                  key={font.val}
                  onClick={() => updateProfile({ font_family: font.val })}
                  className={`p-3 text-left border rounded-lg transition-all flex justify-between items-center text-sm ${
                    profile.font_family === font.val
                      ? "border-indigo-500 bg-indigo-50 text-indigo-700 font-bold"
                      : "border-slate-200 hover:bg-slate-50 text-slate-600"
                  }`}
                >
                  <span style={{ fontFamily: font.val }}>{font.label}</span>
                  {profile.font_family === font.val && (
                    <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                  )}
                </button>
              ))}
            </div>
          </AccordionItem>

          {/* 5. SOCIAL ICONS */}
          <AccordionItem
            title="Social Icons & Contact"
            icon={<Share2 size={18} />}
            isOpen={openSection === "social"}
            onClick={() => toggleSection("social")}
          >
            <div className="space-y-6">
              {/* GROUP 1: DIRECT CONTACT */}
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Contact
                </label>
                <SocialInput
                  icon={<Phone size={16} className="text-green-600" />}
                  placeholder="Phone Number (e.g. +1 234...)"
                  value={profile.social_phone}
                  onChange={(v) => updateProfile({ social_phone: v })}
                />
                <SocialInput
                  icon={<MessageCircle size={16} className="text-[#25D366]" />}
                  placeholder="WhatsApp Link"
                  value={profile.social_whatsapp}
                  onChange={(v) => updateProfile({ social_whatsapp: v })}
                />
              </div>

              {/* GROUP 2: SOCIALS */}
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Socials
                </label>
                <SocialInput
                  icon={<Instagram size={16} className="text-[#E1306C]" />}
                  placeholder="Instagram URL"
                  value={profile.social_instagram}
                  onChange={(v) => updateProfile({ social_instagram: v })}
                />
                <SocialInput
                  icon={<Music2 size={16} className="text-black" />}
                  placeholder="TikTok URL"
                  value={profile.social_tiktok}
                  onChange={(v) => updateProfile({ social_tiktok: v })}
                />
                <SocialInput
                  icon={<Twitter size={16} className="text-[#1DA1F2]" />}
                  placeholder="Twitter / X URL"
                  value={profile.social_twitter}
                  onChange={(v) => updateProfile({ social_twitter: v })}
                />
                <SocialInput
                  icon={<Ghost size={16} className="text-[#eab308]" />}
                  placeholder="Snapchat URL"
                  value={profile.social_snapchat}
                  onChange={(v) => updateProfile({ social_snapchat: v })}
                />
                <SocialInput
                  icon={<Facebook size={16} className="text-[#1877F2]" />}
                  placeholder="Facebook URL"
                  value={profile.social_facebook}
                  onChange={(v) => updateProfile({ social_facebook: v })}
                />
                <SocialInput
                  icon={<Linkedin size={16} className="text-[#0077B5]" />}
                  placeholder="LinkedIn URL"
                  value={profile.social_linkedin}
                  onChange={(v) => updateProfile({ social_linkedin: v })}
                />
              </div>

              {/* GROUP 3: CONTENT & GAMING */}
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Content
                </label>
                <SocialInput
                  icon={<Youtube size={16} className="text-[#FF0000]" />}
                  placeholder="YouTube URL"
                  value={profile.social_youtube}
                  onChange={(v) => updateProfile({ social_youtube: v })}
                />
                <SocialInput
                  icon={<Gamepad2 size={16} className="text-[#5865F2]" />}
                  placeholder="Discord Server"
                  value={profile.social_discord}
                  onChange={(v) => updateProfile({ social_discord: v })}
                />
                <SocialInput
                  icon={<Mic2 size={16} className="text-[#1DB954]" />}
                  placeholder="Spotify URL"
                  value={profile.social_spotify}
                  onChange={(v) => updateProfile({ social_spotify: v })}
                />
                <SocialInput
                  icon={<Github size={16} className="text-[#181717]" />}
                  placeholder="GitHub URL"
                  value={profile.social_github}
                  onChange={(v) => updateProfile({ social_github: v })}
                />
                <SocialInput
                  icon={<Heart size={16} className="text-[#9146FF]" />}
                  placeholder="Twitch URL"
                  value={profile.social_twitch}
                  onChange={(v) => updateProfile({ social_twitch: v })}
                />
              </div>
            </div>
          </AccordionItem>

          {/* 6. ADVANCED FEATURES (Tipping & Email) */}
          <AccordionItem
            title="Features"
            icon={<Heart size={18} />}
            isOpen={openSection === "features"}
            onClick={() => toggleSection("features")}
          >
            <div className="space-y-6">
              {/* Tipping */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-slate-700">
                    Support / Tipping
                  </label>
                  <Switch
                    checked={profile.tipping_enabled || false}
                    onCheckedChange={(val) =>
                      updateProfile({ tipping_enabled: val })
                    }
                  />
                </div>
                {profile.tipping_enabled && (
                  <div className="grid grid-cols-2 gap-3 pl-2 border-l-2 border-slate-100">
                    <Input
                      placeholder="Button Title"
                      className="h-9 text-xs"
                      value={profile.tipping_title || ""}
                      onChange={(e) =>
                        updateProfile({ tipping_title: e.target.value })
                      }
                    />
                    <Input
                      placeholder="Payment URL"
                      className="h-9 text-xs"
                      value={profile.tipping_url || ""}
                      onChange={(e) =>
                        updateProfile({ tipping_url: e.target.value })
                      }
                    />
                  </div>
                )}
              </div>

              {/* Email Capture */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-slate-700">
                    Newsletter Form
                  </label>
                  <Switch
                    checked={profile.newsletter_enabled || false}
                    onCheckedChange={(val) =>
                      updateProfile({ newsletter_enabled: val })
                    }
                  />
                </div>
                {profile.newsletter_enabled && (
                  <div className="pl-2 border-l-2 border-slate-100">
                    <Input
                      placeholder="Form Title"
                      className="h-9 text-xs"
                      value={profile.newsletter_title || ""}
                      onChange={(e) =>
                        updateProfile({ newsletter_title: e.target.value })
                      }
                    />
                  </div>
                )}
              </div>
            </div>
          </AccordionItem>
        </div>

        {/* RIGHT COLUMN: PREVIEW */}
        <div className="hidden xl:block sticky top-8">
          <PhonePreview profile={profile} />
        </div>
      </div>

      {/* MOBILE PREVIEW */}
      <button
        onClick={() => setPreviewOpen(true)}
        className="xl:hidden fixed bottom-6 right-6 bg-slate-900 text-white px-6 py-3 rounded-full shadow-2xl z-40 font-bold flex items-center gap-2 hover:scale-105 transition-transform"
      >
        <Eye size={20} /> Preview
      </button>

      {previewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/95 backdrop-blur-sm p-4 animate-fade-in overflow-hidden">
          <button
            onClick={() => setPreviewOpen(false)}
            className="fixed top-6 right-6 z-[60] bg-white/20 p-3 rounded-full text-white hover:bg-white/30 backdrop-blur-md border border-white/10 shadow-xl transition-all"
          >
            <X size={28} />
          </button>
          <div className="relative h-full w-full flex items-center justify-center overflow-y-auto py-10">
            <div onClick={(e) => e.stopPropagation()}>
              <PhonePreview profile={profile} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- SUB-COMPONENTS FOR CLEANER CODE ---

function AccordionItem({ title, icon, children, isOpen, onClick }) {
  return (
    <div
      className={`border transition-all duration-300 rounded-xl bg-white overflow-hidden ${
        isOpen
          ? "border-indigo-200 shadow-lg ring-1 ring-indigo-100"
          : "border-slate-200 hover:border-slate-300"
      }`}
    >
      <button
        onClick={onClick}
        className={`w-full flex items-center justify-between p-4 text-left transition-colors ${
          isOpen ? "bg-indigo-50/50" : "bg-white"
        }`}
      >
        <div className="flex items-center gap-3 text-slate-700 font-bold text-sm">
          <div
            className={`p-1.5 rounded-lg ${
              isOpen
                ? "bg-indigo-100 text-indigo-600"
                : "bg-slate-100 text-slate-500"
            }`}
          >
            {icon}
          </div>
          {title}
        </div>
        {isOpen ? (
          <ChevronUp size={16} className="text-slate-400" />
        ) : (
          <ChevronDown size={16} className="text-slate-400" />
        )}
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-4 pt-0 border-t border-indigo-50/50">
              <div className="pt-4">{children}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ColorPreset({ color, label, onClick, active }) {
  return (
    <button
      onClick={onClick}
      className={`h-16 rounded-lg border transition-all flex flex-col items-center justify-center gap-1 ${
        active ? "border-indigo-500 ring-2 ring-indigo-200" : "border-slate-200"
      }`}
      style={{ backgroundColor: color }}
    >
      <span
        className={`text-[10px] font-bold ${
          color === "#0f172a" ? "text-white/50" : "text-slate-500"
        }`}
      >
        {label}
      </span>
    </button>
  );
}

function SocialInput({ icon, placeholder, value, onChange }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-8 flex justify-center">{icon}</div>
      <Input
        placeholder={placeholder}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 text-sm"
      />
    </div>
  );
}
