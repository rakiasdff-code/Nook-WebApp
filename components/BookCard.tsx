"use client";

import Image from "next/image";
import { Book } from "lucide-react";

interface BookCardProps {
  title: string;
  authors: string[];
  coverImage?: string;
  rating?: number;
  onBookClick?: () => void;
  matchReason?: string;
}

export function BookCard({
  title,
  authors,
  coverImage,
  rating,
  onBookClick,
  matchReason,
}: BookCardProps) {
  return (
    <div
      onClick={onBookClick}
      className="group cursor-pointer flex flex-col gap-3 hover:scale-105 transition-transform duration-200"
    >
      {/* Book Cover */}
      <div className="relative aspect-[2/3] w-full bg-surface-paper rounded-lg overflow-hidden shadow-md">
        {coverImage ? (
          <Image
            src={coverImage}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-surface-paper-light">
            <Book className="w-12 h-12 text-brand-forest/30" />
          </div>
        )}
        {rating && (
          <div className="absolute top-2 right-2 bg-nook-green-light/90 backdrop-blur-sm px-2 py-1 rounded-md">
            <span className="text-white text-xs font-semibold">
              ⭐ {rating.toFixed(1)}
            </span>
          </div>
        )}
      </div>

      {/* Book Info */}
      <div className="space-y-1">
        <h4 className="font-serif text-base font-semibold text-nook-green-dark line-clamp-2 group-hover:text-nook-green-light transition-colors">
          {title}
        </h4>
        <p className="font-sans text-sm text-nook-brown line-clamp-1">
          {authors.join(", ")}
        </p>
        {matchReason && (
          <p className="font-sans text-xs text-brand-forest/70 italic">
            {matchReason}
          </p>
        )}
      </div>
    </div>
  );
}

