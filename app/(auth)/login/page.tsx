"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import AuthLayout from "@/components/auth/AuthLayout";
import { signIn } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const user = await signIn(email, password);
      
      // Check if email is verified
      if (!user.emailVerified) {
        toast.error("Por favor verifica tu email antes de iniciar sesión", {
          description: "Revisa tu bandeja de entrada y spam",
          duration: 5000
        });
        // Cerrar sesión si el email no está verificado
        const { signOut } = await import("@/lib/auth");
        await signOut();
        setIsLoading(false);
        return;
      }
      
      toast.success("¡Bienvenido de nuevo!");
      
      // Verificar si el usuario tiene perfil en Firestore
      const { getUserProfile } = await import("@/lib/auth");
      const profile = await getUserProfile(user.uid);
      
      if (!profile) {
        // Si no tiene perfil, ir a loading screen para crearlo
        console.log("Usuario sin perfil, redirigiendo a loading screen");
        router.push("/loading-register");
      } else {
        // Si ya tiene perfil, ir directamente a home
        router.push("/home");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      
      // Handle specific errors
      if (error.message.includes("user-not-found") || error.message.includes("wrong-password") || error.code === "auth/invalid-credential") {
        toast.error("Email o contraseña incorrectos");
      } else if (error.message.includes("too-many-requests")) {
        toast.error("Demasiados intentos. Por favor intenta más tarde.");
      } else if (error.message.includes("network")) {
        toast.error("Error de conexión. Por favor intenta de nuevo.");
      } else {
        toast.error(error.message || "Error al iniciar sesión");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="space-y-10">
        <div className="space-y-4">
          <h2 className="font-serif text-4xl font-medium text-nook-brown tracking-tight">
            Welcome back!
          </h2>
          <p className="font-sans text-xl text-nook-brown">
            Sign in to continue your reading journey
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
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
              className="w-full px-3 py-2 border border-brand-forest-light rounded-lg bg-white text-nook-brown focus:outline-none focus:ring-2 focus:ring-brand-forest disabled:opacity-50"
            />
          </div>

          <div className="flex items-center justify-between">
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
              type="button"
              className="font-sans text-base font-medium text-nook-green-light hover:underline disabled:opacity-50"
              disabled={isLoading}
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-brand-forest text-nook-cream font-sans text-base font-bold py-3 px-5 rounded-xl hover:bg-nook-green-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Signing in..." : "Sign in"}
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
              New to Nook?{" "}
              <Link
                href="/register"
                className="font-semibold text-brand-forest hover:underline"
              >
                Create an account
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
