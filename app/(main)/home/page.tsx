"use client";

import Image from "next/image";
import { useAuth } from "@/lib/AuthContext";
import { getGreeting, getDisplayName } from "@/lib/utils/greetings";

export default function HomePage() {
  const { user, userProfile } = useAuth();
  const greeting = getGreeting();
  const displayName = getDisplayName(userProfile?.displayName, user?.email);

  return (
    <div className="min-h-screen bg-surface-paper">
      {/* Hero Section */}
      <section className="w-full px-6 md:px-12 lg:px-40 py-16 md:py-24">
        <div className="max-w-7xl mx-auto grid md:grid-cols-[1fr_auto] gap-12 lg:gap-36 items-center">
          {/* Left content */}
          <div className="space-y-10">
            <div className="space-y-5">
              <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-semibold text-nook-green-light leading-[1.15] tracking-tight">
                {greeting.title},<br />{displayName}!
              </h1>
              
              <p className="font-sans text-xl md:text-2xl text-brand-forest leading-relaxed whitespace-pre-line">
                {greeting.subtitle}
              </p>
              
              <div className="flex flex-wrap gap-6 pt-4">
                <button className="bg-brand-forest text-nook-cream font-sans text-base font-bold py-2.5 px-5 rounded-xl hover:bg-nook-green-dark transition-colors">
                  Find your Nook
                </button>
                <button className="border-2 border-brand-forest text-brand-forest font-sans text-base font-bold py-2.5 px-5 rounded-xl hover:bg-brand-forest hover:text-white transition-colors">
                  Bookshelf
                </button>
              </div>
            </div>

            <div className="font-serif text-[15px] text-brand-forest leading-relaxed italic space-y-1">
              <p className="font-semibold not-italic">Nook /nʊk/ noun</p>
              <p>A corner or recess, especially one offering seclusion or security.</p>
              <p>A small, sheltered or hidden spot.</p>
            </div>
          </div>

          {/* Right illustration */}
          <div className="hidden md:block">
            <Image 
              src="https://api.builder.io/api/v1/image/assets/TEMP/7398012bf4a72aaacbfa21b70a9da8ad302ca6ac?width=1651" 
              alt="Bookshelf illustration"
              width={826}
              height={800}
              className="w-full max-w-2xl h-auto"
              priority
            />
          </div>
        </div>
      </section>

      {/* Reading Progress Section */}
      <section className="w-full bg-surface-paper-light px-6 md:px-12 lg:px-20 py-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-center gap-12 md:gap-32">
          {/* Currently reading */}
          <div className="flex items-center gap-8">
            <svg width="100" height="100" viewBox="0 0 100 100" fill="none" className="flex-shrink-0">
              <path d="M20 30 Q20 20, 30 20 L70 20 Q80 20, 80 30 L80 70 Q80 80, 70 80 L55 80 L50 90 L45 80 L30 80 Q20 80, 20 70 Z" 
                stroke="#566033" strokeWidth="2" fill="none"/>
              <line x1="35" y1="35" x2="65" y2="35" stroke="#566033" strokeWidth="2"/>
              <line x1="35" y1="45" x2="65" y2="45" stroke="#566033" strokeWidth="2"/>
              <line x1="35" y1="55" x2="60" y2="55" stroke="#566033" strokeWidth="2"/>
            </svg>
            <div className="space-y-2">
              <h3 className="font-serif text-2xl font-semibold text-nook-green-light">Currently reading...</h3>
              <p className="font-sans text-base text-nook-brown">The heir of fire, by Sarah J. Mass</p>
              <p className="font-sans text-sm text-nook-brown">47% of progress</p>
            </div>
          </div>

          <div className="hidden md:block w-0.5 h-36 bg-brand-forest"></div>

          {/* Want to read */}
          <div className="flex items-center gap-8">
            <svg width="100" height="100" viewBox="0 0 100 100" fill="none" className="flex-shrink-0">
              <rect x="25" y="15" width="35" height="50" rx="2" stroke="#566033" strokeWidth="2" fill="none"/>
              <rect x="35" y="25" width="35" height="50" rx="2" stroke="#566033" strokeWidth="2" fill="none"/>
              <rect x="45" y="35" width="35" height="50" rx="2" stroke="#566033" strokeWidth="2" fill="none"/>
            </svg>
            <div className="space-y-2">
              <h3 className="font-serif text-2xl font-semibold text-nook-green-light">Want to read</h3>
              <p className="font-sans text-base text-nook-brown">Brandon Sanderson, Sarah J. Mass,<br />Amber V. Nicole... and more!</p>
            </div>
          </div>
        </div>
      </section>

      {/* What are you up to today Section */}
      <section className="w-full px-6 md:px-12 lg:px-40 py-20">
        <div className="max-w-7xl mx-auto space-y-14">
          <h2 className="font-serif text-4xl md:text-5xl font-semibold text-nook-green-dark text-center tracking-tight">
            What are you up to today?
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* My nook card */}
            <div className="bg-surface-paper-light rounded-2xl p-10 flex flex-col items-center text-center space-y-7 hover:shadow-lg transition-shadow">
              <div className="space-y-3 flex flex-col items-center">
                <svg width="54" height="54" viewBox="0 0 54 54" fill="none">
                  <rect x="10" y="10" width="30" height="35" rx="15" stroke="#566033" strokeWidth="1.5" fill="none"/>
                  <path d="M25 15 Q25 10, 30 15" stroke="#566033" strokeWidth="1.5" fill="none"/>
                </svg>
                <h3 className="font-serif text-2xl font-semibold text-nook-green-light">My nook</h3>
              </div>
              <p className="font-sans text-base text-nook-brown leading-relaxed">
                Find your Nook! Choose from pre-configured environments or design your own.
              </p>
            </div>

            {/* Bookshelf card */}
            <div className="bg-surface-paper-light rounded-2xl p-10 flex flex-col items-center text-center space-y-7 hover:shadow-lg transition-shadow">
              <div className="space-y-3 flex flex-col items-center">
                <svg width="66" height="45" viewBox="0 0 67 47" fill="none">
                  <path d="M3.74512 25.4582L33.4219 34.7995L63.1087 21.3299M3.7451 36.095L33.4219 45.4346L63.1087 31.9667C67.1367 30.3204 66.8359 22.5051 63.1087 21.3318M33.8631 8.40377L41.3475 10.8891M3.74677 14.8235C-0.282894 16.4698 0.0162806 24.2851 3.74677 25.4601M33.4219 0.835693L3.74512 14.8234L33.4219 24.163L63.1087 10.6951L33.4219 0.835693Z" stroke="#566033" strokeWidth="1.67137" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <h3 className="font-serif text-2xl font-semibold text-nook-green-light">Bookshelf</h3>
              </div>
              <p className="font-sans text-base text-nook-brown leading-relaxed">
                Organize your collection with custom lists. Track your current reads and discover what to read next
              </p>
            </div>

            {/* Explore card */}
            <div className="bg-surface-paper-light rounded-2xl p-10 flex flex-col items-center text-center space-y-7 hover:shadow-lg transition-shadow">
              <div className="space-y-3 flex flex-col items-center">
                <svg width="48" height="37" viewBox="0 0 48 37" fill="none">
                  <path d="M1.24805 36.865C0.893606 36.865 0.597401 36.7452 0.359439 36.5056C0.119813 36.2659 0 35.9689 0 35.6144C0 35.26 0.119813 34.9638 0.359439 34.7258C0.599065 34.4879 0.89527 34.3681 1.24805 34.3664H46.1779C46.5324 34.3664 46.8286 34.4862 47.0666 34.7258C47.3045 34.9655 47.4243 35.2625 47.426 35.6169C47.4277 35.9714 47.3078 36.2676 47.0666 36.5056C46.8253 36.7435 46.5291 36.8633 46.1779 36.865H1.24805ZM7.10392 27.4547C6.74947 27.4547 6.45243 27.3357 6.2128 27.0977C5.97318 26.8598 5.8542 26.5636 5.85586 26.2091V11.2325C5.85586 10.878 5.97567 10.581 6.2153 10.3414C6.45493 10.1034 6.75196 9.98444 7.10641 9.98444C7.46086 9.98444 7.75706 10.1034 7.99502 10.3414C8.23299 10.5793 8.35197 10.8764 8.35197 11.2325V26.2091C8.35197 26.5619 8.23215 26.8581 7.99253 27.0977C7.7529 27.3374 7.45586 27.4572 7.10142 27.4572M16.5117 27.4572C16.1573 27.4572 15.8611 27.3374 15.6231 27.0977C15.3852 26.8581 15.2662 26.5619 15.2662 26.2091V1.24807C15.2662 0.893623 15.3852 0.596585 15.6231 0.356959C15.8627 0.118997 16.1598 1.72146e-05 16.5142 1.72146e-05C16.8687 1.72146e-05 17.1649 0.118997 17.4028 0.356959C17.6408 0.594921 17.7606 0.891959 17.7623 1.24807V26.2091C17.7623 26.5619 17.6425 26.8581 17.4028 27.0977C17.1632 27.3374 16.8662 27.4572 16.5117 27.4572ZM25.9196 27.4572C25.5651 27.4572 25.2689 27.3374 25.0309 27.0977C24.7913 26.8581 24.6715 26.5619 24.6715 26.2091V1.24807C24.6715 0.893623 24.7921 0.596585 25.0334 0.356959C25.2747 0.117333 25.5709 -0.00164686 25.9221 1.72146e-05C26.2732 0.00168128 26.5694 0.120661 26.8107 0.356959C27.052 0.593257 27.1718 0.890295 27.1701 1.24807V26.2091C27.1701 26.5619 27.0503 26.8581 26.8107 27.0977C26.571 27.3374 26.274 27.4572 25.9196 27.4572ZM41.4953 26.8431C41.2024 27.0095 40.8862 27.0453 40.5467 26.9505C40.2089 26.8573 39.9576 26.6659 39.7929 26.3764L32.3046 13.2718C32.1315 12.9773 32.0924 12.6594 32.1873 12.3183C32.2821 11.9772 32.4743 11.7234 32.7639 11.557C33.0534 11.3906 33.3696 11.354 33.7124 11.4472C34.0552 11.5403 34.3065 11.7317 34.4662 12.0213L41.9545 25.1258C42.1259 25.422 42.165 25.7407 42.0718 26.0818C41.9787 26.423 41.7856 26.6767 41.4928 26.8431" fill="#566033"/>
                </svg>
                <h3 className="font-serif text-2xl font-semibold text-nook-green-light">Explore</h3>
              </div>
              <p className="font-sans text-base text-nook-brown leading-relaxed">
                Discover new literary worlds, inspiring bookshelves, and the most creative nooks from the community.
              </p>
            </div>

            {/* Connect card */}
            <div className="bg-surface-paper-light rounded-2xl p-10 flex flex-col items-center text-center space-y-7 hover:shadow-lg transition-shadow">
              <div className="space-y-3 flex flex-col items-center">
                <svg width="54" height="42" viewBox="0 0 54 42" fill="none">
                  <path d="M7.62203 10.4803C7.62203 9.35423 7.84382 8.2392 8.27474 7.19886C8.70567 6.15852 9.33728 5.21324 10.1335 4.417C10.9298 3.62076 11.875 2.98915 12.9154 2.55822C13.9557 2.1273 15.0707 1.90551 16.1968 1.90551C17.3229 1.90551 18.4379 2.1273 19.4782 2.55822C20.5186 2.98915 21.4638 3.62076 22.2601 4.417C23.0563 5.21324 23.6879 6.15852 24.1189 7.19886C24.5498 8.2392 24.7716 9.35423 24.7716 10.4803C24.7716 12.7545 23.8682 14.9355 22.2601 16.5436C20.652 18.1517 18.471 19.0551 16.1968 19.0551C13.9226 19.0551 11.7416 18.1517 10.1335 16.5436C8.52544 14.9355 7.62203 12.7545 7.62203 10.4803ZM16.1968 0C13.4173 0 10.7516 1.10417 8.78612 3.0696C6.82069 5.03504 5.71652 7.70074 5.71652 10.4803C5.71652 13.2598 6.82069 15.9255 8.78612 17.891C10.7516 19.8564 13.4173 20.9606 16.1968 20.9606C18.9763 20.9606 21.6421 19.8564 23.6075 17.891C25.5729 15.9255 26.6771 13.2598 26.6771 10.4803C26.6771 7.70074 25.5729 5.03504 23.6075 3.0696C21.6421 1.10417 18.9763 0 16.1968 0ZM34.2991 13.3385C34.2991 11.8224 34.9014 10.3684 35.9734 9.29636C37.0455 8.2243 38.4995 7.62203 40.0156 7.62203C41.5317 7.62203 42.9858 8.2243 44.0578 9.29636C45.1299 10.3684 45.7322 11.8224 45.7322 13.3385C45.7322 14.8547 45.1299 16.3087 44.0578 17.3807C42.9858 18.4528 41.5317 19.0551 40.0156 19.0551C38.4995 19.0551 37.0455 18.4528 35.9734 17.3807C34.9014 16.3087 34.2991 14.8547 34.2991 13.3385ZM40.0156 5.71652C37.9941 5.71652 36.0555 6.51955 34.6261 7.94896C33.1966 9.37837 32.3936 11.3171 32.3936 13.3385C32.3936 15.36 33.1966 17.2987 34.6261 18.7281C36.0555 20.1575 37.9941 20.9606 40.0156 20.9606C42.0371 20.9606 43.9758 20.1575 45.4052 18.7281C46.8346 17.2987 47.6377 15.36 47.6377 13.3385C47.6377 11.3171 46.8346 9.37837 45.4052 7.94896C43.9758 6.51955 42.0371 5.71652 40.0156 5.71652ZM5.71652 24.7716C4.2004 24.7716 2.74639 25.3739 1.67433 26.4459C0.602275 27.518 0 28.972 0 30.4881C0 32.6147 0.794596 35.4996 3.27557 37.8491C5.76225 40.2043 9.83241 41.9211 16.1949 41.9211C22.5574 41.9211 26.6314 40.2062 29.118 37.8491C31.599 35.4996 32.3936 32.6147 32.3936 30.4881C32.3936 28.972 31.7913 27.518 30.7193 26.4459C29.6472 25.3739 28.1932 24.7716 26.6771 24.7716H5.71652ZM1.90551 30.4881C1.90551 29.4774 2.30702 28.508 3.02173 27.7933C3.73643 27.0786 4.70578 26.6771 5.71652 26.6771H26.6771C27.6878 26.6771 28.6572 27.0786 29.3719 27.7933C30.0866 28.508 30.4881 29.4774 30.4881 30.4881C30.4881 32.1726 29.8536 34.5278 27.809 36.4657C25.7701 38.3979 22.2182 40.0156 16.1968 40.0156C10.1754 40.0156 6.62354 38.396 4.58465 36.4657C2.54004 34.5278 1.90551 32.1726 1.90551 30.4881ZM34.2286 35.4196C33.9872 35.9937 33.6938 36.5654 33.3483 37.1345C35.1128 37.7386 37.306 38.1101 40.0156 38.1101C45.4311 38.1101 48.7829 36.6296 50.7894 34.7564C52.7749 32.9043 53.3542 30.7434 53.3542 29.5354C53.3542 28.2719 52.8523 27.0602 51.9589 26.1669C51.0655 25.2735 49.8538 24.7716 48.5904 24.7716H33.0682C33.5788 25.3432 34.0152 25.9835 34.3601 26.6771H48.5904C49.3485 26.6771 50.0755 26.9782 50.6115 27.5143C51.1475 28.0503 51.4487 28.7773 51.4487 29.5354C51.4487 30.2347 51.0752 31.8848 49.4879 33.3654C47.9235 34.8269 45.0805 36.2046 40.0156 36.2046C37.6242 36.2046 35.7282 35.8978 34.2286 35.4196Z" fill="#5F6B39"/>
                </svg>
                <h3 className="font-serif text-2xl font-semibold text-nook-green-light">Connect</h3>
              </div>
              <p className="font-sans text-base text-nook-brown leading-relaxed">
                Participate in discussion threads, share recommendations, and connect with readers like you.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

