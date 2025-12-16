import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authStore";
import { PublicProfile } from "./features/public-profile/components/PublicProfile";
import { RegisterForm } from "./features/auth/components/RegisterForm";
import { LoginForm } from "./features/auth/components/LoginForm";
import { DashboardLayout } from "./features/dashboard/components/DashboardLayout";
import { DashboardHome } from "./features/dashboard/components/DashboardHome";
import { LinkEditor } from "./features/editor/components/LinkEditor";

export default function App() {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <BrowserRouter>
      <Toaster position="bottom-center" />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />

        {/* Protected Dashboard Routes */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="editor" element={<LinkEditor />} />
          <Route path="analytics" element={<div>Analytics Coming Soon</div>} />
          <Route path="settings" element={<div>Settings Coming Soon</div>} />
        </Route>

        {/* Public Profile Route */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/:username" element={<PublicProfile />} />
      </Routes>
    </BrowserRouter>
  );
}
