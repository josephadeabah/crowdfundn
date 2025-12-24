// app/layout.tsx - SERVER COMPONENT
import '../styles/globals.css';
import '../styles/index.css';
import { Roboto, Ubuntu } from 'next/font/google';
import type { Metadata } from 'next';
import ClientLayout from './ClientLayout';

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

export const metadata: Metadata = {
  title: {
    default: 'BantuHive - Fund & Invest in African Startups & Impact Projects',
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
    title: 'BantuHive - Fund & Invest in African Startups & Impact Projects',
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
    title: 'BantuHive - Fund & Invest in African Startups & Impact Projects',
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
  // ✅ FAVICON HERE - This is what shows in browser tab
  icons: {
    icon: '/bantuhive.ico',
    shortcut: '/bantuhive.ico',
    apple: '/apple-touch-icon.png',
    other: [
      {
        rel: 'icon',
        url: '/bantuhive.svg',
        type: 'image/svg+xml',
      },
    ],
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={`${roboto.variable} ${ubuntu.variable}`}>
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
