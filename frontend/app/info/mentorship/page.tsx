// app/mentorship/page.tsx

import { Metadata } from 'next';
import MentorshipHero from './MentorshipHero';
import HowItWorks from './HowItWorks';
import MentorBenefits from './MentorBenefits';
import FAQ from './FAQ';
import CTASection from './CTASection';

export const metadata: Metadata = {
  title: 'Founder Mentorship Program | Grow Your Venture',
  description:
    'Connect with experienced mentors to guide your fundraising journey and accelerate your startup growth.',
};

export default function MentorshipPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <MentorshipHero />
      <HowItWorks />
      <MentorBenefits />
      <FAQ />
      <CTASection />
    </div>
  );
}
