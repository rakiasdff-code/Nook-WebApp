"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthLayout from "@/components/auth/AuthLayout";

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords don't match");
      return;
    }

    setIsLoading(true);

    try {
      // TODO: Implement Firebase authentication
      // await signUp(email, password, username);
      router.push("/loading");
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="space-y-10">
        <div className="space-y-4">
          <h2 className="font-serif text-4xl font-medium text-nook-brown tracking-tight">
            Welcome to Nook!
          </h2>
          <p className="font-sans text-xl text-nook-brown">
            Create your account to start your reading journey
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="username"
              className="font-sans text-base font-medium text-nook-brown"
            >
              User name
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="your name"
              disabled={isLoading}
              required
              className="w-full px-3 py-2 border border-brand-forest-light rounded-lg bg-white text-nook-brown placeholder:text-nook-brown placeholder:font-light placeholder:text-sm focus:outline-none focus:ring-2 focus:ring-brand-forest disabled:opacity-50"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="email"
              className="font-sans text-base font-medium text-nook-brown"
            >
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              disabled={isLoading}
              required
              className="w-full px-3 py-2 border border-brand-forest-light rounded-lg bg-white text-nook-brown placeholder:text-nook-brown placeholder:font-light placeholder:text-sm focus:outline-none focus:ring-2 focus:ring-brand-forest disabled:opacity-50"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="font-sans text-base font-medium text-nook-brown"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={isLoading}
                required
                minLength={6}
                className="w-full px-3 py-2 border border-brand-forest-light rounded-lg bg-white text-nook-brown focus:outline-none focus:ring-2 focus:ring-brand-forest disabled:opacity-50"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="confirmPassword"
                className="font-sans text-base font-medium text-nook-brown"
              >
                Confirm password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                disabled={isLoading}
                required
                minLength={6}
                className="w-full px-3 py-2 border border-brand-forest-light rounded-lg bg-white text-nook-brown focus:outline-none focus:ring-2 focus:ring-brand-forest disabled:opacity-50"
              />
            </div>
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              disabled={isLoading}
              className="w-5 h-5 border border-brand-forest-light rounded accent-brand-forest disabled:opacity-50"
            />
            <span className="font-sans text-base font-medium text-nook-green-light">
              Remember me
            </span>
          </label>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-brand-forest text-nook-cream font-sans text-base font-bold py-3 px-5 rounded-xl hover:bg-nook-green-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Creating your nook..." : "Create your nook"}
          </button>
        </form>

        <div className="space-y-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-brand-forest-light" />
            </div>
            <div className="relative flex justify-center text-base">
              <span className="px-4 bg-[#F5F3F0] font-sans text-base font-medium text-nook-brown">
                or
              </span>
            </div>
          </div>

          <div className="text-center space-y-2">
            <div className="font-sans text-base font-medium text-nook-brown">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-brand-forest hover:underline"
              >
                Sign in
              </Link>
            </div>
          </div>

          <div className="border-t border-brand-forest-light pt-8">
            <p className="text-center font-sans text-base text-nook-brown">
              By continuing, you agree to Nook's{" "}
              <span className="font-bold text-nook-green-light">
                Terms of Service
              </span>{" "}
              and{" "}
              <span className="font-bold text-nook-green-light">
                Privacy Policy
              </span>
            </p>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
