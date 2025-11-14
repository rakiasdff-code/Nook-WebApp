"use client";

import Image from "next/image";
import { useAuth } from "@/lib/AuthContext";
import { getGreeting, getDisplayName } from "@/lib/utils/greetings";
import { useState, useEffect } from "react";
import { BookCard } from "@/components/BookCard";
import { ReadingStatusBanner } from "@/components/ReadingStatusBanner";
import { BookOpen, TrendingUp, Calendar, Star } from "lucide-react";
import { useRouter } from "next/navigation";

interface BookRelease {
  id: string;
  title: string;
  authors: string[];
  coverImage?: string;
  publishedDate?: string;
  description?: string;
  categories?: string[];
  rating?: number;
  link?: string;
}

interface BookRecommendation extends BookRelease {
  matchReason: string;
}

interface ReadingBook {
  id: string;
  title: string;
  author: string;
  coverUrl?: string;
  progress?: number;
}

export default function HomePage() {
  const { user, userProfile } = useAuth();
  const router = useRouter();
  const greeting = getGreeting();
  const displayName = getDisplayName(userProfile?.displayName, user?.email);

  const [recommendations, setRecommendations] = useState<BookRecommendation[]>(
    [],
  );
  const [newReleases, setNewReleases] = useState<BookRelease[]>([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(true);
  const [loadingReleases, setLoadingReleases] = useState(true);

  // Reading status - TODO: Fetch from Firebase
  // Para probar el estado VACÍO, comenta las líneas 52-57 y 61-66
  // Para probar el estado CON DATOS, descomenta las líneas 52-57 y 61-66
  const [currentlyReading, setCurrentlyReading] = useState<
    ReadingBook | undefined
  >(
    // Mock data - replace with Firebase fetch
    {
      id: "1",
      title: "The Heir of Fire",
      author: "Sarah J. Maas",
      progress: 47,
    },
    // undefined // <- Descomentar para probar estado vacío
  );

  const [wantToRead, setWantToRead] = useState<ReadingBook[]>(
    // Mock data - replace with Firebase fetch
    [
      { id: "2", title: "The Way of Kings", author: "Brandon Sanderson" },
      {
        id: "3",
        title: "A Court of Thorns and Roses",
        author: "Sarah J. Maas",
      },
      { id: "4", title: "Book Lovers", author: "Amber V. Nicole" },
    ],
    // [] // <- Descomentar para probar estado vacío
  );

  const handleAddCurrentBook = () => {
    router.push("/bookshelf?action=add-current");
  };

  const handleAddToWantToRead = () => {
    router.push("/bookshelf?action=add-want");
  };

  // Fetch recommendations
  useEffect(() => {
    async function fetchRecommendations() {
      try {
        const genres =
          userProfile?.favoriteGenres?.join(",") || "fantasy,fiction";
        const response = await fetch(
          `/api/books/recommendations?genres=${genres}&limit=8`,
        );
        const data = await response.json();
        if (data.success) {
          setRecommendations(data.recommendations);
        }
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      } finally {
        setLoadingRecommendations(false);
      }
    }

    fetchRecommendations();
  }, [userProfile?.favoriteGenres]);

  // Fetch new releases
  useEffect(() => {
    async function fetchNewReleases() {
      try {
        const response = await fetch(
          "/api/books/new-releases?genre=fiction&limit=12",
        );
        const data = await response.json();
        if (data.success) {
          setNewReleases(data.books);
        }
      } catch (error) {
        console.error("Error fetching new releases:", error);
      } finally {
        setLoadingReleases(false);
      }
    }

    fetchNewReleases();
  }, []);

  return (
    <div className="min-h-screen bg-surface-paper dark:bg-[#4D453F] transition-colors">
      {/* Hero Section */}
      <section className="w-full px-6 md:px-12 lg:px-24 xl:px-40 py-16 md:py-24">
        <div className="max-w-[1600px] mx-auto grid md:grid-cols-[minmax(400px,1fr)_minmax(300px,500px)] lg:grid-cols-[minmax(500px,1fr)_minmax(400px,600px)] gap-8 md:gap-12 lg:gap-16 xl:gap-24 items-center">
          {/* Left content */}
          <div className="space-y-10 min-w-0">
            {/* Pre-título: definición de Nook */}
            <div className="font-serif text-[15px] text-brand-forest dark:text-[#FCFBF8] leading-relaxed italic space-y-1 transition-colors">
              <p className="font-semibold not-italic">Nook /nʊk/ noun</p>
              <p>
                A corner or recess, especially one offering seclusion or
                security.
              </p>
              <p>A small, sheltered or hidden spot.</p>
            </div>

            <div className="space-y-5">
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-semibold text-nook-green-light dark:text-[#FCFBF8] leading-[1.15] tracking-tight transition-colors">
                {greeting.title === "Hey! Still up" ? (
                  <>
                    {greeting.title}
                    <br />
                    reading, {displayName}?
                  </>
                ) : (
                  <>
                    {greeting.title},<br />
                    {displayName}!
                  </>
                )}
              </h1>

              <p className="font-sans text-xl text-brand-forest dark:text-[#FCFBF8] leading-relaxed whitespace-pre-line transition-colors">
                {greeting.subtitle}
              </p>

              <div className="flex gap-4 sm:gap-6 pt-4">
                <button
                  onClick={() => router.push("/my-nook")}
                  className="bg-brand-forest dark:bg-[#FCFBF8] text-nook-cream dark:text-[#4D453F] font-sans text-sm sm:text-base font-bold py-2.5 px-4 sm:px-5 rounded-xl hover:bg-nook-green-dark dark:hover:bg-[#FCFBF8]/90 transition-colors whitespace-nowrap"
                >
                  Find your Nook
                </button>
                <button
                  onClick={() => router.push("/bookshelf")}
                  className="border-2 border-brand-forest dark:border-[#FCFBF8] text-brand-forest dark:text-[#FCFBF8] font-sans text-sm sm:text-base font-bold py-2.5 px-4 sm:px-5 rounded-xl hover:bg-brand-forest hover:text-white dark:hover:bg-[#FCFBF8] dark:hover:text-[#4D453F] transition-colors whitespace-nowrap"
                >
                  Bookshelf
                </button>
              </div>
            </div>
          </div>

          {/* Right illustration */}
          <div className="hidden md:flex md:justify-end md:items-center flex-shrink-0">
            <Image
              src="/recursos/background-home-bookshelf.svg"
              alt="Bookshelf illustration"
              width={600}
              height={600}
              className="w-full h-auto max-w-[400px] lg:max-w-[500px] xl:max-w-[600px]"
              priority
            />
          </div>
        </div>
      </section>

      {/* Reading Progress Section */}
      <section className="w-full bg-surface-paper-light dark:bg-[#FCFBF8] px-6 md:px-12 lg:px-20 py-20 transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-center gap-12 md:gap-20 lg:gap-32">
          {/* Currently reading */}
          <ReadingStatusBanner
            type="currently-reading"
            book={currentlyReading}
            onAddClick={handleAddCurrentBook}
          />

          <div className="hidden md:block w-0.5 h-36 bg-brand-forest/30 dark:bg-[#4D453F]/30"></div>

          {/* Want to read */}
          <ReadingStatusBanner
            type="want-to-read"
            books={wantToRead}
            onAddClick={handleAddToWantToRead}
          />
        </div>
      </section>

      {/* What are you up to today Section */}
      <section className="w-full px-6 md:px-12 lg:px-40 py-20">
        <div className="max-w-7xl mx-auto space-y-14">
          <h2 className="font-serif text-4xl md:text-5xl font-semibold text-nook-green-dark dark:text-[#FCFBF8] text-center tracking-tight transition-colors">
            What are you up to today?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 md:gap-8">
            {/* My nook card */}
            <div className="bg-surface-paper-light dark:bg-[#FCFBF8] rounded-2xl p-10 flex flex-col items-center text-center space-y-7 hover:shadow-lg transition-all">
              <div className="space-y-3 flex flex-col items-center">
                <Image
                  src="/recursos/nook-icon.png"
                  alt="My nook"
                  width={54}
                  height={54}
                  className="w-14 h-14 object-contain"
                />
                <h3 className="font-serif text-2xl font-semibold text-nook-green-light">
                  My nook
                </h3>
              </div>
              <p className="font-sans text-sm text-nook-brown leading-relaxed">
                Find your Nook! Choose from pre-configured environments or
                design your own.
              </p>
            </div>

            {/* Bookshelf card */}
            <div className="bg-surface-paper-light rounded-2xl p-10 flex flex-col items-center text-center space-y-7 hover:shadow-lg transition-shadow">
              <div className="space-y-3 flex flex-col items-center">
                <svg width="66" height="45" viewBox="0 0 67 47" fill="none">
                  <path
                    d="M3.74512 25.4582L33.4219 34.7995L63.1087 21.3299M3.7451 36.095L33.4219 45.4346L63.1087 31.9667C67.1367 30.3204 66.8359 22.5051 63.1087 21.3318M33.8631 8.40377L41.3475 10.8891M3.74677 14.8235C-0.282894 16.4698 0.0162806 24.2851 3.74677 25.4601M33.4219 0.835693L3.74512 14.8234L33.4219 24.163L63.1087 10.6951L33.4219 0.835693Z"
                    stroke="#566033"
                    strokeWidth="1.67137"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <h3 className="font-serif text-2xl font-semibold text-nook-green-light">
                  Bookshelf
                </h3>
              </div>
              <p className="font-sans text-sm text-nook-brown leading-relaxed">
                Organize your collection with custom lists. Track your current
                reads and discover what to read next
              </p>
            </div>

            {/* Explore card */}
            <div className="bg-surface-paper-light rounded-2xl p-10 flex flex-col items-center text-center space-y-7 hover:shadow-lg transition-shadow">
              <div className="space-y-3 flex flex-col items-center">
                <svg width="48" height="37" viewBox="0 0 48 37" fill="none">
                  <path
                    d="M1.24805 36.865C0.893606 36.865 0.597401 36.7452 0.359439 36.5056C0.119813 36.2659 0 35.9689 0 35.6144C0 35.26 0.119813 34.9638 0.359439 34.7258C0.599065 34.4879 0.89527 34.3681 1.24805 34.3664H46.1779C46.5324 34.3664 46.8286 34.4862 47.0666 34.7258C47.3045 34.9655 47.4243 35.2625 47.426 35.6169C47.4277 35.9714 47.3078 36.2676 47.0666 36.5056C46.8253 36.7435 46.5291 36.8633 46.1779 36.865H1.24805ZM7.10392 27.4547C6.74947 27.4547 6.45243 27.3357 6.2128 27.0977C5.97318 26.8598 5.8542 26.5636 5.85586 26.2091V11.2325C5.85586 10.878 5.97567 10.581 6.2153 10.3414C6.45493 10.1034 6.75196 9.98444 7.10641 9.98444C7.46086 9.98444 7.75706 10.1034 7.99502 10.3414C8.23299 10.5793 8.35197 10.8764 8.35197 11.2325V26.2091C8.35197 26.5619 8.23215 26.8581 7.99253 27.0977C7.7529 27.3374 7.45586 27.4572 7.10142 27.4572M16.5117 27.4572C16.1573 27.4572 15.8611 27.3374 15.6231 27.0977C15.3852 26.8581 15.2662 26.5619 15.2662 26.2091V1.24807C15.2662 0.893623 15.3852 0.596585 15.6231 0.356959C15.8627 0.118997 16.1598 1.72146e-05 16.5142 1.72146e-05C16.8687 1.72146e-05 17.1649 0.118997 17.4028 0.356959C17.6408 0.594921 17.7606 0.891959 17.7623 1.24807V26.2091C17.7623 26.5619 17.6425 26.8581 17.4028 27.0977C17.1632 27.3374 16.8662 27.4572 16.5117 27.4572ZM25.9196 27.4572C25.5651 27.4572 25.2689 27.3374 25.0309 27.0977C24.7913 26.8581 24.6715 26.5619 24.6715 26.2091V1.24807C24.6715 0.893623 24.7921 0.596585 25.0334 0.356959C25.2747 0.117333 25.5709 -0.00164686 25.9221 1.72146e-05C26.2732 0.00168128 26.5694 0.120661 26.8107 0.356959C27.052 0.593257 27.1718 0.890295 27.1701 1.24807V26.2091C27.1701 26.5619 27.0503 26.8581 26.8107 27.0977C26.571 27.3374 26.274 27.4572 25.9196 27.4572ZM41.4953 26.8431C41.2024 27.0095 40.8862 27.0453 40.5467 26.9505C40.2089 26.8573 39.9576 26.6659 39.7929 26.3764L32.3046 13.2718C32.1315 12.9773 32.0924 12.6594 32.1873 12.3183C32.2821 11.9772 32.4743 11.7234 32.7639 11.557C33.0534 11.3906 33.3696 11.354 33.7124 11.4472C34.0552 11.5403 34.3065 11.7317 34.4662 12.0213L41.9545 25.1258C42.1259 25.422 42.165 25.7407 42.0718 26.0818C41.9787 26.423 41.7856 26.6767 41.4928 26.8431"
                    fill="#566033"
                  />
                </svg>
                <h3 className="font-serif text-2xl font-semibold text-nook-green-light">
                  Explore
                </h3>
              </div>
              <p className="font-sans text-sm text-nook-brown leading-relaxed">
                Discover new literary worlds, inspiring bookshelves, and the
                most creative nooks from the community.
              </p>
            </div>

            {/* Connect card */}
            <div className="bg-surface-paper-light rounded-2xl p-10 flex flex-col items-center text-center space-y-7 hover:shadow-lg transition-shadow">
              <div className="space-y-3 flex flex-col items-center">
                <svg width="54" height="42" viewBox="0 0 54 42" fill="none">
                  <path
                    d="M7.62203 10.4803C7.62203 9.35423 7.84382 8.2392 8.27474 7.19886C8.70567 6.15852 9.33728 5.21324 10.1335 4.417C10.9298 3.62076 11.875 2.98915 12.9154 2.55822C13.9557 2.1273 15.0707 1.90551 16.1968 1.90551C17.3229 1.90551 18.4379 2.1273 19.4782 2.55822C20.5186 2.98915 21.4638 3.62076 22.2601 4.417C23.0563 5.21324 23.6879 6.15852 24.1189 7.19886C24.5498 8.2392 24.7716 9.35423 24.7716 10.4803C24.7716 12.7545 23.8682 14.9355 22.2601 16.5436C20.652 18.1517 18.471 19.0551 16.1968 19.0551C13.9226 19.0551 11.7416 18.1517 10.1335 16.5436C8.52544 14.9355 7.62203 12.7545 7.62203 10.4803ZM16.1968 0C13.4173 0 10.7516 1.10417 8.78612 3.0696C6.82069 5.03504 5.71652 7.70074 5.71652 10.4803C5.71652 13.2598 6.82069 15.9255 8.78612 17.891C10.7516 19.8564 13.4173 20.9606 16.1968 20.9606C18.9763 20.9606 21.6421 19.8564 23.6075 17.891C25.5729 15.9255 26.6771 13.2598 26.6771 10.4803C26.6771 7.70074 25.5729 5.03504 23.6075 3.0696C21.6421 1.10417 18.9763 0 16.1968 0ZM34.2991 13.3385C34.2991 11.8224 34.9014 10.3684 35.9734 9.29636C37.0455 8.2243 38.4995 7.62203 40.0156 7.62203C41.5317 7.62203 42.9858 8.2243 44.0578 9.29636C45.1299 10.3684 45.7322 11.8224 45.7322 13.3385C45.7322 14.8547 45.1299 16.3087 44.0578 17.3807C42.9858 18.4528 41.5317 19.0551 40.0156 19.0551C38.4995 19.0551 37.0455 18.4528 35.9734 17.3807C34.9014 16.3087 34.2991 14.8547 34.2991 13.3385ZM40.0156 5.71652C37.9941 5.71652 36.0555 6.51955 34.6261 7.94896C33.1966 9.37837 32.3936 11.3171 32.3936 13.3385C32.3936 15.36 33.1966 17.2987 34.6261 18.7281C36.0555 20.1575 37.9941 20.9606 40.0156 20.9606C42.0371 20.9606 43.9758 20.1575 45.4052 18.7281C46.8346 17.2987 47.6377 15.36 47.6377 13.3385C47.6377 11.3171 46.8346 9.37837 45.4052 7.94896C43.9758 6.51955 42.0371 5.71652 40.0156 5.71652ZM5.71652 24.7716C4.2004 24.7716 2.74639 25.3739 1.67433 26.4459C0.602275 27.518 0 28.972 0 30.4881C0 32.6147 0.794596 35.4996 3.27557 37.8491C5.76225 40.2043 9.83241 41.9211 16.1949 41.9211C22.5574 41.9211 26.6314 40.2062 29.118 37.8491C31.599 35.4996 32.3936 32.6147 32.3936 30.4881C32.3936 28.972 31.7913 27.518 30.7193 26.4459C29.6472 25.3739 28.1932 24.7716 26.6771 24.7716H5.71652ZM1.90551 30.4881C1.90551 29.4774 2.30702 28.508 3.02173 27.7933C3.73643 27.0786 4.70578 26.6771 5.71652 26.6771H26.6771C27.6878 26.6771 28.6572 27.0786 29.3719 27.7933C30.0866 28.508 30.4881 29.4774 30.4881 30.4881C30.4881 32.1726 29.8536 34.5278 27.809 36.4657C25.7701 38.3979 22.2182 40.0156 16.1968 40.0156C10.1754 40.0156 6.62354 38.396 4.58465 36.4657C2.54004 34.5278 1.90551 32.1726 1.90551 30.4881ZM34.2286 35.4196C33.9872 35.9937 33.6938 36.5654 33.3483 37.1345C35.1128 37.7386 37.306 38.1101 40.0156 38.1101C45.4311 38.1101 48.7829 36.6296 50.7894 34.7564C52.7749 32.9043 53.3542 30.7434 53.3542 29.5354C53.3542 28.2719 52.8523 27.0602 51.9589 26.1669C51.0655 25.2735 49.8538 24.7716 48.5904 24.7716H33.0682C33.5788 25.3432 34.0152 25.9835 34.3601 26.6771H48.5904C49.3485 26.6771 50.0755 26.9782 50.6115 27.5143C51.1475 28.0503 51.4487 28.7773 51.4487 29.5354C51.4487 30.2347 51.0752 31.8848 49.4879 33.3654C47.9235 34.8269 45.0805 36.2046 40.0156 36.2046C37.6242 36.2046 35.7282 35.8978 34.2286 35.4196Z"
                    fill="#5F6B39"
                  />
                </svg>
                <h3 className="font-serif text-2xl font-semibold text-nook-green-light">
                  Connect
                </h3>
              </div>
              <p className="font-sans text-sm text-nook-brown leading-relaxed">
                Participate in discussion threads, share recommendations, and
                connect with readers like you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Reading Analytics Section */}
      <section className="w-full px-6 md:px-12 lg:px-40 py-20 bg-surface-paper-light/50">
        <div className="max-w-7xl mx-auto space-y-14">
          <div className="text-center space-y-4">
            <h2 className="font-serif text-4xl md:text-5xl font-semibold text-nook-green-dark tracking-tight">
              Your Reading Journey
            </h2>
            <p className="font-sans text-lg text-nook-brown">
              Discover your next favorite book, handpicked just for you
            </p>
          </div>

          {/* Stats Cards - Mock data por ahora */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <div className="bg-white rounded-xl p-6 text-center space-y-2 shadow-sm hover:shadow-md transition-shadow">
              <BookOpen className="w-8 h-8 text-nook-green-light mx-auto" />
              <p className="font-serif text-3xl font-semibold text-nook-green-dark">
                12
              </p>
              <p className="font-sans text-sm text-nook-brown">
                Books This Year
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 text-center space-y-2 shadow-sm hover:shadow-md transition-shadow">
              <TrendingUp className="w-8 h-8 text-nook-green-light mx-auto" />
              <p className="font-serif text-3xl font-semibold text-nook-green-dark">
                3,240
              </p>
              <p className="font-sans text-sm text-nook-brown">Pages Read</p>
            </div>

            <div className="bg-white rounded-xl p-6 text-center space-y-2 shadow-sm hover:shadow-md transition-shadow">
              <Calendar className="w-8 h-8 text-nook-green-light mx-auto" />
              <p className="font-serif text-3xl font-semibold text-nook-green-dark">
                5
              </p>
              <p className="font-sans text-sm text-nook-brown">Day Streak</p>
            </div>

            <div className="bg-white rounded-xl p-6 text-center space-y-2 shadow-sm hover:shadow-md transition-shadow">
              <Star className="w-8 h-8 text-nook-green-light mx-auto" />
              <p className="font-serif text-3xl font-semibold text-nook-green-dark">
                4.3
              </p>
              <p className="font-sans text-sm text-nook-brown">Avg Rating</p>
            </div>
          </div>

          {/* Recommended Books */}
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-2xl md:text-3xl font-semibold text-nook-green-dark">
                Recommended for You
              </h3>
              <button className="font-sans text-sm text-nook-green-light hover:underline">
                See all
              </button>
            </div>

            {loadingRecommendations ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="space-y-3 animate-pulse">
                    <div className="aspect-[2/3] bg-surface-paper-light rounded-lg" />
                    <div className="h-4 bg-surface-paper-light rounded w-3/4" />
                    <div className="h-3 bg-surface-paper-light rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : recommendations.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
                {recommendations.slice(0, 4).map((book) => (
                  <BookCard
                    key={book.id}
                    title={book.title}
                    authors={book.authors}
                    coverImage={book.coverImage}
                    rating={book.rating}
                    matchReason={book.matchReason}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-xl">
                <BookOpen className="w-16 h-16 text-brand-forest/30 mx-auto mb-4" />
                <p className="font-sans text-base text-nook-brown">
                  Start tracking your reading to get personalized
                  recommendations
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Fresh Off the Press Section */}
      <section className="w-full px-6 md:px-12 lg:px-40 py-20">
        <div className="max-w-7xl mx-auto space-y-14">
          <div className="text-center space-y-4">
            <h2 className="font-serif text-4xl md:text-5xl font-semibold text-nook-green-dark tracking-tight">
              Fresh Off the Press 📚
            </h2>
            <p className="font-sans text-lg text-nook-brown">
              The latest releases in fiction and beyond
            </p>
          </div>

          {loadingReleases ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-3 animate-pulse">
                  <div className="aspect-[2/3] bg-surface-paper-light rounded-lg" />
                  <div className="h-4 bg-surface-paper-light rounded w-3/4" />
                  <div className="h-3 bg-surface-paper-light rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : newReleases.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
              {newReleases.map((book) => (
                <BookCard
                  key={book.id}
                  title={book.title}
                  authors={book.authors}
                  coverImage={book.coverImage}
                  rating={book.rating}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-surface-paper-light rounded-xl">
              <BookOpen className="w-16 h-16 text-brand-forest/30 mx-auto mb-4" />
              <p className="font-sans text-base text-nook-brown">
                No new releases available at the moment
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
