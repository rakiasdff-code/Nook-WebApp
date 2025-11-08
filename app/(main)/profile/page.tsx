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
    <div className="min-h-screen bg-surface-paper py-12 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-4xl md:text-5xl font-semibold text-nook-brown mb-2">
            Mi perfil
          </h1>
          <p className="font-sans text-lg text-nook-brown/70">
            Gestiona tu información personal y preferencias
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#E0D8D1] overflow-hidden">
          {/* Cover Banner */}
          <div className="h-32 bg-gradient-to-r from-brand-forest to-nook-green-light"></div>

          {/* Profile Info */}
          <div className="px-6 md:px-12 pb-8">
            {/* Avatar */}
            <div className="flex flex-col md:flex-row md:items-end gap-6 -mt-16 mb-8">
              <div className="w-32 h-32 rounded-full bg-brand-forest flex items-center justify-center text-white font-sans font-bold text-4xl border-4 border-white shadow-lg">
                {getInitials()}
              </div>
              <div className="flex-1 md:mb-4">
                <h2 className="font-serif text-3xl font-semibold text-nook-brown mb-1">
                  {userProfile?.displayName || "Usuario"}
                </h2>
                <p className="font-sans text-base text-nook-brown/60">
                  {user?.email}
                </p>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="md:mb-4 font-sans text-base font-semibold text-brand-forest hover:text-nook-green-dark transition-colors border-2 border-brand-forest hover:border-nook-green-dark rounded-xl py-2.5 px-6"
              >
                {isEditing ? "Cancelar" : "Editar perfil"}
              </button>
            </div>

            {/* Information Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Email */}
              <div className="space-y-2">
                <label className="font-sans text-sm font-medium text-nook-brown/60 uppercase tracking-wide">
                  Email
                </label>
                <div className="font-sans text-lg text-nook-brown bg-surface-paper-light px-4 py-3 rounded-lg">
                  {user?.email}
                </div>
              </div>

              {/* Display Name */}
              <div className="space-y-2">
                <label className="font-sans text-sm font-medium text-nook-brown/60 uppercase tracking-wide">
                  Nombre
                </label>
                <div className="font-sans text-lg text-nook-brown bg-surface-paper-light px-4 py-3 rounded-lg">
                  {userProfile?.displayName || "No configurado"}
                </div>
              </div>

              {/* Email Verified */}
              <div className="space-y-2">
                <label className="font-sans text-sm font-medium text-nook-brown/60 uppercase tracking-wide">
                  Email verificado
                </label>
                <div className="font-sans text-lg text-nook-brown bg-surface-paper-light px-4 py-3 rounded-lg flex items-center gap-2">
                  {user?.emailVerified ? (
                    <>
                      <span className="text-green-600">✓</span>
                      <span>Verificado</span>
                    </>
                  ) : (
                    <>
                      <span className="text-orange-600">⚠</span>
                      <span>No verificado</span>
                    </>
                  )}
                </div>
              </div>

              {/* Subscription */}
              <div className="space-y-2">
                <label className="font-sans text-sm font-medium text-nook-brown/60 uppercase tracking-wide">
                  Plan
                </label>
                <div className="font-sans text-lg text-nook-brown bg-surface-paper-light px-4 py-3 rounded-lg flex items-center justify-between">
                  <span className="capitalize">
                    {userProfile?.subscription || "Free"}
                  </span>
                  {userProfile?.subscription === "free" && (
                    <button className="text-sm font-semibold text-brand-forest hover:text-nook-green-dark transition-colors">
                      Upgrade
                    </button>
                  )}
                </div>
              </div>

              {/* Member Since */}
              <div className="space-y-2 md:col-span-2">
                <label className="font-sans text-sm font-medium text-nook-brown/60 uppercase tracking-wide">
                  Miembro desde
                </label>
                <div className="font-sans text-lg text-nook-brown bg-surface-paper-light px-4 py-3 rounded-lg">
                  {formatDate(userProfile?.createdAt)}
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="mt-12 pt-8 border-t border-[#E0D8D1]">
              <h3 className="font-serif text-2xl font-semibold text-nook-brown mb-4">
                Zona de peligro
              </h3>
              <button
                onClick={() =>
                  toast.error("Función no implementada aún", {
                    description: "La eliminación de cuenta estará disponible pronto",
                  })
                }
                className="font-sans text-base font-semibold text-red-600 hover:text-red-700 transition-colors border-2 border-red-600 hover:border-red-700 rounded-xl py-2.5 px-6"
              >
                Eliminar cuenta
              </button>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="font-sans text-sm text-nook-brown/60">
            ¿Necesitas ayuda? Contáctanos en{" "}
            <a
              href="mailto:support@nook.com"
              className="text-brand-forest hover:text-nook-green-dark transition-colors underline"
            >
              support@nook.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

