'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="absolute w-full z-20">
      <nav className="p-4 md:p-6 flex justify-between lg:justify-center items-center">
        
        <div className="flex items-center">
          <Link href="/">
            <Image 
              src="/pokemon-logo.png" 
              alt="Pokémon Logo" 
              width={1000}
              height={96} 
              className="w-48 sm:w-52 lg:w-64 mr-28"
            />
          </Link>
        </div>

        <div className="hidden lg:flex space-x-12 text-lg lg:text-2xl font-semibold text-white">
          <Link href="/" className="hover:text-yellow-300 transition-colors">
            Anasayfa
          </Link>
          <Link href="/pokemon?page=1" className="hover:text-yellow-300 transition-colors">
            Pokémonlar
          </Link>
          <Link href="/power" className="hover:text-yellow-300 transition-colors">
        Güç Sıralması
          </Link>
        </div>

        <button
          onClick={toggleMenu}
          className="lg:hidden text-white z-30"
        >
          {isMenuOpen ? <FaTimes size={28} className="fixed right-6 top-12"/> : <FaBars size={24} />}
        </button>
      </nav>

      <div
        className={`fixed inset-0 z-10 bg-black bg-opacity-50 transition-opacity ${
          isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={() => setIsMenuOpen(false)}
      >
        <div
          className={`fixed top-0 right-0 w-3/5 sm:w-3/5 max-w-xs bg-gradient-to-br from-red-700 to-red-900 h-full shadow-lg p-6 transform transition-transform duration-500 ${
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <ul className="flex flex-col space-y-6 text-lg text-white mt-20">
            <li>
              <Link href="/" onClick={() => setIsMenuOpen(false)} className="block hover:bg-red-800 p-3 rounded-lg transition-all">
                Anasayfa
              </Link>
            </li>
            <li>
              <Link href="/pokemon?page=1" onClick={() => setIsMenuOpen(false)} className="block hover:bg-red-800 p-3 rounded-lg transition-all">
                Pokémonlar
              </Link>
            </li>
            <li>
              <Link href="/sıralama" onClick={() => setIsMenuOpen(false)} className="block hover:bg-red-800 p-3 rounded-lg transition-all">
                Sıralama
              </Link>
            </li>
          </ul>
          <div className="mt-auto flex justify-center">
            <Link href="/" onClick={() => setIsMenuOpen(false)}>
              <Image 
                src="/pokemon-logo.png" 
                alt="Pokémon Logo" 
                width={120} 
                height={50} 
                className="mt-8"
              />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
