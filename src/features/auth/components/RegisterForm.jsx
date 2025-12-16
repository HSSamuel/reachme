import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import { Link } from "react-router-dom";
import { User, Lock, Mail, Github, ArrowRight } from "lucide-react";

export function RegisterForm() {
  const { register, isLoading, socialLogin } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await register(email, password, username);
  };

  return (
    <div className="min-h-screen bg-brand-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto border-none shadow-2xl shadow-brand-900/10 animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-heading font-bold text-dark-900">
            Join ReachMe
          </h1>
          <p className="text-slate-500 mt-2">Create your free account today.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username Input */}
          <div>
            <div className="relative">
              <span className="absolute left-4 top-3.5 text-slate-400">
                <User size={18} />
              </span>
              <Input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="pl-11" // Add padding for icon
              />
            </div>
          </div>

          {/* Email Input */}
          <div>
            <div className="relative">
              <span className="absolute left-4 top-3.5 text-slate-400">
                <Mail size={18} />
              </span>
              <Input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-11"
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <div className="relative">
              <span className="absolute left-4 top-3.5 text-slate-400">
                <Lock size={18} />
              </span>
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pl-11"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full group"
            size="lg"
            isLoading={isLoading}
          >
            Create Account
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </form>

        {/* Social Register */}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-slate-500">Or join with</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => socialLogin("google")}
            >
              Google
            </Button>
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => socialLogin("github")}
            >
              <Github className="mr-2 h-4 w-4" />
              GitHub
            </Button>
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-brand-600 hover:text-brand-500 hover:underline"
          >
            Log in
          </Link>
        </p>
      </Card>
    </div>
  );
}
