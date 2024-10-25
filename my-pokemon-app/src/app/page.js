import Link from 'next/link';

export default function Home() {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0 brightness-custom"
      >
        <source src="/pokeballl.mp4" type="video/mp4" />
        Tarayıcınız bu videoyu desteklemiyor.
      </video>
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center">
        <h1 className="text-5xl md:text-7xl text-rose-100 font-bold">Pokemon Sayfasına Hoş Geldiniz</h1>
        <p className="mt-5 text-2xl md:text-3xl text-red-200 font-bold">En sevdiğiniz Pokemonu keşfedin!</p>
        <Link href="/pokemon">
          <button className="mt-5 px-9 py-4 text-white btn">
            Tüm Pokemonları Göster
          </button>
        </Link>
      </div>
    </div>
  );
}
