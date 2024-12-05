import { SiFlutter } from 'react-icons/si';
import PaystackIcon from '@/app/components/icons/PaystackIcon';
import { FaCreditCard, FaPaypal, FaStripe } from 'react-icons/fa';

const PaymentMethodIcons = ({ type }: { type: string }) => {
  switch (type) {
    case 'Credit Card':
      return (
        <FaCreditCard className="text-2xl mr-3 text-theme-color-primary" />
      );
    case 'PayPal':
      return <FaPaypal className="text-2xl mr-3 text-theme-color-primary" />;
    case 'Stripe':
      return <FaStripe className="text-2xl mr-3 text-theme-color-primary" />;
    case 'Flutterwave':
      return <SiFlutter className="text-2xl mr-3 text-theme-color-primary" />;
    case 'Paystack':
      return (
        <PaystackIcon className="text-2xl mr-3 text-theme-color-primary" />
      );
    default:
      return null;
  }
};

export default PaymentMethodIcons;
