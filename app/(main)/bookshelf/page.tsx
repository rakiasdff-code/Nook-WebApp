"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/AuthContext";
import { Search, BookOpen, Plus, Filter, X } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { BookCoverPlaceholder } from "@/components/BookCoverPlaceholder";

type ReadingStatus = "reading" | "read" | "want-to-read" | "abandoned";

interface Book {
  id: string;
  title: string;
  authors: string[];
  coverImage?: string;
  status: ReadingStatus;
  progress?: number;
  rating?: number;
  notes?: string;
  addedDate?: Date;
}

interface SearchResult {
  id: string;
  title: string;
  authors: string[];
  coverImage?: string;
  description?: string;
  pageCount?: number;
  publishedDate?: string;
}

export default function BookshelfPage() {
  const { userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<ReadingStatus | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [myBooks, setMyBooks] = useState<Book[]>([
    // Mock data - replace with Firebase
    {
      id: "1",
      title: "The Heir of Fire",
      authors: ["Sarah J. Maas"],
      coverImage: "https://books.google.com/books/content?id=example&printsec=frontcover&img=1",
      status: "reading",
      progress: 47,
      addedDate: new Date(),
    },
    {
      id: "2",
      title: "The Way of Kings",
      authors: ["Brandon Sanderson"],
      status: "want-to-read",
      addedDate: new Date(),
    },
  ]);

  const tabs = [
    { id: "all" as const, label: "All Books", count: myBooks.length },
    {
      id: "reading" as const,
      label: "Reading",
      count: myBooks.filter((b) => b.status === "reading").length,
    },
    {
      id: "read" as const,
      label: "Read",
      count: myBooks.filter((b) => b.status === "read").length,
    },
    {
      id: "want-to-read" as const,
      label: "Want to Read",
      count: myBooks.filter((b) => b.status === "want-to-read").length,
    },
    {
      id: "abandoned" as const,
      label: "Abandoned",
      count: myBooks.filter((b) => b.status === "abandoned").length,
    },
  ];

  // Search books
  const handleSearch = async () => {
    if (searchQuery.trim().length < 2) {
      toast.error("Please enter at least 2 characters");
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `/api/books/search?q=${encodeURIComponent(searchQuery)}&limit=12`
      );
      const data = await response.json();
      if (data.success) {
        setSearchResults(data.results);
        setShowSearchModal(true);
      } else {
        toast.error("Failed to search books");
      }
    } catch (error) {
      console.error("Error searching books:", error);
      toast.error("Failed to search books");
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddBook = (book: SearchResult, status: ReadingStatus) => {
    // TODO: Add to Firebase
    const newBook: Book = {
      id: book.id,
      title: book.title,
      authors: book.authors,
      coverImage: book.coverImage,
      status,
      addedDate: new Date(),
    };
    setMyBooks([...myBooks, newBook]);
    setShowSearchModal(false);
    setSearchQuery("");
    toast.success(`Added "${book.title}" to ${status.replace("-", " ")}`);
  };

  const filteredBooks =
    activeTab === "all" ? myBooks : myBooks.filter((b) => b.status === activeTab);

  return (
    <div className="min-h-screen bg-surface-paper pb-20">
      {/* Header */}
      <section className="w-full bg-surface-paper-light border-b border-brand-forest/10">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-16">
          <div className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold text-nook-green-dark tracking-tight">
                Your Bookshelf
              </h1>
              <p className="font-sans text-lg text-nook-brown">
                Organize, track, and discover your literary journey
              </p>
            </div>

            {/* Search Bar */}
            <div className="flex gap-3 max-w-2xl">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-forest/50" />
                <input
                  type="text"
                  placeholder="Search for books to add..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="w-full pl-12 pr-4 py-3 border-2 border-brand-forest/20 rounded-xl font-sans text-base text-brand-forest placeholder:text-brand-forest/40 focus:outline-none focus:border-nook-green-light transition-colors"
                />
              </div>
              <button
                onClick={handleSearch}
                disabled={isSearching}
                className="bg-nook-green-light text-white font-sans font-semibold px-6 py-3 rounded-xl hover:bg-nook-green-dark transition-colors disabled:opacity-50 whitespace-nowrap"
              >
                {isSearching ? "Searching..." : "Search"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="w-full border-b border-brand-forest/10 sticky top-[72px] bg-surface-paper z-30">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex gap-1 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative font-serif text-base md:text-lg font-medium px-6 py-4 whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? "text-nook-green-light"
                    : "text-brand-forest hover:text-nook-green-light"
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span
                    className={`ml-2 font-sans text-sm px-2 py-0.5 rounded-full ${
                      activeTab === tab.id
                        ? "bg-nook-green-light text-white"
                        : "bg-surface-paper-light text-brand-forest"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-nook-green-light" />
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Books Grid */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        {filteredBooks.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {filteredBooks.map((book) => (
              <div
                key={book.id}
                className="group cursor-pointer space-y-3 hover:scale-105 transition-transform"
              >
                {/* Cover */}
                <div className="relative aspect-[2/3] bg-surface-paper-light rounded-lg overflow-hidden shadow-md">
                  {book.coverImage ? (
                    <Image
                      src={book.coverImage}
                      alt={book.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <BookCoverPlaceholder
                      title={book.title}
                      author={book.authors[0]}
                      size="small"
                    />
                  )}
                  {book.status === "reading" && book.progress && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm px-2 py-1">
                      <div className="w-full bg-white/30 rounded-full h-1.5">
                        <div
                          className="bg-nook-green-light h-full rounded-full"
                          style={{ width: `${book.progress}%` }}
                        />
                      </div>
                      <p className="text-white text-xs text-center mt-1">
                        {book.progress}%
                      </p>
                    </div>
                  )}
                </div>
                {/* Info */}
                <div className="space-y-1">
                  <h3 className="font-serif text-sm font-semibold text-nook-green-dark line-clamp-2 group-hover:text-nook-green-light transition-colors">
                    {book.title}
                  </h3>
                  <p className="font-sans text-xs text-nook-brown line-clamp-1">
                    {book.authors.join(", ")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 space-y-6">
            <BookOpen className="w-20 h-20 text-brand-forest/30 mx-auto" />
            <div className="space-y-2">
              <h3 className="font-serif text-2xl font-semibold text-nook-green-dark">
                {activeTab === "all"
                  ? "Your bookshelf is empty"
                  : `No books in "${tabs.find((t) => t.id === activeTab)?.label}"`}
              </h3>
              <p className="font-sans text-base text-nook-brown">
                Start building your library by searching for books above
              </p>
            </div>
            <button
              onClick={() => document.querySelector<HTMLInputElement>("input")?.focus()}
              className="bg-nook-green-light text-white font-sans font-semibold px-6 py-3 rounded-xl hover:bg-nook-green-dark transition-colors"
            >
              Search Books
            </button>
          </div>
        )}
      </section>

      {/* Search Modal */}
      {showSearchModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="p-6 border-b border-brand-forest/10 flex items-center justify-between">
              <div>
                <h2 className="font-serif text-2xl font-semibold text-nook-green-dark">
                  Search Results
                </h2>
                <p className="font-sans text-sm text-nook-brown">
                  Found {searchResults.length} books for "{searchQuery}"
                </p>
              </div>
              <button
                onClick={() => setShowSearchModal(false)}
                className="p-2 hover:bg-surface-paper-light rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-brand-forest" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {searchResults.map((book) => (
                  <div
                    key={book.id}
                    className="flex gap-4 p-4 bg-surface-paper-light rounded-xl hover:bg-surface-paper-light/70 transition-colors"
                  >
                    {/* Cover */}
                    <div className="w-20 h-28 bg-surface-paper rounded-lg overflow-hidden flex-shrink-0">
                      {book.coverImage ? (
                        <Image
                          src={book.coverImage}
                          alt={book.title}
                          width={80}
                          height={112}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-20 h-28">
                          <BookCoverPlaceholder
                            title={book.title}
                            author={book.authors[0]}
                            size="small"
                          />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0 space-y-2">
                      <div>
                        <h3 className="font-serif text-base font-semibold text-nook-green-dark line-clamp-2">
                          {book.title}
                        </h3>
                        <p className="font-sans text-sm text-nook-brown line-clamp-1">
                          {book.authors.join(", ")}
                        </p>
                      </div>

                      {/* Add buttons */}
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => handleAddBook(book, "reading")}
                          className="flex items-center gap-1 bg-nook-green-light text-white font-sans text-xs px-3 py-1.5 rounded-lg hover:bg-nook-green-dark transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                          Reading
                        </button>
                        <button
                          onClick={() => handleAddBook(book, "want-to-read")}
                          className="flex items-center gap-1 border border-nook-green-light text-nook-green-light font-sans text-xs px-3 py-1.5 rounded-lg hover:bg-nook-green-light hover:text-white transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                          Want to Read
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

