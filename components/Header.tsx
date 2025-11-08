"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import Logo from "./Logo";
import { useAuth } from "@/lib/AuthContext";
import { signOut } from "@/lib/auth";

export default function Header() {
  const { user, userProfile } = useAuth();
  const router = useRouter();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Sesión cerrada correctamente");
      router.push("/login");
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Error al cerrar sesión");
    }
  };

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

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#E0D8D1] bg-[rgba(250,250,249,0.80)] backdrop-blur-sm">
      <div className="w-full h-20 px-4 md:px-7 flex items-center justify-between">
        <div className="flex items-center gap-8 md:gap-12">
          <Link href="/home">
            <Logo iconOnly className="w-12 h-14" />
          </Link>

          <nav className="hidden md:flex items-center gap-6 lg:gap-12">
            <Link href="/my-nook" className="flex items-center gap-3">
              <span className="font-serif text-2xl font-normal text-brand-forest hover:text-nook-green-light transition-colors">
                My nook
              </span>
              <div className="w-1.5 h-1.5 rounded-full bg-brand-forest"></div>
            </Link>
            
            <Link href="/bookshelf" className="flex items-center gap-3">
              <span className="font-serif text-2xl font-normal text-brand-forest hover:text-nook-green-light transition-colors">
                Bookshelf
              </span>
              <div className="w-1.5 h-1.5 rounded-full bg-brand-forest"></div>
            </Link>
            
            <Link href="/explore" className="flex items-center gap-3">
              <span className="font-serif text-2xl font-normal text-brand-forest hover:text-nook-green-light transition-colors">
                Explore
              </span>
              <div className="w-1.5 h-1.5 rounded-full bg-brand-forest"></div>
            </Link>
            
            <Link href="/connect" className="font-serif text-2xl font-normal text-brand-forest hover:text-nook-green-light transition-colors">
              Connect
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="w-13 h-13 rounded-full bg-brand-forest flex items-center justify-center hover:bg-nook-green-dark transition-colors text-white font-sans font-bold text-lg"
              title={userProfile?.displayName || user?.email || "Usuario"}
            >
              {getInitials()}
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-[#E0D8D1] py-2 z-50">
                <div className="px-4 py-3 border-b border-[#E0D8D1]">
                  <p className="font-sans text-sm font-semibold text-nook-brown truncate">
                    {userProfile?.displayName || "Usuario"}
                  </p>
                  <p className="font-sans text-xs text-nook-brown/60 truncate">
                    {user?.email}
                  </p>
                  <p className="font-sans text-xs text-brand-forest font-medium mt-1">
                    Plan: {userProfile?.subscription === "premium" ? "Premium" : "Free"}
                  </p>
                </div>
                
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    router.push("/profile");
                  }}
                  className="w-full text-left px-4 py-2 font-sans text-sm text-nook-brown hover:bg-surface-paper-light transition-colors"
                >
                  Mi perfil
                </button>
                
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    router.push("/settings");
                  }}
                  className="w-full text-left px-4 py-2 font-sans text-sm text-nook-brown hover:bg-surface-paper-light transition-colors"
                >
                  Configuración
                </button>
                
                <div className="border-t border-[#E0D8D1] mt-2 pt-2">
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      handleLogout();
                    }}
                    className="w-full text-left px-4 py-2 font-sans text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Cerrar sesión
                  </button>
                </div>
              </div>
            )}
          </div>

          <button className="md:hidden w-9 h-7 flex flex-col justify-between">
            <div className="w-full h-0.5 bg-brand-forest"></div>
            <div className="w-full h-0.5 bg-brand-forest"></div>
            <div className="w-full h-0.5 bg-brand-forest"></div>
          </button>
        </div>
      </div>
    </header>
  );
}
