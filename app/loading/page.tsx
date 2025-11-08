"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoadingPage() {
  const router = useRouter();

  useEffect(() => {
    // Simular carga de 3 segundos antes de ir a home
    const timer = setTimeout(() => {
      router.push("/home");
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-[#EFEDEB] flex flex-col items-center justify-center p-6 relative">
      {/* Logo en esquina superior derecha */}
      <div className="absolute top-6 right-6 sm:top-8 sm:right-8">
        <img
          src="/recursos/IconOnly=no.png"
          alt="Nook"
          className="h-10 sm:h-12 w-auto"
        />
      </div>

      {/* Contenido central */}
      <div className="flex flex-col items-center space-y-8 max-w-2xl mx-auto">
        {/* Ilustración del libro */}
        <div className="relative w-64 h-64 sm:w-80 sm:h-80 mb-4">
          <img
            src="/recursos/book-illustration.png"
            alt="Book illustration"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Textos */}
        <div className="text-center space-y-2">
          <h1
            className="text-[#6B7761]"
            style={{
              fontFamily: "var(--font-vollkorn), Vollkorn, serif",
              fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
              fontWeight: 500,
              lineHeight: "1.2",
              letterSpacing: "-0.01em",
            }}
          >
            Welcome to Nook,
            <br />
            where words become worlds.
          </h1>
        </div>

        <p
          className="text-[#6B7761]"
          style={{
            fontFamily: "var(--font-inter), Inter, sans-serif",
            fontSize: "clamp(0.875rem, 2vw, 1.125rem)",
            fontWeight: 400,
            letterSpacing: "-0.01em",
          }}
        >
          Preparing your reading corner...
        </p>

        {/* Animación de loading dots */}
        <div className="flex items-center gap-2 mt-4">
          <div
            className="w-2.5 h-2.5 rounded-full bg-[#6B7761] animate-pulse-subtle"
            style={{
              animationDelay: "0ms",
            }}
          />
          <div
            className="w-2.5 h-2.5 rounded-full bg-[#6B7761] animate-pulse-subtle"
            style={{
              animationDelay: "300ms",
            }}
          />
          <div
            className="w-2.5 h-2.5 rounded-full bg-[#6B7761] animate-pulse-subtle"
            style={{
              animationDelay: "600ms",
            }}
          />
        </div>
      </div>
    </div>
  );
}

