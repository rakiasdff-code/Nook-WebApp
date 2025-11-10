"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import Logo from "./Logo";
import { useAuth } from "@/lib/AuthContext";
import { signOut } from "@/lib/auth";

export default function Header() {
  const { user, userProfile } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Determinar la sección actual para mostrar en mobile
  const getCurrentSection = () => {
    if (pathname.includes('/my-nook')) return 'My nook';
    if (pathname.includes('/bookshelf')) return 'Bookshelf';
    if (pathname.includes('/explore')) return 'Explore';
    if (pathname.includes('/connect')) return 'Connect';
    return 'My nook'; // Default para home
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showMobileMenu && !target.closest('.mobile-menu') && !target.closest('.mobile-menu-button')) {
        setShowMobileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMobileMenu]);

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
      <div className="w-full h-[72px] px-4 md:px-7 flex items-center justify-between">
        <div className="flex items-center gap-4 md:gap-8 lg:gap-10 xl:gap-12">
          <Link href="/home" className="py-4">
            <Logo iconOnly className="w-10 h-auto" />
          </Link>

          {/* Mobile Navigation Dropdown Trigger */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="mobile-menu-button md:hidden flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-surface-paper transition-colors"
            aria-label="Navigation menu"
          >
            <span className="font-serif text-base text-brand-forest whitespace-nowrap">
              {getCurrentSection()}
            </span>
            <svg
              width="14"
              height="14"
              viewBox="0 0 16 16"
              fill="none"
              className={`transition-transform duration-200 flex-shrink-0 ${showMobileMenu ? 'rotate-180' : ''}`}
            >
              <path
                d="M4 6L8 10L12 6"
                stroke="#566033"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center">
            <Link 
              href="/my-nook" 
              className="relative h-20 flex items-center px-6 lg:px-8 xl:px-10 group"
            >
              <span className={`font-serif text-base lg:text-lg xl:text-xl font-normal transition-colors whitespace-nowrap ${
                pathname === '/my-nook' 
                  ? 'text-nook-green-light' 
                  : 'text-brand-forest group-hover:text-nook-green-light'
              }`}>
                My nook
              </span>
              <div className={`absolute bottom-0 left-0 right-0 h-0.5 transition-colors ${
                pathname === '/my-nook'
                  ? 'bg-nook-green-light'
                  : 'bg-transparent group-hover:bg-nook-green-light'
              }`}></div>
            </Link>
            <div className="w-1 h-1 rounded-full bg-brand-forest/40"></div>
            
            <Link 
              href="/bookshelf" 
              className="relative h-20 flex items-center px-6 lg:px-8 xl:px-10 group"
            >
              <span className={`font-serif text-base lg:text-lg xl:text-xl font-normal transition-colors whitespace-nowrap ${
                pathname === '/bookshelf' 
                  ? 'text-nook-green-light' 
                  : 'text-brand-forest group-hover:text-nook-green-light'
              }`}>
                Bookshelf
              </span>
              <div className={`absolute bottom-0 left-0 right-0 h-0.5 transition-colors ${
                pathname === '/bookshelf'
                  ? 'bg-nook-green-light'
                  : 'bg-transparent group-hover:bg-nook-green-light'
              }`}></div>
            </Link>
            <div className="w-1 h-1 rounded-full bg-brand-forest/40"></div>
            
            <Link 
              href="/explore" 
              className="relative h-20 flex items-center px-6 lg:px-8 xl:px-10 group"
            >
              <span className={`font-serif text-base lg:text-lg xl:text-xl font-normal transition-colors whitespace-nowrap ${
                pathname === '/explore' 
                  ? 'text-nook-green-light' 
                  : 'text-brand-forest group-hover:text-nook-green-light'
              }`}>
                Explore
              </span>
              <div className={`absolute bottom-0 left-0 right-0 h-0.5 transition-colors ${
                pathname === '/explore'
                  ? 'bg-nook-green-light'
                  : 'bg-transparent group-hover:bg-nook-green-light'
              }`}></div>
            </Link>
            <div className="w-1 h-1 rounded-full bg-brand-forest/40"></div>
            
            <Link 
              href="/connect" 
              className="relative h-20 flex items-center px-6 lg:px-8 xl:px-10 group"
            >
              <span className={`font-serif text-base lg:text-lg xl:text-xl font-normal transition-colors whitespace-nowrap ${
                pathname === '/connect' 
                  ? 'text-nook-green-light' 
                  : 'text-brand-forest group-hover:text-nook-green-light'
              }`}>
                Connect
              </span>
              <div className={`absolute bottom-0 left-0 right-0 h-0.5 transition-colors ${
                pathname === '/connect'
                  ? 'bg-nook-green-light'
                  : 'bg-transparent group-hover:bg-nook-green-light'
              }`}></div>
            </Link>
          </nav>

          {/* Mobile Navigation Dropdown */}
          {showMobileMenu && (
            <div className="mobile-menu absolute top-[72px] left-4 bg-white border border-[#E0D8D1] rounded-lg shadow-md md:hidden z-50 animate-fadeIn">
              <nav className="py-2 space-y-1 min-w-[160px]">
                {pathname !== '/my-nook' && pathname !== '/home' && (
                  <Link
                    href="/my-nook"
                    onClick={() => setShowMobileMenu(false)}
                    className="block px-4 py-2.5 font-serif text-base text-brand-forest hover:bg-surface-paper hover:text-nook-green-light transition-colors"
                  >
                    My nook
                  </Link>
                )}
                
                {pathname !== '/bookshelf' && (
                  <Link
                    href="/bookshelf"
                    onClick={() => setShowMobileMenu(false)}
                    className="block px-4 py-2.5 font-serif text-base text-brand-forest hover:bg-surface-paper hover:text-nook-green-light transition-colors"
                  >
                    Bookshelf
                  </Link>
                )}
                
                {pathname !== '/explore' && (
                  <Link
                    href="/explore"
                    onClick={() => setShowMobileMenu(false)}
                    className="block px-4 py-2.5 font-serif text-base text-brand-forest hover:bg-surface-paper hover:text-nook-green-light transition-colors"
                  >
                    Explore
                  </Link>
                )}
                
                {pathname !== '/connect' && (
                  <Link
                    href="/connect"
                    onClick={() => setShowMobileMenu(false)}
                    className="block px-4 py-2.5 font-serif text-base text-brand-forest hover:bg-surface-paper hover:text-nook-green-light transition-colors"
                  >
                    Connect
                  </Link>
                )}
              </nav>
            </div>
          )}
        </div>

        <div className="flex items-center gap-6">
          {/* Profile Icon */}
          <Link href="/profile">
            <button className="w-10 h-10 hover:opacity-80 transition-opacity relative flex items-center justify-center flex-shrink-0">
              {userProfile?.photoURL ? (
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#5F6B39]">
                  <Image
                    src={userProfile.photoURL}
                    alt="Profile"
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <Image
                  src="/recursos/profile-icon.svg"
                  alt="Profile"
                  width={40}
                  height={40}
                  className="w-10 h-10"
                />
              )}
            </button>
          </Link>

          {/* Settings Menu */}
          <div className="relative flex-shrink-0">
            <button
              onClick={() => setShowSettingsMenu(!showSettingsMenu)}
              className="w-10 h-10 flex items-center justify-center rounded-lg transition-all group flex-shrink-0"
              aria-label="Settings"
            >
              <div className="flex flex-col gap-1.5 items-start">
                <span className="h-0.5 w-7 bg-brand-forest rounded-full transition-all group-hover:w-8"></span>
                <span className="h-0.5 w-6 bg-brand-forest rounded-full transition-all group-hover:w-7"></span>
                <span className="h-0.5 w-5 bg-brand-forest rounded-full transition-all group-hover:w-6"></span>
              </div>
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
        </div>
      </div>
    </header>
  );
}
