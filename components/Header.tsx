"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import Logo from "./Logo";
import { useAuth } from "@/lib/AuthContext";
import { signOut } from "@/lib/auth";

export default function Header() {
  const { user, userProfile } = useAuth();
  const router = useRouter();
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Session closed successfully");
      router.push("/login");
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Error closing session");
    }
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

        <div className="flex items-center gap-3">
          {/* Profile Icon - Same size as menu */}
          <Link href="/profile">
            <button className="w-9 h-7 hover:opacity-80 transition-opacity relative flex items-center justify-center">
              {userProfile?.photoURL ? (
                <div className="w-7 h-7 rounded-full overflow-hidden border-2 border-[#5F6B39]">
                  <Image
                    src={userProfile.photoURL}
                    alt="Profile"
                    width={28}
                    height={28}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <Image
                  src="/recursos/profile-icon.svg"
                  alt="Profile"
                  width={28}
                  height={28}
                  className="w-7 h-7"
                />
              )}
            </button>
          </Link>

          {/* Settings Menu */}
          <div className="relative">
            <button
              onClick={() => setShowSettingsMenu(!showSettingsMenu)}
              className="w-9 h-7 hover:opacity-80 transition-opacity"
            >
              <Image
                src="/recursos/nav-options-icon.svg"
                alt="Settings"
                width={36}
                height={28}
                className="w-9 h-7"
              />
            </button>

            {showSettingsMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-[#A3A692] py-2 z-50">
                <div className="px-4 py-3 border-b border-[#A3A692]">
                  <p className="font-sans text-sm font-semibold text-[#555931] truncate">
                    {userProfile?.displayName || user?.email?.split("@")[0] || "User"}
                  </p>
                  <p className="font-sans text-xs text-[#888C65] truncate">
                    {user?.email}
                  </p>
                </div>
                
                <button
                  onClick={() => {
                    setShowSettingsMenu(false);
                    router.push("/settings");
                  }}
                  className="w-full text-left px-4 py-2 font-sans text-sm text-[#555931] hover:bg-[#F5F1E8] transition-colors"
                >
                  Settings
                </button>
                
                <button
                  onClick={() => {
                    setShowSettingsMenu(false);
                    // Theme toggle functionality
                    toast.info("Theme switching coming soon");
                  }}
                  className="w-full text-left px-4 py-2 font-sans text-sm text-[#555931] hover:bg-[#F5F1E8] transition-colors"
                >
                  Appearance
                </button>
                
                <button
                  onClick={() => {
                    setShowSettingsMenu(false);
                    router.push("/contact");
                  }}
                  className="w-full text-left px-4 py-2 font-sans text-sm text-[#555931] hover:bg-[#F5F1E8] transition-colors"
                >
                  Contact
                </button>
                
                <button
                  onClick={() => {
                    setShowSettingsMenu(false);
                    router.push("/about");
                  }}
                  className="w-full text-left px-4 py-2 font-sans text-sm text-[#555931] hover:bg-[#F5F1E8] transition-colors"
                >
                  About Us
                </button>
                
                <div className="border-t border-[#A3A692] mt-2 pt-2">
                  <button
                    onClick={() => {
                      setShowSettingsMenu(false);
                      handleLogout();
                    }}
                    className="w-full text-left px-4 py-2 font-sans text-sm text-[#C85A54] hover:bg-[#C85A54]/5 transition-colors"
                  >
                    Log Out
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu */}
          <button className="md:hidden w-9 h-7">
            <Image
              src="/recursos/nav-options-icon.svg"
              alt="Menu"
              width={36}
              height={28}
              className="w-9 h-7"
            />
          </button>
        </div>
      </div>
    </header>
  );
}
