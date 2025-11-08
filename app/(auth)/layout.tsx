"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, userProfile, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [hasRedirected, setHasRedirected] = useState(false);

  useEffect(() => {
    // Evitar redirecciones múltiples
    if (hasRedirected || loading) return;

    // Solo redirigir si el usuario está COMPLETAMENTE autenticado
    // (tiene email verificado Y perfil en Firestore)
    if (user && user.emailVerified && userProfile) {
      console.log("✅ AuthLayout: Usuario completamente autenticado, redirigiendo a /home");
      setHasRedirected(true);
      router.push("/home");
      return;
    }

    // Si hay usuario sin email verificado, permitir quedarse en /register
    // para que vea la pantalla de verificación de email
    if (user && !user.emailVerified) {
      console.log("⚠️ AuthLayout: Usuario sin verificar, permitiendo acceso a auth pages");
      return;
    }

    // Si no hay usuario, permitir acceso normal a login/register
    console.log("ℹ️ AuthLayout: Usuario no autenticado, permitiendo acceso a auth pages");
  }, [user, userProfile, loading, router, pathname, hasRedirected]);

  // Solo mostrar loading en la carga inicial, no en cada re-render
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F1E8]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-forest mx-auto"></div>
          <p className="font-sans text-lg text-nook-brown">Cargando...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
