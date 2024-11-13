import localFont from "next/font/local";
import "./globals.css"; // Make sure your global CSS styles are defined here
import Header from "@/components/Header";
import { Inter } from 'next/font/google'

const inter = Inter({
  weight: ['400', '700'],
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
