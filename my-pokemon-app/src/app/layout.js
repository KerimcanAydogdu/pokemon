import "./globals.css";
import Header from "@/components/Header";
import { Varela_Round } from 'next/font/google'

const inter = Varela_Round({
  weight: ['400', '400'],
  style: [ 'normal'],
  subsets: ['latin'],
  display: 'swap',
})

export const metadata = {
  title: "Pokémon",
  description: "Koooolay gelsin",
  icon: "/favicon.ico",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`flex flex-col min-h-screen ${inter.className}`}
      >
        <Header />
        <main className="flex-grow">{children}</main>
      </body>
    </html>
  );
}
