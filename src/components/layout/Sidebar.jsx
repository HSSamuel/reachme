import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  PenTool,
  BarChart3,
  Settings,
  LogOut,
  Zap,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { useAuthStore } from "../../store/authStore";

export function Sidebar() {
  const location = useLocation();
  const signOut = useAuthStore((state) => state.signOut);

  const navItems = [
    { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
    { icon: PenTool, label: "Editor", href: "/dashboard/editor" },
    { icon: BarChart3, label: "Analytics", href: "/dashboard/analytics" },
    { icon: Settings, label: "Settings", href: "/dashboard/settings" },
  ];

  return (
    <aside className="w-20 lg:w-64 border-r border-slate-200 bg-white h-screen flex flex-col fixed left-0 top-0 z-50 transition-all duration-300">
      {/* Logo Area */}
      <div className="h-16 flex items-center justify-center lg:justify-start lg:px-6 border-b border-slate-100">
        <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white font-bold">
          <Zap size={18} fill="currentColor" />
        </div>
        <span className="hidden lg:block ml-3 font-heading font-bold text-xl text-dark-900">
          ReachMe
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center px-3 py-3 rounded-xl transition-all duration-200 group",
                isActive
                  ? "bg-brand-50 text-brand-600 font-medium"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <item.icon
                size={22}
                className={cn(
                  "shrink-0",
                  isActive
                    ? "text-brand-600"
                    : "text-slate-400 group-hover:text-slate-600"
                )}
              />
              <span className="hidden lg:block ml-3">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User / Logout */}
      <div className="p-3 border-t border-slate-100">
        <button
          onClick={signOut}
          className="w-full flex items-center px-3 py-3 rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
        >
          <LogOut size={22} className="shrink-0" />
          <span className="hidden lg:block ml-3 font-medium">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
