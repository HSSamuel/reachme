import { ExternalLink } from "lucide-react";
import { cn } from "../../../lib/utils";

export function PublicLink({ link, themeColor }) {
  // Simple check to see if background is dark (to adjust text color)
  const isDark =
    themeColor?.startsWith("#") &&
    parseInt(themeColor.replace("#", ""), 16) < 0xffffff / 2;

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "flex items-center w-full p-4 mb-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg active:scale-95",
        "bg-white/90 backdrop-blur-sm border border-white/20 shadow-sm"
      )}
      style={
        {
          // If the user has a custom theme color, we can apply it here
          // For now, we keep it clean white/glass
        }
      }
    >
      {link.thumbnail_url ? (
        <img
          src={link.thumbnail_url}
          alt=""
          className="w-10 h-10 rounded-lg object-cover mr-4"
        />
      ) : (
        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center mr-4 text-gray-400">
          <ExternalLink size={20} />
        </div>
      )}

      <div className="flex-1 text-center pr-10">
        {" "}
        {/* pr-10 balances the icon width for centering */}
        <h3 className="font-bold text-slate-800">{link.title}</h3>
      </div>
    </a>
  );
}
