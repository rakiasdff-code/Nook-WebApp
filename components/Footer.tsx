"use client";

import Link from "next/link";
import Logo from "./Logo";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-[#E0D8D1] bg-[rgba(250,250,249,0.80)] dark:bg-[#403934] dark:border-[#4D453F] transition-colors">
      <div className="max-w-7xl mx-auto px-4 md:px-7 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Logo y descripción */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/home" className="inline-block mb-4">
              <Logo iconOnly className="w-12 h-auto" />
            </Link>
            <p className="font-sans text-sm text-brand-forest dark:text-[#FCFBF8] opacity-80">
              Your personal reading sanctuary
            </p>
          </div>

          {/* Navigation */}
          <div className="col-span-1">
            <h3 className="font-serif text-base font-semibold text-brand-forest dark:text-[#FCFBF8] mb-4">
              Navigation
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/my-nook"
                  className="font-sans text-sm text-brand-forest dark:text-[#FCFBF8] hover:text-nook-green-light dark:hover:text-nook-green-light transition-colors"
                >
                  My nook
                </Link>
              </li>
              <li>
                <Link
                  href="/bookshelf"
                  className="font-sans text-sm text-brand-forest dark:text-[#FCFBF8] hover:text-nook-green-light dark:hover:text-nook-green-light transition-colors"
                >
                  Bookshelf
                </Link>
              </li>
              <li>
                <Link
                  href="/explore"
                  className="font-sans text-sm text-brand-forest dark:text-[#FCFBF8] hover:text-nook-green-light dark:hover:text-nook-green-light transition-colors"
                >
                  Explore
                </Link>
              </li>
              <li>
                <Link
                  href="/connect"
                  className="font-sans text-sm text-brand-forest dark:text-[#FCFBF8] hover:text-nook-green-light dark:hover:text-nook-green-light transition-colors"
                >
                  Connect
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="col-span-1">
            <h3 className="font-serif text-base font-semibold text-brand-forest dark:text-[#FCFBF8] mb-4">
              Support
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="font-sans text-sm text-brand-forest dark:text-[#FCFBF8] hover:text-nook-green-light dark:hover:text-nook-green-light transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="font-sans text-sm text-brand-forest dark:text-[#FCFBF8] hover:text-nook-green-light dark:hover:text-nook-green-light transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/settings"
                  className="font-sans text-sm text-brand-forest dark:text-[#FCFBF8] hover:text-nook-green-light dark:hover:text-nook-green-light transition-colors"
                >
                  Settings
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="col-span-1">
            <h3 className="font-serif text-base font-semibold text-brand-forest dark:text-[#FCFBF8] mb-4">
              Legal
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/privacy"
                  className="font-sans text-sm text-brand-forest dark:text-[#FCFBF8] hover:text-nook-green-light dark:hover:text-nook-green-light transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="font-sans text-sm text-brand-forest dark:text-[#FCFBF8] hover:text-nook-green-light dark:hover:text-nook-green-light transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-[#E0D8D1] dark:border-[#4D453F]">
          <p className="font-sans text-sm text-center text-brand-forest dark:text-[#FCFBF8] opacity-70">
            © {currentYear} Nook. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
