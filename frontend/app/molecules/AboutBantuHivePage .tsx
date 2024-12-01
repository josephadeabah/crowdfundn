import React from 'react';

const AboutBantuHivePage = () => {
  return (
    <div className="p-6 md:p-12 bg-green-100 text-green-800">
      <div className="max-w-7xl mx-auto text-center">
        <p className="text-lg leading-8 mb-6">
          <span className="text-orange-500 font-semibold">Fundraising</span> on
          BantuHive is easy, powerful, and trusted.
        </p>
        <p className="text-lg leading-8 mb-6">
          Get what you need to help your fundraiser succeed on BantuHive,
          whether you’re raising money for yourself, friends, family, or
          charity. With{' '}
          <span className="text-orange-500 font-semibold">no fee</span> to
          start, BantuHive is Africa's leading crowdfunding platform – from
          disaster relief and funerals to medical emergencies and charities.
          Whenever you need help, you can ask here.
        </p>
        <p className="text-lg leading-8 mb-8">
          <a
            href="/how-it-works"
            className="text-orange-500 underline hover:text-orange-600 font-semibold"
          >
            Still have questions? Learn more about how BantuHive works.
          </a>
        </p>
        <h2 className="text-3xl font-bold mb-4">We've got you covered.</h2>
        <p className="text-lg leading-8 mb-6">
          BantuHive is a{' '}
          <span className="text-orange-500 font-semibold">trusted leader</span>{' '}
          in online fundraising. With simple pricing and a team of Trust &
          Safety experts in your corner, you can raise money or make a donation
          with{' '}
          <span className="text-orange-500 font-semibold">peace of mind</span>.
        </p>
      </div>
    </div>
  );
};

export default AboutBantuHivePage;