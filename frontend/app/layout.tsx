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
import PrelineScript from './components/PrelineScript';

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="en"
      className={`h-full scroll-smooth ${roboto.variable} ${ubuntu.variable}`}
    >
      <head>
        <PrelineScript />
      </head>
      <body className="dark:bg-gray-900 mx-auto transition-all duration-150">
        <Providers>
          <Navbar />
          <main className="w-full">{children}</main>
          <Footer />
        </Providers>
        <script src="./node_modules/preline/dist/preline.js"></script>
      </body>
    </html>
  );
}
