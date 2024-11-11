import React, { Suspense } from 'react';
import ThankYouPage from '@/app/components/thankyou/ThankYouPage';

export default function ThankYouLayout() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ThankYouPage />
    </Suspense>
  );
}
