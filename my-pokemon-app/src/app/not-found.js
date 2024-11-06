import Image from 'next/image';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      <div className="sm:hidden">
        <Image src="/4044.jpg" alt="404 Mobile"
          width={1000}
          height={96}
          className="absolute inset-0 w-full h-full object-cover z-0 brightness-50" />
      </div>
      <div className="hidden sm:block">
        <Image src="/404.jpg" alt="404 Desktop"
          width={1000}
          height={96}
          className="absolute inset-0 w-full h-full object-cover z-0 brightness-50" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center">
        <h1 className="text-5xl md:text-7xl  font-bold">404 - Sayfa Bulunamadı</h1>
        <p className="mt-7 text-2xl md:text-3xl text-gray-300 text-opacity-50 font-bold">
          Üzgünüz, aradığınız sayfa bulunamadı.
        </p>
        <Link href="/">
          <button className="mt-20 px-5 py-2 text-white btn">
            Ana Sayfaya Dön
          </button>
        </Link>
      </div>
    </div>
  );
}
