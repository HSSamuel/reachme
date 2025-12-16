import { useState } from "react";
import { supabase } from "../../../config/supabaseClient"; // Adjust path if needed
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const login = async (email, password) => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error(error.message);
      setIsLoading(false);
      return false;
    }

    toast.success("Welcome back!");
    setIsLoading(false);
    navigate("/dashboard");
    return true;
  };

  const register = async (email, password, username) => {
    setIsLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username },
      },
    });

    if (error) {
      toast.error(error.message);
      setIsLoading(false);
      return false;
    }

    toast.success("Account created! Please check your email.");
    setIsLoading(false);
    return true; // You might want to navigate to a "verify email" page
  };

  const socialLogin = async (provider) => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/dashboard` },
    });
    if (error) toast.error(error.message);
  };

  return { login, register, socialLogin, isLoading };
}
