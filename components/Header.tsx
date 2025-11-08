import Link from "next/link";
import Logo from "./Logo";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#E0D8D1] bg-[rgba(250,250,249,0.80)] backdrop-blur-sm">
      <div className="w-full h-20 px-4 md:px-7 flex items-center justify-between">
        <div className="flex items-center gap-8 md:gap-12">
          <Link href="/home">
            <Logo iconOnly className="w-12 h-14" />
          </Link>

          <nav className="hidden md:flex items-center gap-6 lg:gap-12">
            <Link href="/my-nook" className="flex items-center gap-3">
              <span className="font-serif text-2xl font-normal text-brand-forest hover:text-nook-green-light transition-colors">
                My nook
              </span>
              <div className="w-1.5 h-1.5 rounded-full bg-brand-forest"></div>
            </Link>
            
            <Link href="/bookshelf" className="flex items-center gap-3">
              <span className="font-serif text-2xl font-normal text-brand-forest hover:text-nook-green-light transition-colors">
                Bookshelf
              </span>
              <div className="w-1.5 h-1.5 rounded-full bg-brand-forest"></div>
            </Link>
            
            <Link href="/explore" className="flex items-center gap-3">
              <span className="font-serif text-2xl font-normal text-brand-forest hover:text-nook-green-light transition-colors">
                Explore
              </span>
              <div className="w-1.5 h-1.5 rounded-full bg-brand-forest"></div>
            </Link>
            
            <Link href="/connect" className="font-serif text-2xl font-normal text-brand-forest hover:text-nook-green-light transition-colors">
              Connect
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <button className="w-13 h-13 rounded-full bg-brand-forest flex items-center justify-center hover:bg-nook-green-dark transition-colors">
            <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20.9999 7.00001C22.8565 7.00001 24.6369 7.73751 25.9497 9.05026C27.2624 10.363 27.9999 12.1435 27.9999 14C27.9999 15.8565 27.2624 17.637 25.9497 18.9498C24.6369 20.2625 22.8565 21 20.9999 21C19.1434 21 17.363 20.2625 16.0502 18.9498C14.7374 17.637 13.9999 15.8565 13.9999 14C13.9999 12.1435 14.7374 10.363 16.0502 9.05026C17.363 7.73751 19.1434 7.00001 20.9999 7.00001ZM20.9999 24.5C28.7349 24.5 34.9999 27.6325 34.9999 31.5V35H6.99995V31.5C6.99995 27.6325 13.2649 24.5 20.9999 24.5Z" fill="white"/>
            </svg>
          </button>

          <button className="md:hidden w-9 h-7 flex flex-col justify-between">
            <div className="w-full h-0.5 bg-brand-forest"></div>
            <div className="w-full h-0.5 bg-brand-forest"></div>
            <div className="w-full h-0.5 bg-brand-forest"></div>
          </button>
        </div>
      </div>
    </header>
  );
}
