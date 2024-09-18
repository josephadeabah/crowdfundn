import '../styles/globals.css';
import { Roboto, Ubuntu } from '@next/font/google';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Providers from './Providers';

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

import { ReactNode } from 'react';

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="en"
      className={`h-full scroll-smooth ${roboto.variable} ${ubuntu.variable}`}
    >
      <head />
      <body className="dark:from-[#242933] dark:to-[#2A303C] mx-auto transition-all duration-150">
        <Providers>
          <Navbar />
          <main className="w-full">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
