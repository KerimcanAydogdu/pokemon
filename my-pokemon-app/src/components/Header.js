'use client';
import Link from 'next/link';
import { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="absolute top-0 left-0 w-full z-20">
      <nav className="bg-black bg-opacity-20 p-10 flex justify-between items-center ">
        <div className="flex items-center md:m-auto">
          <Link href="/">
            <img src="/pokemon-logo.png" alt="Pokémon Logo" className='w-64 md:w-96' />
          </Link>
        </div>

        <div className="hidden md:flex space-x-6 text-2xl text-rose-100 font-bold m-auto">
          <Link href="/" className="hover:underline">
            Anasayfa
          </Link>
          <Link href="/pokemon?page=1" className="hover:underline">
            Pokémonlar
          </Link>
          <Link href="#contact" className="hover:underline">
            İletişim
          </Link>
        </div>

        <button
          onClick={toggleMenu}
          className="md:hidden text-white  z-30"
        >
          {isMenuOpen ? <FaTimes size={28} /> : <FaBars size={24} />}
        </button>
      </nav>

      <div
        className={`md:hidden fixed inset-0 z-20 transition-transform duration-300 ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        } backdrop-blur-sm`}
      >
        <div className="absolute right-0 w-2/4 max-w-xs bg-red-900 p-8 h-full shadow-lg">
          <ul className="flex flex-col space-y-4 mt-36 text-xl text-white">
            <li>
              <Link href="/" onClick={() => setIsMenuOpen(false)} className="hover:bg-red-700 p-2 rounded-md transition-colors">
                Anasayfa
              </Link>
            </li>
            <li>
              <Link href="/pokemon?page=1" onClick={() => setIsMenuOpen(false)} className="hover:bg-red-700 p-2 rounded-md transition-colors">
                Pokémonlar
              </Link>
            </li>
            <li>
              <Link href="#contact" onClick={() => setIsMenuOpen(false)} className="hover:bg-red-700 p-2 rounded-md transition-colors">
                İletişim
              </Link>
            </li>
          </ul>
          <div className="mt-8">
            <Link href="/" onClick={() => setIsMenuOpen(false)}>
              <img src="/pokemon-logo.png" alt="Pokémon Logo" width={125} height={50} />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
