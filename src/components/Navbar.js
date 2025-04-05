'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (path) => {
    return pathname === path ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white';
  };

  return (
    <nav className="bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-white font-bold text-xl">CryptoWeather</span>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link
                  href="/"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/')}`}
                >
                  Dashboard
                </Link>
                <Link
                  href="/crypto"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/crypto')}`}
                >
                  Crypto Details
                </Link>
                <Link
                  href="/weather"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/weather')}`}
                >
                  Weather Details
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
} 