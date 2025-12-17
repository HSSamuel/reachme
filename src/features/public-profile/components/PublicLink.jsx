import { useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Lock, ChevronRight, Play } from "lucide-react";
import { cn } from "../../../lib/utils";
import { supabase } from "../../../config/supabaseClient";

export function PublicLink({ link, buttonStyle = "rounded-full" }) {
  const [isLocked, setIsLocked] = useState(!!link.gate_code);
  const [showInput, setShowInput] = useState(false);
  const [pin, setPin] = useState("");
  const [shake, setShake] = useState(false);

  // --- 1. ANALYTICS TRACKING (Fixed) ---
  const trackClick = async () => {
    try {
      await supabase.rpc("increment_clicks", { link_id: link.id });
    } catch (err) {
      console.error("Tracking error", err);
    }
  };

  // --- 2. STYLE HELPER (Fixed) ---
  const getStyleClasses = () => {
    switch (buttonStyle) {
      case "rounded-xl":
        return "rounded-xl border-2 border-transparent bg-white/90 hover:bg-white text-slate-900";
      case "rounded-none":
        return "rounded-none border-2 border-slate-900 bg-white hover:bg-slate-50 text-slate-900";
      case "shadow-hard":
        return "rounded-lg border-2 border-slate-900 bg-white text-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] active:shadow-none";
      default: // rounded-full
        return "rounded-full border-2 border-transparent bg-white/90 hover:bg-white text-slate-900";
    }
  };

  // --- 3. MEDIA DETECTION ---
  const getYouTubeId = (url) => {
    const match = url.match(
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    );
    return match && match[2].length === 11 ? match[2] : null;
  };
  const videoId = getYouTubeId(link.url);

  const isSpotify = link.url.includes("spotify.com");
  const getSpotifyEmbed = (url) => {
    const match = url.match(
      /open\.spotify\.com\/(track|album|playlist|episode)\/([a-zA-Z0-9]+)/
    );
    if (!match) return null;
    return `https://open.spotify.com/embed/${match[1]}/${match[2]}`;
  };

  const handleUnlock = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (pin === link.gate_code) {
      setIsLocked(false);
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 300);
      setPin("");
    }
  };

  // --- RENDER: LOCKED LINK ---
  if (isLocked) {
    return (
      <motion.div
        animate={shake ? { x: [-5, 5, -5, 5, 0] } : {}}
        className="bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-white/40 shadow-sm mb-4 cursor-pointer"
        onClick={() => setShowInput(true)}
      >
        {!showInput ? (
          <div className="flex items-center justify-between text-slate-600">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                <Lock size={18} />
              </div>
              <span className="font-medium">Locked Link</span>
            </div>
            <Lock size={16} className="opacity-50" />
          </div>
        ) : (
          <form onSubmit={handleUnlock} className="flex gap-2">
            <input
              type="password"
              placeholder="Enter PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-500"
              autoFocus
              onClick={(e) => e.stopPropagation()}
            />
            <button
              type="submit"
              className="bg-slate-900 text-white px-4 rounded-xl text-sm font-bold"
            >
              Unlock
            </button>
          </form>
        )}
      </motion.div>
    );
  }

  // --- RENDER: YOUTUBE ---
  if (videoId) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4 rounded-2xl overflow-hidden shadow-lg border border-white/20 bg-black aspect-video relative group"
      >
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          className="w-full h-full"
          title={link.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </motion.div>
    );
  }

  // --- RENDER: SPOTIFY ---
  if (isSpotify) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4"
      >
        <iframe
          src={getSpotifyEmbed(link.url)}
          width="100%"
          height="80"
          allow="encrypted-media"
          className="rounded-2xl shadow-md border border-white/20"
        ></iframe>
      </motion.div>
    );
  }

  // --- RENDER: STANDARD LINK (With Styles & Analytics) ---
  return (
    <motion.a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={trackClick}
      whileHover={buttonStyle !== "shadow-hard" ? { scale: 1.02 } : {}}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "flex items-center w-full p-2 pr-4 mb-4 transition-all duration-200 backdrop-blur-sm group",
        getStyleClasses() // <--- Applies the dynamic styles (Square, Retro, etc)
      )}
    >
      <div
        className={`w-12 h-12 overflow-hidden mr-4 bg-slate-100 flex-shrink-0 flex items-center justify-center ${
          buttonStyle === "rounded-none" ? "rounded-none" : "rounded-xl"
        }`}
      >
        {link.thumbnail_url ? (
          <img
            src={link.thumbnail_url}
            alt=""
            className="w-full h-full object-cover"
          />
        ) : (
          <ExternalLink size={20} className="text-slate-400" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-slate-800 truncate text-sm md:text-base">
          {link.title}
        </h3>
        <p className="text-xs text-slate-500 truncate opacity-70">
          {link.url.replace(/^https?:\/\//, "")}
        </p>
      </div>

      <div className="w-8 h-8 rounded-full bg-slate-50/50 flex items-center justify-center text-slate-400 group-hover:text-brand-600 transition-colors">
        <ChevronRight size={16} />
      </div>
    </motion.a>
  );
}
