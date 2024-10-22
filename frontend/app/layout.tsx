'use client';
import '../styles/globals.css';
import { Roboto, Ubuntu } from 'next/font/google';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Providers from './Providers';
import { ReactNode } from 'react';
import { GlobalContextProvider } from './context/GlobalContextProvider';
import Head from './head';

const roboto = Roboto({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto',
});

const ubuntu = Ubuntu({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-ubuntu',
});

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <Head />
      <body
        className={`max-w-full bg-white opacity-2 dark:bg-gray-900 mx-auto transition-all duration-150 ${roboto.variable} ${ubuntu.variable}`}
      >
        <GlobalContextProvider>
          <Providers>
            <Navbar />
            <main className="w-full">{children}</main>
            <Footer />
          </Providers>
        </GlobalContextProvider>
      </body>
    </html>
  );
}
