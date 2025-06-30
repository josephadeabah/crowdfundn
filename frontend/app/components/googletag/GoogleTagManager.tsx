'use client';

import { useEffect } from 'react';
import Script from 'next/script';

// Extend the Window interface to include dataLayer
declare global {
  interface Window {
    dataLayer: unknown[];
  }
}

export default function GoogleTagManager() {
  useEffect(() => {
    // Initialize dataLayer if it doesn't exist
    window.dataLayer = window.dataLayer || [];

    // Properly typed gtag function
    const gtag = (...args: unknown[]) => {
      window.dataLayer.push(args);
    };

    // Type-safe calls
    gtag('js', new Date());
    gtag('config', 'G-YWLECWF7W7');
  }, []);

  return (
    <Script
      strategy="afterInteractive"
      src={`https://www.googletagmanager.com/gtag/js?id=G-YWLECWF7W7`}
    />
  );
}
