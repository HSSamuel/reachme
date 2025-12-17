import { Mail } from "lucide-react";

export function SubscribeBlock({ title, themeColor }) {
  return (
    <div className="bg-white/90 backdrop-blur-sm p-3 rounded-xl shadow-sm border border-white/50 text-center mx-auto max-w-[95%]">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
          <Mail size={14} className="text-slate-600" />
        </div>
        <h3 className="font-bold text-slate-800 text-xs text-left leading-tight line-clamp-2">
          {title || "Join my newsletter"}
        </h3>
      </div>

      <div className="flex gap-2">
        <input
          type="email"
          placeholder="Email address"
          className="w-full h-8 text-[10px] px-2 bg-slate-50 rounded-lg border border-slate-200 outline-none focus:border-slate-400 transition-colors"
          disabled
        />
        <button
          className="h-8 text-[10px] font-bold text-white px-3 rounded-lg shadow-sm whitespace-nowrap"
          style={{ backgroundColor: themeColor || "#000" }}
        >
          Subscribe
        </button>
      </div>
    </div>
  );
}
