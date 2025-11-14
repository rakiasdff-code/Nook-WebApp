"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import Logo from "./Logo";
import { useAuth } from "@/lib/AuthContext";
import { useTheme } from "@/lib/ThemeContext";
import { signOut } from "@/lib/auth";

export default function Header() {
  const { user, userProfile } = useAuth();
  const { theme, toggleTheme } = useTheme();
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
    <header className="sticky top-0 z-50 w-full border-b border-[#E0D8D1] bg-[rgba(250,250,249,0.80)] backdrop-blur-sm dark:bg-[#403934] dark:border-[#4D453F] transition-colors">
      <div className="w-full h-[72px] px-4 md:px-7 flex items-center justify-between">
        <div className="flex items-center gap-4 md:gap-8 lg:gap-10 xl:gap-12">
          <Link href="/home" className="py-4">
            <Logo iconOnly className="w-10 h-auto" />
          </Link>

          {/* Mobile Navigation Dropdown Trigger */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="mobile-menu-button md:hidden flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-surface-paper dark:hover:bg-[#4D453F] transition-colors"
            aria-label="Navigation menu"
          >
            <span className="font-serif text-base text-brand-forest dark:text-[#FCFBF8] whitespace-nowrap">
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
                stroke="currentColor"
                className="text-brand-forest dark:text-[#FCFBF8]"
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
                  : 'text-brand-forest dark:text-[#FCFBF8] group-hover:text-nook-green-light'
              }`}>
                My nook
              </span>
              <div className={`absolute bottom-0 left-0 right-0 h-0.5 transition-colors ${
                pathname === '/my-nook'
                  ? 'bg-nook-green-light'
                  : 'bg-transparent group-hover:bg-nook-green-light'
              }`}></div>
            </Link>
            <div className="w-1 h-1 rounded-full bg-brand-forest/40 dark:bg-[#FCFBF8]/40"></div>

            <Link
              href="/bookshelf"
              className="relative h-20 flex items-center px-6 lg:px-8 xl:px-10 group"
            >
              <span className={`font-serif text-base lg:text-lg xl:text-xl font-normal transition-colors whitespace-nowrap ${
                pathname === '/bookshelf'
                  ? 'text-nook-green-light'
                  : 'text-brand-forest dark:text-[#FCFBF8] group-hover:text-nook-green-light'
              }`}>
                Bookshelf
              </span>
              <div className={`absolute bottom-0 left-0 right-0 h-0.5 transition-colors ${
                pathname === '/bookshelf'
                  ? 'bg-nook-green-light'
                  : 'bg-transparent group-hover:bg-nook-green-light'
              }`}></div>
            </Link>
            <div className="w-1 h-1 rounded-full bg-brand-forest/40 dark:bg-[#FCFBF8]/40"></div>

            <Link
              href="/explore"
              className="relative h-20 flex items-center px-6 lg:px-8 xl:px-10 group"
            >
              <span className={`font-serif text-base lg:text-lg xl:text-xl font-normal transition-colors whitespace-nowrap ${
                pathname === '/explore'
                  ? 'text-nook-green-light'
                  : 'text-brand-forest dark:text-[#FCFBF8] group-hover:text-nook-green-light'
              }`}>
                Explore
              </span>
              <div className={`absolute bottom-0 left-0 right-0 h-0.5 transition-colors ${
                pathname === '/explore'
                  ? 'bg-nook-green-light'
                  : 'bg-transparent group-hover:bg-nook-green-light'
              }`}></div>
            </Link>
            <div className="w-1 h-1 rounded-full bg-brand-forest/40 dark:bg-[#FCFBF8]/40"></div>

            <Link
              href="/connect"
              className="relative h-20 flex items-center px-6 lg:px-8 xl:px-10 group"
            >
              <span className={`font-serif text-base lg:text-lg xl:text-xl font-normal transition-colors whitespace-nowrap ${
                pathname === '/connect'
                  ? 'text-nook-green-light'
                  : 'text-brand-forest dark:text-[#FCFBF8] group-hover:text-nook-green-light'
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
            <div className="mobile-menu absolute top-[72px] left-4 bg-white dark:bg-[#4D453F] border border-[#E0D8D1] dark:border-[#403934] rounded-lg shadow-md md:hidden z-50 animate-fadeIn">
              <nav className="py-2 space-y-1 min-w-[160px]">
                {pathname !== '/my-nook' && pathname !== '/home' && (
                  <Link
                    href="/my-nook"
                    onClick={() => setShowMobileMenu(false)}
                    className="block px-4 py-2.5 font-serif text-base text-brand-forest dark:text-[#FCFBF8] hover:bg-surface-paper dark:hover:bg-[#403934] hover:text-nook-green-light transition-colors"
                  >
                    My nook
                  </Link>
                )}

                {pathname !== '/bookshelf' && (
                  <Link
                    href="/bookshelf"
                    onClick={() => setShowMobileMenu(false)}
                    className="block px-4 py-2.5 font-serif text-base text-brand-forest dark:text-[#FCFBF8] hover:bg-surface-paper dark:hover:bg-[#403934] hover:text-nook-green-light transition-colors"
                  >
                    Bookshelf
                  </Link>
                )}

                {pathname !== '/explore' && (
                  <Link
                    href="/explore"
                    onClick={() => setShowMobileMenu(false)}
                    className="block px-4 py-2.5 font-serif text-base text-brand-forest dark:text-[#FCFBF8] hover:bg-surface-paper dark:hover:bg-[#403934] hover:text-nook-green-light transition-colors"
                  >
                    Explore
                  </Link>
                )}

                {pathname !== '/connect' && (
                  <Link
                    href="/connect"
                    onClick={() => setShowMobileMenu(false)}
                    className="block px-4 py-2.5 font-serif text-base text-brand-forest dark:text-[#FCFBF8] hover:bg-surface-paper dark:hover:bg-[#403934] hover:text-nook-green-light transition-colors"
                  >
                    Connect
                  </Link>
                )}
              </nav>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4 md:gap-6">
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

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-surface-paper dark:hover:bg-[#4D453F] transition-all flex-shrink-0"
            aria-label="Toggle dark mode"
          >
            {theme === "light" ? (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                className="text-brand-forest dark:text-[#FCFBF8]"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            ) : (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                className="text-brand-forest dark:text-[#FCFBF8]"
              >
                <circle cx="12" cy="12" r="5" strokeWidth={2} />
                <line x1="12" y1="1" x2="12" y2="3" strokeWidth={2} strokeLinecap="round" />
                <line x1="12" y1="21" x2="12" y2="23" strokeWidth={2} strokeLinecap="round" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" strokeWidth={2} strokeLinecap="round" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" strokeWidth={2} strokeLinecap="round" />
                <line x1="1" y1="12" x2="3" y2="12" strokeWidth={2} strokeLinecap="round" />
                <line x1="21" y1="12" x2="23" y2="12" strokeWidth={2} strokeLinecap="round" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" strokeWidth={2} strokeLinecap="round" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" strokeWidth={2} strokeLinecap="round" />
              </svg>
            )}
          </button>

          {/* Settings Menu */}
          <div className="relative flex-shrink-0">
            <button
              onClick={() => setShowSettingsMenu(!showSettingsMenu)}
              className="w-10 h-10 flex items-center justify-center rounded-lg transition-all group flex-shrink-0"
              aria-label="Settings"
            >
              <div className="flex flex-col gap-1.5 items-start">
                <span className="h-0.5 w-7 bg-brand-forest dark:bg-[#FCFBF8] rounded-full transition-all group-hover:w-8"></span>
                <span className="h-0.5 w-6 bg-brand-forest dark:bg-[#FCFBF8] rounded-full transition-all group-hover:w-7"></span>
                <span className="h-0.5 w-5 bg-brand-forest dark:bg-[#FCFBF8] rounded-full transition-all group-hover:w-6"></span>
              </div>
            </button>

            {showSettingsMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#4D453F] rounded-lg shadow-lg border border-[#A3A692] dark:border-[#403934] py-2 z-50">
                <div className="px-4 py-3 border-b border-[#A3A692] dark:border-[#403934]">
                  <p className="font-sans text-sm font-semibold text-[#555931] dark:text-[#FCFBF8] truncate">
                    {userProfile?.displayName || user?.email?.split("@")[0] || "User"}
                  </p>
                  <p className="font-sans text-xs text-[#888C65] dark:text-[#FCFBF8]/70 truncate">
                    {user?.email}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setShowSettingsMenu(false);
                    router.push("/settings");
                  }}
                  className="w-full text-left px-4 py-2 font-sans text-sm text-[#555931] dark:text-[#FCFBF8] hover:bg-[#F5F1E8] dark:hover:bg-[#403934] transition-colors"
                >
                  Settings
                </button>

                <button
                  onClick={() => {
                    setShowSettingsMenu(false);
                    router.push("/contact");
                  }}
                  className="w-full text-left px-4 py-2 font-sans text-sm text-[#555931] dark:text-[#FCFBF8] hover:bg-[#F5F1E8] dark:hover:bg-[#403934] transition-colors"
                >
                  Contact
                </button>

                <button
                  onClick={() => {
                    setShowSettingsMenu(false);
                    router.push("/about");
                  }}
                  className="w-full text-left px-4 py-2 font-sans text-sm text-[#555931] dark:text-[#FCFBF8] hover:bg-[#F5F1E8] dark:hover:bg-[#403934] transition-colors"
                >
                  About Us
                </button>

                <div className="border-t border-[#A3A692] dark:border-[#403934] mt-2 pt-2">
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
