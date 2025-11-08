"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoadingRegisterPage() {
  const router = useRouter();
  const [showExtraText, setShowExtraText] = useState(false);

  useEffect(() => {
    // Mostrar texto adicional después de 4 segundos
    const timer = setTimeout(() => {
      setShowExtraText(true);
    }, 4000);

    // Redirigir a home después de 6 segundos
    const redirectTimer = setTimeout(() => {
      router.push("/home");
    }, 6000);

    return () => {
      clearTimeout(timer);
      clearTimeout(redirectTimer);
    };
  }, [router]);

  return (
    <div className="min-h-screen bg-[#F5F1E8] flex items-center justify-center px-4">
      <div className="text-center space-y-8">
        {/* Main text */}
        <h1 className="font-serif text-4xl md:text-5xl font-medium text-nook-brown">
          Creating your nook...
        </h1>

        {/* Loader - 3 animated dots */}
        <div className="flex items-center justify-center gap-2">
          <div className="w-3 h-3 rounded-full bg-brand-forest animate-bounce" style={{ animationDelay: "0ms" }}></div>
          <div className="w-3 h-3 rounded-full bg-brand-forest animate-bounce" style={{ animationDelay: "150ms" }}></div>
          <div className="w-3 h-3 rounded-full bg-brand-forest animate-bounce" style={{ animationDelay: "300ms" }}></div>
        </div>

        {/* Extra text after 4 seconds */}
        {showExtraText && (
          <p className="font-sans text-lg text-nook-brown/70 animate-fade-in">
            This may take a few moments...
          </p>
        )}
      </div>
    </div>
  );
}

