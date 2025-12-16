import { Sidebar } from "../../../components/layout/Sidebar";
import { Outlet, Navigate } from "react-router-dom";
import { useAuthStore } from "../../../store/authStore";

export function DashboardLayout() {
  const { session, loading } = useAuthStore();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
      </div>
    );
  }

  // Protected Route Logic: Redirect if not logged in
  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />

      {/* Main Content Area (Offset by sidebar width) */}
      <main className="pl-20 lg:pl-64 transition-all duration-300">
        <div className="max-w-7xl mx-auto p-4 md:p-8">
          {/* <Outlet /> renders the child route (Editor, Analytics, etc.) */}
          <Outlet />
        </div>
      </main>
    </div>
  );
}
