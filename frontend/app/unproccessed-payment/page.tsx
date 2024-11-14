import React, { Suspense } from 'react';
import UnverifiedPayment from '../components/thankyou/UnverifiedPayment';
import FullscreenLoader from '../loaders/FullscreenLoader';

export default function UnverifiedPaymentLayout() {
  return (
    <Suspense fallback={<FullscreenLoader />}>
      <UnverifiedPayment />
    </Suspense>
  );
}
