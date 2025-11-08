import React from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="home-container w-full min-h-screen flex flex-col lg:flex-row">
      {/* Sección izquierda - Ilustración */}
      <div className="illustration-section lg:w-2/3 relative flex items-center justify-center overflow-hidden min-h-[50vh] lg:min-h-screen bg-[#F5F3F0]">
        {/* Background illustration */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('/recursos/background-illustration-access.png')",
          }}
        />

        {/* Overlay sólido - entre ilustración y contenido */}
        <div
          className="absolute inset-0 z-[1]"
          style={{
            backgroundColor: "#EFEDEB",
            opacity: 0.9,
          }}
        />

        {/* Logo en esquina superior izquierda */}
        <div className="absolute top-6 left-6 sm:top-8 sm:left-8 lg:top-12 lg:left-12 z-20">
          <img
            src="/recursos/IconOnly=no.png"
            className="logo h-8 sm:h-10 md:h-12 lg:h-14 xl:h-16 w-auto"
            alt="Nook"
          />
        </div>

        {/* Contenido - Frase y texto */}
        <div className="content-wrapper relative z-10 w-full px-4 sm:px-6 md:px-10 lg:px-12 xl:px-16 flex flex-col items-end justify-center">
          <div className="space-y-4 sm:space-y-6 lg:space-y-8">
            {/* Frase destacada */}
            <blockquote
              className="hero-quote text-right text-[#5F6B39]"
              style={{
                fontFamily: "var(--font-vollkorn), Vollkorn, serif",
                fontSize: "clamp(2rem, 5vw, 98.08px)",
                fontWeight: 500,
                fontStyle: "normal",
                lineHeight: "0.953",
                letterSpacing: "-0.02em",
                width: "829px",
                maxWidth: "90vw",
              }}
            >
              &ldquo;A space for readers,
              <br />
              dreamers, and those
              <br />
              who lose themselves
              <br />
              in stories&rdquo;
            </blockquote>

            {/* Línea decorativa y subtítulo */}
            <div className="flex items-center justify-end gap-2 sm:gap-3 lg:gap-4">
              <div className="h-[2px] w-6 sm:w-8 lg:w-12 bg-[#6B7C59]" />
              <p
                className="text-[#5F6B39]"
                style={{
                  fontFamily: "var(--font-inter), Inter, sans-serif",
                  fontSize: "clamp(0.875rem, 1.5vw, 24px)",
                  fontWeight: 500,
                  letterSpacing: "-0.02em",
                }}
              >
                Welcome to your Nook
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sección derecha - Formulario */}
      <div className="form-section lg:w-1/3 flex items-center justify-center bg-[#F5F3F0] p-6 sm:p-8 lg:p-12">
        <div className="w-full min-w-[320px] max-w-md lg:max-w-[480px]">
          {children}
        </div>
      </div>
    </div>
  );
}
