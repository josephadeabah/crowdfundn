'use client';
import '../styles/globals.css';
import { Roboto, Ubuntu } from 'next/font/google';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Providers from './Providers';
import { ReactNode, useEffect } from 'react';
// import { Analytics } from '@vercel/analytics/react';
import { GlobalContextProvider } from './context/GlobalContextProvider';
import Head from './head';
import { usePathname } from 'next/navigation';
import UIkit from "uikit";
import "uikit/dist/css/uikit.min.css";
import Icons from "uikit/dist/js/uikit-icons";

const roboto = Roboto({
  weight: ['400', '500', '700', '900'],
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
  useEffect(() => {
    UIkit.use(Icons); // Load UIkit icons (optional)
  }, []);
  const pathname = usePathname();
  const hideFooter =
    pathname.startsWith('/account') || pathname.startsWith('/admin');
  return (
    <html lang="en" className="h-full scroll-smooth light">
      <Head />
      <body
        className={`max-w-full bg-green-50 opacity-2 dark:bg-gray-900 mx-auto transition-all duration-150 ${roboto.variable} ${ubuntu.variable} h-full flex flex-col min-h-screen`}
      >
        <GlobalContextProvider>
          <Providers>
            <Navbar />
            <main className="flex-grow w-full">
              {children}
            </main>
            {!hideFooter && <Footer />}
          </Providers>
        </GlobalContextProvider>
      </body>
    </html>
  );
}
