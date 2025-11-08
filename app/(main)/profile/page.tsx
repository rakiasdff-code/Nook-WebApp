"use client";

import { useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import { toast } from "sonner";

export default function ProfilePage() {
  const { user, userProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const getInitials = () => {
    if (userProfile?.displayName) {
      return userProfile.displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    return user?.email?.[0].toUpperCase() || "U";
  };

  const formatDate = (date: any) => {
    if (!date) return "N/A";
    try {
      const d = date.toDate ? date.toDate() : new Date(date);
      return d.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "N/A";
    }
  };

  return (
    <div className="min-h-screen bg-[#F2EBDF]">
      <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-serif text-[#555931] mb-2">
            Mi perfil
          </h1>
          <p className="text-lg font-sans text-[#888C65]">
            Gestiona tu información personal y preferencias
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
          {/* Cover Banner */}
          <div className="h-48 w-full rounded-t-2xl bg-gradient-to-r from-[#888C65] to-[#A3A692] relative overflow-hidden"></div>

          {/* Profile Info */}
          <div className="px-6 md:px-12 pb-8">
            {/* Avatar */}
            <div className="flex flex-col md:flex-row md:items-end gap-6 mb-8">
              <div className="relative -mt-16 ml-8">
                <div className="w-32 h-32 rounded-full border-4 border-white bg-[#555931] flex items-center justify-center text-white text-3xl font-serif shadow-lg">
                  {getInitials()}
                </div>
              </div>
              <div className="flex-1 md:mb-4">
                <h2 className="text-3xl font-serif text-[#555931] mb-1">
                  {userProfile?.displayName || "Usuario"}
                </h2>
                <p className="text-base font-sans text-[#888C65]">
                  {user?.email}
                </p>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="md:mb-4 px-6 py-3 bg-white border-2 border-[#555931] text-[#555931] rounded-lg hover:bg-[#555931] hover:text-white transition-all duration-300 font-sans font-medium"
              >
                {isEditing ? "Cancelar" : "Editar perfil"}
              </button>
            </div>

            {/* Information Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Email */}
              <div className="space-y-2">
                <label className="block text-sm font-medium font-sans text-[#555931] mb-2">
                  Email
                </label>
                <div className="w-full px-4 py-3 border-2 border-[#A3A692] rounded-lg font-sans text-[#403935] bg-[#F5F1E8]">
                  {user?.email}
                </div>
              </div>

              {/* Display Name */}
              <div className="space-y-2">
                <label className="block text-sm font-medium font-sans text-[#555931] mb-2">
                  Nombre
                </label>
                <div className="w-full px-4 py-3 border-2 border-[#A3A692] rounded-lg font-sans text-[#403935] bg-[#F5F1E8]">
                  {userProfile?.displayName || "No configurado"}
                </div>
              </div>

              {/* Email Verified */}
              <div className="space-y-2">
                <label className="block text-sm font-medium font-sans text-[#555931] mb-2">
                  Email verificado
                </label>
                <div className="w-full px-4 py-3 border-2 border-[#A3A692] rounded-lg font-sans text-[#403935] bg-[#F5F1E8] flex items-center gap-2">
                  {user?.emailVerified ? (
                    <>
                      <span className="text-[#555931]">✓</span>
                      <span>Verificado</span>
                    </>
                  ) : (
                    <>
                      <span className="text-[#D4A574]">⚠</span>
                      <span>No verificado</span>
                    </>
                  )}
                </div>
              </div>

              {/* Subscription */}
              <div className="space-y-2">
                <label className="block text-sm font-medium font-sans text-[#555931] mb-2">
                  Plan
                </label>
                <div className="w-full px-4 py-3 border-2 border-[#A3A692] rounded-lg font-sans text-[#403935] bg-[#F5F1E8] flex items-center justify-between">
                  <span className="capitalize">
                    {userProfile?.subscription || "Free"}
                  </span>
                  {userProfile?.subscription === "free" && (
                    <button className="text-sm font-semibold text-[#555931] hover:text-[#403935] transition-all duration-300">
                      Upgrade
                    </button>
                  )}
                </div>
              </div>

              {/* Member Since */}
              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium font-sans text-[#555931] mb-2">
                  Miembro desde
                </label>
                <div className="w-full px-4 py-3 border-2 border-[#A3A692] rounded-lg font-sans text-[#403935] bg-[#F5F1E8]">
                  {formatDate(userProfile?.createdAt)}
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="mt-12">
              <div className="bg-[#C85A54]/5 border-l-4 border-[#C85A54] rounded-lg p-6">
                <h3 className="text-xl font-serif text-[#C85A54] mb-2">
                  Zona de peligro
                </h3>
                <p className="text-sm font-sans text-[#59504A] mb-4">
                  Una vez que elimines tu cuenta, no hay vuelta atrás. Por favor, ten precaución.
                </p>
                <button
                  onClick={() =>
                    toast.error("Función no implementada aún", {
                      description: "La eliminación de cuenta estará disponible pronto",
                    })
                  }
                  className="px-6 py-3 bg-[#C85A54] text-white rounded-lg hover:bg-[#A84842] transition-all duration-300 font-sans font-medium"
                >
                  Eliminar cuenta
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="font-sans text-sm text-[#888C65]">
            ¿Necesitas ayuda? Contáctanos en{" "}
            <a
              href="mailto:support@nook.com"
              className="text-[#555931] hover:text-[#403935] transition-all duration-300 underline"
            >
              support@nook.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

