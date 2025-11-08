"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, userProfile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      // Si no hay usuario, redirigir al login
      if (!user) {
        console.log("⚠️ ProtectedRoute: No hay usuario, redirigiendo a /login");
        router.push("/login");
        return;
      }

      // Si el email no está verificado, redirigir al login
      if (!user.emailVerified) {
        console.log("⚠️ ProtectedRoute: Email no verificado, redirigiendo a /login");
        router.push("/login");
        return;
      }

      // Si no hay perfil en Firestore, redirigir a la página de loading para crearlo
      if (!userProfile) {
        console.log("⚠️ ProtectedRoute: Usuario sin perfil, redirigiendo a /loading-register");
        router.push("/loading-register");
        return;
      }

      console.log("✅ ProtectedRoute: Usuario verificado y con perfil");
    }
  }, [user, userProfile, loading, router]);

  // Mostrar loading mientras se verifica la autenticación
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-paper">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-forest mx-auto"></div>
          <p className="font-sans text-lg text-nook-brown">Cargando...</p>
        </div>
      </div>
    );
  }

  // Si no hay usuario o email no verificado o no hay perfil, no renderizar nada (se está redirigiendo)
  if (!user || !user.emailVerified || !userProfile) {
    return null;
  }

  // Usuario autenticado, email verificado y con perfil, mostrar el contenido
  return <>{children}</>;
}

