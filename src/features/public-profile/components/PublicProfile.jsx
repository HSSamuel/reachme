import { useParams } from "react-router-dom";
import { usePublicProfile } from "../hooks/usePublicProfile";
import { PublicLink } from "./PublicLink";
import { Loader2, AlertCircle, ShoppingBag, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { Instagram, Twitter, Linkedin, Github, Youtube } from "lucide-react";
import { SEO } from "../../../components/seo/SEO";
import { SubscribeBlock } from "./SubscribeBlock";

export function PublicProfile() {
  const { username } = useParams();
  const { profile, links, products, loading, error } =
    usePublicProfile(username);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 animate-spin text-slate-300" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 text-center">
        <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
        <h1 className="text-2xl font-bold text-slate-900">Profile Not Found</h1>
      </div>
    );
  }

  // Typography Helper
  const getFontStack = (font) => {
    switch (font) {
      case "Playfair Display":
        return '"Playfair Display", serif';
      case "Space Mono":
        return '"Space Mono", monospace';
      case "Pacifico":
        return '"Pacifico", cursive';
      case "DM Sans":
        return '"DM Sans", sans-serif';
      default:
        return '"Inter", sans-serif';
    }
  };

  // Contrast Helper
  const getContrastYIQ = (hexcolor) => {
    if (!hexcolor) return "black";
    hexcolor = hexcolor.replace("#", "");
    var r = parseInt(hexcolor.substr(0, 2), 16);
    var g = parseInt(hexcolor.substr(2, 2), 16);
    var b = parseInt(hexcolor.substr(4, 2), 16);
    var yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 128 ? "black" : "white";
  };

  // Background Logic
  const bgStyle = profile.background_url
    ? {
        backgroundImage: `url(${profile.background_url})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }
    : { backgroundColor: profile.theme_color || "#f8fafc" };

  // Theme Logic (Is the background dark?)
  const isDarkTheme =
    !profile.background_url &&
    getContrastYIQ(profile.theme_color || "#f8fafc") === "white";

  // Combined Check: Is the background effectively dark? (Image OR Dark Color)
  const isDarkBg = profile.background_url || isDarkTheme;

  return (
    <>
      <SEO
        title={profile.full_name || `@${profile.username}`}
        description={profile.bio}
        image={profile.avatar_url}
        url={window.location.href}
      />

      <div
        className="min-h-screen w-full overflow-x-hidden transition-colors duration-500 flex flex-col items-center justify-center py-8 sm:py-12 px-4"
        style={{
          ...bgStyle,
          fontFamily: getFontStack(profile.font_family),
        }}
      >
        {/* Dark Overlay for BG Images */}
        {profile.background_url && (
          <div className="fixed inset-0 bg-black/20 pointer-events-none" />
        )}

        {/* ✅ THE CONTAINER (Fixed Visibility) */}
        <div
          className={`relative z-10 w-full max-w-[600px] min-h-[500px] rounded-[2.5rem] p-6 sm:p-8 transition-all duration-500 ${
            isDarkBg
              ? "bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl shadow-black/20" // Dark Mode / Image Style
              : "bg-white/60 backdrop-blur-xl border border-white/50 shadow-xl shadow-slate-200/50" // Light Mode Style (Milky Glass)
          }`}
        >
          {/* 1. Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center text-center mb-8 w-full"
          >
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-[3px] border-white shadow-xl overflow-hidden mb-4 bg-white">
              <img
                src={
                  profile.avatar_url ||
                  `https://api.dicebear.com/7.x/initials/svg?seed=${profile.username}`
                }
                alt={profile.username}
                className="w-full h-full object-cover"
              />
            </div>

            <h1
              className={`text-2xl md:text-3xl font-bold mb-2 transition-colors duration-300 ${
                isDarkBg ? "text-white" : "text-slate-900"
              }`}
            >
              {profile.full_name || `@${profile.username}`}
            </h1>

            {profile.bio && (
              <p
                className={`font-medium text-sm sm:text-base max-w-xs leading-relaxed transition-colors duration-300 ${
                  isDarkBg ? "text-white/80" : "text-slate-600"
                }`}
              >
                {profile.bio}
              </p>
            )}
          </motion.div>

          {/* SOCIAL ICONS */}
          <div className="flex items-center justify-center gap-3 flex-wrap mb-8">
            {profile.social_instagram && (
              <SocialLink
                Icon={Instagram}
                url={profile.social_instagram}
                isDark={isDarkBg}
              />
            )}
            {profile.social_twitter && (
              <SocialLink
                Icon={Twitter}
                url={profile.social_twitter}
                isDark={isDarkBg}
              />
            )}
            {profile.social_linkedin && (
              <SocialLink
                Icon={Linkedin}
                url={profile.social_linkedin}
                isDark={isDarkBg}
              />
            )}
            {profile.social_github && (
              <SocialLink
                Icon={Github}
                url={profile.social_github}
                isDark={isDarkBg}
              />
            )}
            {profile.social_youtube && (
              <SocialLink
                Icon={Youtube}
                url={profile.social_youtube}
                isDark={isDarkBg}
              />
            )}
          </div>

          {/* Tipping Button */}
          {profile.tipping_enabled && profile.tipping_url && (
            <motion.a
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              href={profile.tipping_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-rose-500/20 mb-8"
            >
              <Heart size={18} fill="currentColor" />
              {profile.tipping_title || "Support Me"}
            </motion.a>
          )}

          {/* Newsletter (Inside the Card) */}
          {profile.newsletter_enabled && (
            <div className="mb-8">
              <SubscribeBlock
                profileId={profile.id}
                title={profile.newsletter_title}
                themeColor={profile.theme_color}
              />
            </div>
          )}

          {/* Products Grid */}
          {products.length > 0 && (
            <div className="w-full mb-8">
              <div className="flex items-center gap-3 mb-4 opacity-80">
                <div
                  className={`h-px flex-1 ${
                    isDarkBg ? "bg-white/30" : "bg-slate-300"
                  }`}
                ></div>
                <h3
                  className={`text-xs font-bold uppercase tracking-widest flex items-center gap-2 ${
                    isDarkBg ? "text-white" : "text-slate-500"
                  }`}
                >
                  <ShoppingBag size={12} /> Shop
                </h3>
                <div
                  className={`h-px flex-1 ${
                    isDarkBg ? "bg-white/30" : "bg-slate-300"
                  }`}
                ></div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {products.map((p) => (
                  <motion.a
                    key={p.id}
                    href={p.product_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -4 }}
                    className="bg-white p-3 rounded-xl shadow-sm border border-slate-100 block group overflow-hidden relative"
                  >
                    <div className="aspect-square bg-slate-50 rounded-lg mb-2 overflow-hidden">
                      {p.image_url ? (
                        <img
                          src={p.image_url}
                          alt=""
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                          <ShoppingBag />
                        </div>
                      )}
                    </div>
                    <div className="font-bold text-slate-900 text-xs truncate">
                      {p.title}
                    </div>
                    <div className="text-brand-600 font-bold text-[10px]">
                      {p.price}
                    </div>
                  </motion.a>
                ))}
              </div>
            </div>
          )}

          {/* Links List */}
          <div className="space-y-3">
            {links.map((link) => (
              <PublicLink
                key={link.id}
                link={link}
                buttonStyle={profile.button_style}
              />
            ))}
          </div>

          {/* Footer */}
          <div className="mt-12 text-center">
            <a
              href="/"
              className={`inline-flex items-center gap-1.5 opacity-60 hover:opacity-100 transition-opacity text-xs font-medium ${
                isDarkBg ? "text-white" : "text-slate-900"
              }`}
            >
              <span>Powered by</span>
              <span className="font-bold">ReachMe</span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

// Helper for Social Icons
function SocialLink({ Icon, url, isDark }) {
  return (
    <motion.a
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      href={url}
      target="_blank"
      className={`p-2.5 rounded-full backdrop-blur-sm transition-colors ${
        isDark
          ? "bg-white/10 text-white hover:bg-white/20"
          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
      }`}
    >
      <Icon size={20} />
    </motion.a>
  );
}
