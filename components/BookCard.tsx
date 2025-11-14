"use client";

import Image from "next/image";
import { BookCoverPlaceholder } from "./BookCoverPlaceholder";

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
      <div className="relative aspect-[2/3] w-full bg-surface-paper dark:bg-[#FCFBF8] rounded-lg overflow-hidden shadow-md transition-colors">
        {coverImage ? (
          <Image
            src={coverImage}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
        ) : (
          <BookCoverPlaceholder
            title={title}
            author={authors[0]}
            size="medium"
          />
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
        <h4 className="font-serif text-base font-semibold text-nook-green-dark dark:text-[#FCFBF8] line-clamp-2 group-hover:text-nook-green-light transition-colors">
          {title}
        </h4>
        <p className="font-sans text-sm text-nook-brown dark:text-[#FCFBF8] line-clamp-1 transition-colors">
          {authors.join(", ")}
        </p>
        {matchReason && (
          <p className="font-sans text-xs text-brand-forest/70 dark:text-[#FCFBF8]/70 italic transition-colors">
            {matchReason}
          </p>
        )}
      </div>
    </div>
  );
}

