import { useParams } from "react-router-dom";
import { usePublicProfile } from "../hooks/usePublicProfile";
import { PublicLink } from "./PublicLink";
import { Loader2, AlertCircle } from "lucide-react";

export function PublicProfile() {
  const { username } = useParams();
  const { profile, links, loading, error } = usePublicProfile(username);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-slate-900">Profile Not Found</h1>
        <p className="text-slate-500 mt-2">
          The user @{username} does not exist.
        </p>
      </div>
    );
  }

  // Determine Background Style
  const bgStyle = profile.background_url
    ? {
        backgroundImage: `url(${profile.background_url})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }
    : { backgroundColor: profile.theme_color || "#eff6ff" }; // Default brand-50

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center py-12 px-4 transition-colors duration-500"
      style={bgStyle}
    >
      {/* Profile Card / Header */}
      <div className="w-full max-w-lg flex flex-col items-center mb-8 animate-slide-up">
        <div className="w-24 h-24 rounded-full border-4 border-white shadow-xl overflow-hidden mb-4">
          <img
            src={
              profile.avatar_url ||
              `https://api.dicebear.com/7.x/initials/svg?seed=${profile.username}`
            }
            alt={profile.username}
            className="w-full h-full object-cover"
          />
        </div>

        <h1 className="text-2xl font-bold text-slate-900 bg-white/50 backdrop-blur-md px-4 py-1 rounded-full mb-2">
          {profile.full_name || `@${profile.username}`}
        </h1>

        {profile.bio && (
          <p className="text-center text-slate-700 bg-white/30 backdrop-blur-sm p-2 rounded-xl max-w-sm">
            {profile.bio}
          </p>
        )}
      </div>

      {/* Links List */}
      <div
        className="w-full max-w-lg space-y-4 animate-slide-up"
        style={{ animationDelay: "0.1s" }}
      >
        {links.map((link) => (
          <PublicLink
            key={link.id}
            link={link}
            themeColor={profile.theme_color}
          />
        ))}

        {links.length === 0 && (
          <div className="text-center text-slate-500 py-10 bg-white/50 rounded-2xl">
            No links yet.
          </div>
        )}
      </div>

      {/* Branding Footer */}
      <div className="mt-auto pt-12">
        <a
          href="/"
          className="flex items-center gap-2 text-sm font-semibold text-slate-900/60 hover:text-slate-900 transition-colors"
        >
          <span>Powered by</span>
          <span className="text-brand-600">ReachMe</span>
        </a>
      </div>
    </div>
  );
}
