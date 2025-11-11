"use client";

interface BookCoverPlaceholderProps {
  title: string;
  author?: string;
  size?: "small" | "medium" | "large";
  className?: string;
}

// Genera un color consistente basado en el título
function getColorFromTitle(title: string): string {
  const colors = [
    "from-[#7A9B57] to-[#5F6B39]", // Verde Nook
    "from-[#8B7355] to-[#6B5947]", // Marrón
    "from-[#5A7A8B] to-[#3D5A6B]", // Azul
    "from-[#8B5A7A] to-[#6B3D5A]", // Púrpura
    "from-[#7A8B5A] to-[#5A6B3D]", // Verde oliva
    "from-[#8B6B5A] to-[#6B4D3D]", // Terracota
    "from-[#5A8B7A] to-[#3D6B5A]", // Verde azulado
  ];

  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = title.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colors.length;
  return colors[index];
}

export function BookCoverPlaceholder({
  title,
  author,
  size = "medium",
  className = "",
}: BookCoverPlaceholderProps) {
  const gradient = getColorFromTitle(title);
  
  // Extraer las primeras palabras significativas del título (max 3)
  const displayTitle = title
    .split(" ")
    .slice(0, 3)
    .join(" ")
    .toUpperCase();

  // Tamaños de texto según el tamaño del cover
  const textSizes = {
    small: {
      title: "text-[10px] leading-tight",
      author: "text-[7px]",
      padding: "p-2",
    },
    medium: {
      title: "text-xs leading-tight",
      author: "text-[9px]",
      padding: "p-3",
    },
    large: {
      title: "text-sm leading-tight",
      author: "text-[10px]",
      padding: "p-4",
    },
  };

  const sizes = textSizes[size];

  return (
    <div
      className={`w-full h-full bg-gradient-to-br ${gradient} ${sizes.padding} flex flex-col justify-between relative overflow-hidden ${className}`}
    >
      {/* Patrón decorativo sutil */}
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="book-pattern"
              x="0"
              y="0"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="2" cy="2" r="1" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#book-pattern)" />
        </svg>
      </div>

      {/* Contenido */}
      <div className="relative z-10 flex-1 flex flex-col justify-center">
        <h3
          className={`font-serif ${sizes.title} font-bold text-white text-center line-clamp-4 mb-1`}
        >
          {displayTitle}
        </h3>
        {author && (
          <p
            className={`font-sans ${sizes.author} text-white/90 text-center line-clamp-2`}
          >
            {author}
          </p>
        )}
      </div>

      {/* Marca de agua Nook */}
      <div className="relative z-10 flex justify-center">
        <div
          className={`${
            size === "small" ? "text-[6px]" : size === "medium" ? "text-[8px]" : "text-[9px]"
          } font-serif text-white/40 tracking-wider`}
        >
          NOOK
        </div>
      </div>

      {/* Borde decorativo */}
      <div className="absolute inset-2 border border-white/20 rounded-sm pointer-events-none"></div>
    </div>
  );
}

