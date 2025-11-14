"use client";

import Image from "next/image";
import { Plus } from "lucide-react";
import Link from "next/link";

interface ReadingBook {
  id: string;
  title: string;
  author: string;
  coverUrl?: string;
  progress?: number; // 0-100
}

interface ReadingStatusBannerProps {
  type: "currently-reading" | "want-to-read";
  book?: ReadingBook;
  books?: ReadingBook[]; // Para want-to-read con múltiples libros
  onAddClick: () => void;
}

export function ReadingStatusBanner({
  type,
  book,
  books,
  onAddClick,
}: ReadingStatusBannerProps) {
  const isCurrentlyReading = type === "currently-reading";
  const hasContent = isCurrentlyReading ? !!book : !!books && books.length > 0;

  return (
    <div className="flex items-center gap-6 md:gap-8">
      {/* Icon/Illustration */}
      <div className="flex-shrink-0">
        <Image
          src={
            isCurrentlyReading
              ? "/recursos/book-illustration.png"
              : "/recursos/tidy-books-illustration.png"
          }
          alt={isCurrentlyReading ? "Book" : "Books stack"}
          width={120}
          height={120}
          className="w-20 h-20 md:w-28 md:h-28 lg:w-32 lg:h-32 object-contain"
        />
      </div>

      {/* Content */}
      <div className="space-y-3 min-w-0 flex-1">
        {hasContent ? (
          <>
            {/* With Content */}
            <h3 className="font-serif text-xl md:text-2xl font-semibold text-nook-green-light dark:text-[#FCFBF8] transition-colors">
              {isCurrentlyReading ? "Currently reading" : "Want to read"}
            </h3>

            {isCurrentlyReading && book ? (
              <>
                <Link
                  href={`/bookshelf?book=${book.id}`}
                  className="group block"
                >
                  <p className="font-sans text-sm md:text-base text-nook-brown dark:text-[#FCFBF8] group-hover:text-nook-green-light transition-colors line-clamp-1">
                    <span className="font-semibold">{book.title}</span>
                    {book.author && (
                      <span className="text-nook-brown/80 dark:text-[#FCFBF8]/80"> by {book.author}</span>
                    )}
                  </p>
                </Link>
                {book.progress !== undefined && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <p className="font-sans text-xs md:text-sm text-nook-brown/80 dark:text-[#FCFBF8]/80 transition-colors">
                        {book.progress}% complete
                      </p>
                    </div>
                    <div className="w-full bg-surface-paper dark:bg-[#FCFBF8]/20 rounded-full h-2 overflow-hidden transition-colors">
                      <div
                        className="bg-nook-green-light h-full rounded-full transition-all duration-500"
                        style={{ width: `${book.progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </>
            ) : (
              books && (
                <div className="space-y-2">
                  <p className="font-sans text-sm md:text-base text-nook-brown dark:text-[#FCFBF8] transition-colors line-clamp-2">
                    {books.slice(0, 3).map((b) => b.author || b.title).join(", ")}
                    {books.length > 3 && (
                      <span className="text-nook-brown/70 dark:text-[#FCFBF8]/70"> and {books.length - 3} more!</span>
                    )}
                  </p>
                  <Link
                    href="/bookshelf"
                    className="inline-block font-sans text-xs md:text-sm text-nook-green-light hover:underline"
                  >
                    View all →
                  </Link>
                </div>
              )
            )}
          </>
        ) : (
          <>
            {/* Empty State */}
            <h3 className="font-serif text-xl md:text-2xl font-semibold text-nook-green-dark dark:text-[#FCFBF8] transition-colors">
              {isCurrentlyReading
                ? "What are you reading?"
                : "What do you want to read?"}
            </h3>
            <p className="font-sans text-sm md:text-base text-nook-brown/80 dark:text-[#FCFBF8]/80 transition-colors">
              {isCurrentlyReading
                ? "Track your current book and see your progress"
                : "Build your reading list with books you want to explore"}
            </p>
            <button
              onClick={onAddClick}
              className="flex items-center gap-2 bg-nook-green-light text-white font-sans text-sm font-semibold px-4 py-2 rounded-lg hover:bg-nook-green-dark transition-colors mt-2"
            >
              <Plus className="w-4 h-4" />
              {isCurrentlyReading ? "Add current book" : "Add to list"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

