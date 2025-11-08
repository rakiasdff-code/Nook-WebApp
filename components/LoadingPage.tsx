"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { createUserProfile } from "@/lib/auth";
import { toast } from "sonner";
import Image from "next/image";

export default function LoadingPage({
  titleText,
  subtitleText,
}: {
  titleText: string;
  subtitleText: string;
}) {
  const router = useRouter();
  const { user, userProfile, loading } = useAuth();
  const [showExtraText, setShowExtraText] = useState(false);
  const [isCreatingProfile, setIsCreatingProfile] = useState(false);
  const [minDelayPassed, setMinDelayPassed] = useState(false);

  // Delay mínimo de 4 segundos para la experiencia acogedora
  useEffect(() => {
    const minDelayTimer = setTimeout(() => {
      console.log("✅ Delay mínimo de 4 segundos completado");
      setMinDelayPassed(true);
    }, 4000);

    // Mostrar texto adicional después de 2.5 segundos
    const extraTextTimer = setTimeout(() => {
      setShowExtraText(true);
    }, 2500);

    return () => {
      clearTimeout(minDelayTimer);
      clearTimeout(extraTextTimer);
    };
  }, []);

  useEffect(() => {
    async function setupUserProfile() {
      // IMPORTANTE: NO redirigir hasta que haya pasado el delay mínimo
      if (!minDelayPassed) {
        console.log("⏱️ Esperando delay mínimo de 4 segundos...");
        return;
      }

      // Después del delay, verificar el estado del usuario
      if (!loading && !user) {
        console.log("❌ No hay usuario, redirigiendo a login");
        router.push("/login");
        return;
      }

      // Verificar si el email está verificado
      if (!loading && user && !user.emailVerified) {
        console.log("⚠️ Email no verificado, redirigiendo a login");
        toast.error("Debes verificar tu email antes de continuar");
        router.push("/login");
        return;
      }

      // Si ya hay perfil, redirigir a home
      if (!loading && user && userProfile) {
        console.log("✅ Usuario y perfil existen, redirigiendo a home");
        router.push("/home");
        return;
      }

      // Si hay usuario con email verificado pero no perfil, crearlo
      if (
        !loading &&
        user &&
        user.emailVerified &&
        !userProfile &&
        !isCreatingProfile
      ) {
        setIsCreatingProfile(true);
        console.log("⏳ Creando perfil de usuario en Firestore...");

        try {
          await createUserProfile(user);
          console.log(
            "✅ Perfil creado, esperando a que AuthContext lo detecte...",
          );
          // El AuthContext detectará el nuevo perfil y este useEffect se re-ejecutará
        } catch (error: any) {
          console.error("❌ Error al crear perfil:", error);
          toast.error("Error al crear tu perfil. Por favor intenta de nuevo.");
          router.push("/login");
        }
      }
    }

    setupUserProfile();
  }, [loading, user, userProfile, router, isCreatingProfile, minDelayPassed]);

  return (
    <div className="min-h-screen bg-[#F5F1E8] flex items-center justify-center px-4">
      <div className="text-center space-y-10 max-w-2xl mx-auto">
        {/* Ilustración animada - movimiento sutil arriba-abajo */}
        <div className="flex justify-center animate-float">
          <Image
            src="/recursos/book-illustration.png"
            alt="Book illustration"
            width={200}
            height={200}
            className="w-48 h-48 md:w-56 md:h-56 object-contain"
            priority
          />
        </div>

        {/* Main text */}
        <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-medium text-nook-brown leading-relaxed px-4">
          {titleText}
        </h1>

        {/* Loader - 3 animated dots con efecto de carga progresiva */}
        <div className="flex items-center justify-center gap-2.5">
          <div
            className="w-3 h-3 rounded-full bg-brand-forest animate-pulse-scale"
            style={{ animationDelay: "0ms" }}
          ></div>
          <div
            className="w-3 h-3 rounded-full bg-brand-forest animate-pulse-scale"
            style={{ animationDelay: "200ms" }}
          ></div>
          <div
            className="w-3 h-3 rounded-full bg-brand-forest animate-pulse-scale"
            style={{ animationDelay: "400ms" }}
          ></div>
        </div>

        {/* Extra text after 2.5 seconds */}
        {showExtraText && (
          <p className="font-sans text-lg text-nook-brown/70 animate-fade-in px-4">
            {subtitleText}
          </p>
        )}
      </div>
    </div>
  );
}
