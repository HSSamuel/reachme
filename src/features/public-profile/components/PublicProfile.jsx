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

  // --- 1. NEW: Typography Helper ---
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

  // Dynamic Background
  const bgStyle = profile.background_url
    ? {
        backgroundImage: `url(${profile.background_url})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }
    : { backgroundColor: profile.theme_color || "#f8fafc" };

  return (
    <>
      <SEO
        title={profile.full_name || `@${profile.username}`}
        description={profile.bio}
        image={profile.avatar_url}
        url={window.location.href}
      />

      <div
        className="min-h-screen w-full overflow-x-hidden transition-colors duration-500"
        style={{
          ...bgStyle,
          // --- 2. NEW: Apply Font Family Here ---
          fontFamily: getFontStack(profile.font_family),
        }}
      >
        {/* Overlay for readability if image bg is used */}
        {profile.background_url && (
          <div className="fixed inset-0 bg-black/20 pointer-events-none" />
        )}

        <div className="relative z-10 max-w-lg mx-auto px-4 py-12 flex flex-col items-center min-h-screen">
          {/* 1. Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center text-center mb-8 w-full"
          >
            <div className="w-28 h-28 rounded-full border-4 border-white shadow-2xl overflow-hidden mb-4 bg-white">
              <img
                src={
                  profile.avatar_url ||
                  `https://api.dicebear.com/7.x/initials/svg?seed=${profile.username}`
                }
                alt={profile.username}
                className="w-full h-full object-cover"
              />
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 bg-white/60 backdrop-blur-md px-6 py-2 rounded-full shadow-sm mb-3">
              {profile.full_name || `@${profile.username}`}
            </h1>

            {profile.bio && (
              <p className="text-slate-800 font-medium bg-white/40 backdrop-blur-sm px-4 py-2 rounded-xl max-w-sm leading-relaxed">
                {profile.bio}
              </p>
            )}
          </motion.div>

          {/* SOCIAL ICONS ROW */}
          <div className="flex items-center gap-4 mt-4 mb-6">
            {profile.social_instagram && (
              <motion.a
                whileHover={{ scale: 1.2 }}
                href={profile.social_instagram}
                target="_blank"
                className="text-slate-700 hover:text-pink-600 bg-white/50 p-2 rounded-full backdrop-blur-sm transition-colors"
              >
                <Instagram size={24} />
              </motion.a>
            )}
            {profile.social_twitter && (
              <motion.a
                whileHover={{ scale: 1.2 }}
                href={profile.social_twitter}
                target="_blank"
                className="text-slate-700 hover:text-blue-400 bg-white/50 p-2 rounded-full backdrop-blur-sm transition-colors"
              >
                <Twitter size={24} />
              </motion.a>
            )}
            {profile.social_linkedin && (
              <motion.a
                whileHover={{ scale: 1.2 }}
                href={profile.social_linkedin}
                target="_blank"
                className="text-slate-700 hover:text-blue-700 bg-white/50 p-2 rounded-full backdrop-blur-sm transition-colors"
              >
                <Linkedin size={24} />
              </motion.a>
            )}
            {profile.social_github && (
              <motion.a
                whileHover={{ scale: 1.2 }}
                href={profile.social_github}
                target="_blank"
                className="text-slate-700 hover:text-slate-900 bg-white/50 p-2 rounded-full backdrop-blur-sm transition-colors"
              >
                <Github size={24} />
              </motion.a>
            )}
            {profile.social_youtube && (
              <motion.a
                whileHover={{ scale: 1.2 }}
                href={profile.social_youtube}
                target="_blank"
                className="text-slate-700 hover:text-red-600 bg-white/50 p-2 rounded-full backdrop-blur-sm transition-colors"
              >
                <Youtube size={24} />
              </motion.a>
            )}
          </div>

          {/* 2. Tipping / Support */}
          {profile.tipping_enabled && profile.tipping_url && (
            <motion.a
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href={profile.tipping_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-3 rounded-full font-bold shadow-lg shadow-rose-500/30 mb-8"
            >
              <Heart size={18} fill="currentColor" />
              {profile.tipping_title || "Support Me"}
            </motion.a>
          )}

          {/* 3. Products Grid */}
          {products.length > 0 && (
            <div className="w-full mb-8">
              <h3 className="text-sm font-bold text-slate-900/70 uppercase tracking-wider mb-4 flex items-center gap-2">
                <ShoppingBag size={16} /> Shop
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {products.map((p) => (
                  <motion.a
                    key={p.id}
                    href={p.product_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -5 }}
                    className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 block group"
                  >
                    <div className="aspect-square bg-slate-50 rounded-xl mb-3 overflow-hidden">
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
                    <div className="font-bold text-slate-900 text-sm truncate">
                      {p.title}
                    </div>
                    <div className="text-brand-600 font-bold text-xs">
                      {p.price}
                    </div>
                  </motion.a>
                ))}
              </div>
            </div>
          )}

          {/* 3.5. Newsletter Subscription (NEW) */}
          {profile.newsletter_enabled && (
            <SubscribeBlock
              profileId={profile.id}
              title={profile.newsletter_title}
              themeColor={profile.theme_color}
            />
          )}

          {/* 4. Links List */}
          <div className="w-full space-y-4 flex-1">
            {links.map((link) => (
              <PublicLink
                key={link.id}
                link={link}
                buttonStyle={profile.button_style}
              />
            ))}
          </div>

          {/* 5. Footer */}
          <div className="mt-12 pt-6 border-t border-slate-900/5 w-full flex justify-center">
            <a
              href="/"
              className="flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity"
            >
              <span className="text-xs font-semibold bg-black text-white px-2 py-1 rounded">
                ReachMe
              </span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
