import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="relative w-full h-screen overflow-hidden">
       <Image src="/a.jpeg" alt="Pokémon Logo" 
       width={1000}
       height={96} 
       className="absolute inset-0 w-full h-full object-cover z-0 brightness-50" />
       
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center">
        <h1 className="text-5xl md:text-7xl text-gray-300 font-bold">Pokemon Sayfasına Hoş Geldiniz</h1>
        <p className="mt-7 text-2xl md:text-3xl text-yellow-300 text-opacity-80 font-bold">En sevdiğiniz Pokemonu keşfedin!</p>
        <Link href="/pokemon">
          <button className="mt-8 px-8 py-4 text-white btn">
            Tüm Pokemonları Göster
          </button>
        </Link>
      </div>
    </div>
  );
}
