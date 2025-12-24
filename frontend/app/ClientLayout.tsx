// app/ClientLayout.tsx
'use client';
import { usePathname } from 'next/navigation';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Providers from './Providers';
import { GlobalContextProvider } from './context/GlobalContextProvider';
import GoogleTagManager from './components/googletag/GoogleTagManager';

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const pathname = usePathname();
  const hideFooter =
    pathname.startsWith('/account') || pathname.startsWith('/admin');

  return (
    <>
      <GoogleTagManager />
      <div className="h-full scroll-smooth light">
        <body className="max-w-full bg-green-50 mx-auto transition-all duration-150 h-full flex flex-col min-h-screen">
          <GlobalContextProvider>
            <Providers>
              <Navbar />
              <main className="flex-grow w-full">{children}</main>
              {!hideFooter && <Footer />}
            </Providers>
          </GlobalContextProvider>
        </body>
      </div>
    </>
  );
}