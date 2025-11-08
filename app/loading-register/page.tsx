"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { createUserProfile } from "@/lib/auth";
import { toast } from "sonner";

export default function LoadingRegisterPage() {
  const router = useRouter();
  const { user, userProfile, loading } = useAuth();
  const [showExtraText, setShowExtraText] = useState(false);
  const [isCreatingProfile, setIsCreatingProfile] = useState(false);

  useEffect(() => {
    // Mostrar texto adicional después de 4 segundos
    const timer = setTimeout(() => {
      setShowExtraText(true);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    async function setupUserProfile() {
      // Si no hay usuario, redirigir a registro
      if (!loading && !user) {
        console.log("❌ No hay usuario, redirigiendo a registro");
        router.push("/register");
        return;
      }

      // Si ya hay perfil, redirigir a home
      if (!loading && user && userProfile) {
        console.log("✅ Usuario y perfil ya existen, redirigiendo a home...");
        router.push("/home");
        return;
      }

      // Si hay usuario pero no perfil, crearlo
      if (!loading && user && !userProfile && !isCreatingProfile) {
        setIsCreatingProfile(true);
        console.log("⏳ Creando perfil de usuario en Firestore...");
        
        try {
          await createUserProfile(user);
          console.log("✅ Perfil creado, esperando a que se cargue...");
          // El AuthContext detectará el nuevo perfil y actualizará el estado
          // Luego este useEffect volverá a ejecutarse y redirigirá a home
        } catch (error: any) {
          console.error("❌ Error al crear perfil:", error);
          toast.error("Error al crear tu perfil. Por favor intenta de nuevo.");
          router.push("/register");
        }
      }
    }

    setupUserProfile();
  }, [loading, user, userProfile, router, isCreatingProfile]);

  return (
    <div className="min-h-screen bg-[#F5F1E8] flex items-center justify-center px-4">
      <div className="text-center space-y-8">
        {/* Main text */}
        <h1 className="font-serif text-4xl md:text-5xl font-medium text-nook-brown">
          Creating your nook...
        </h1>

        {/* Loader - 3 animated dots */}
        <div className="flex items-center justify-center gap-2">
          <div className="w-3 h-3 rounded-full bg-brand-forest animate-bounce" style={{ animationDelay: "0ms" }}></div>
          <div className="w-3 h-3 rounded-full bg-brand-forest animate-bounce" style={{ animationDelay: "150ms" }}></div>
          <div className="w-3 h-3 rounded-full bg-brand-forest animate-bounce" style={{ animationDelay: "300ms" }}></div>
        </div>

        {/* Extra text after 4 seconds */}
        {showExtraText && (
          <p className="font-sans text-lg text-nook-brown/70 animate-fade-in">
            This may take a few moments...
          </p>
        )}
      </div>
    </div>
  );
}

