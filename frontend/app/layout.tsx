// app/layout.tsx
'use client';
import '../styles/globals.css';
import '../styles/index.css';
import { Roboto, Ubuntu } from 'next/font/google';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Providers from './Providers';
import { ReactNode } from 'react';
import { GlobalContextProvider } from './context/GlobalContextProvider';
import { usePathname } from 'next/navigation';
import GoogleTagManager from './components/googletag/GoogleTagManager';

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

// Add this metadata export (server-side)
export const metadata = {
  title: {
    default: 'BantuHive - Fund & Invest in African Startups',
    template: '%s | BantuHive',
  },
  description:
    "Africa's No.1 all-in-one fundraising platform connecting investors with promising startups and impact projects.",
  keywords: [
    'African startups',
    'impact investing',
    'crowdfunding Africa',
    'venture capital Africa',
  ],
  authors: [{ name: 'BantuHive' }],
  metadataBase: new URL('https://www.bantuhive.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.bantuhive.com',
    title: 'BantuHive - Fund & Invest in African Startups',
    description:
      "Africa's premier fundraising platform for startups and impact projects.",
    siteName: 'BantuHive',
    images: [
      {
        url: '/bantuhive.svg',
        width: 1200,
        height: 630,
        alt: 'BantuHive Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BantuHive - Fund & Invest in African Startups',
    description:
      "Africa's premier fundraising platform for startups and impact projects.",
    images: ['/bantuhive.svg'],
    creator: '@bantuhive',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/bantuhive.ico',
    shortcut: '/bantuhive.ico',
    apple: '/apple-touch-icon.png',
    other: {
      rel: 'icon',
      url: '/bantuhive.svg',
      type: 'image/svg+xml',
    },
  },
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const pathname = usePathname();
  const hideFooter =
    pathname.startsWith('/account') || pathname.startsWith('/admin');

  return (
    <html lang="en" className="h-full scroll-smooth light">
      {/* GoogleTagManager needs to be a client component */}
      <GoogleTagManager />
      <body
        className={`max-w-full bg-green-50 mx-auto transition-all duration-150 ${roboto.variable} ${ubuntu.variable} h-full flex flex-col min-h-screen`}
      >
        <GlobalContextProvider>
          <Providers>
            <Navbar />
            <main className="flex-grow w-full">{children}</main>
            {!hideFooter && <Footer />}
          </Providers>
        </GlobalContextProvider>
      </body>
    </html>
  );
}
