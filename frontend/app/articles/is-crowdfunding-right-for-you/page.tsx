'use client';
import { Button } from '@/app/components/button/Button';
import React from 'react';

const WhyIsThisRightForYou = () => {
  return (
    <div className="relative w-full max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-center mb-8 text-green-800">
        Why Is This Right For You?
      </h1>

      <section className="bg-white p-12 rounded-lg shadow-lg mb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          1. Tailored for Africa’s Unique Needs
        </h2>
        <p className="text-lg leading-8 text-gray-700 mb-6">
          BantuHive was created to address the specific challenges that African
          communities face when it comes to fundraising. Traditional global
          platforms may not always cater to these needs, but BantuHive connects
          Africans around the world to fund the dreams, businesses, and causes
          that matter most.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          2. Empowering Dreams Across Africa
        </h2>
        <p className="text-lg leading-8 text-gray-700 mb-6">
          Whether you are an entrepreneur with a groundbreaking idea, a student
          aiming to fund your education, or an organization working on impactful
          projects, BantuHive enables you to turn your aspirations into reality.
          Our platform is designed to foster collaboration and support for
          African communities, allowing individuals to give and receive the
          backing they need.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          3. A Community of Support
        </h2>
        <p className="text-lg leading-8 text-gray-700 mb-6">
          At BantuHive, we are not just another crowdfunding platform. We are a
          community of people who believe in the power of collective effort. We
          provide the tools, guidance, and resources to help your project thrive
          while also connecting you to a broader network of like-minded
          individuals ready to support your mission.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          4. Secure and Seamless Fundraising
        </h2>
        <p className="text-lg leading-8 text-gray-700 mb-6">
          Our platform is built with ease of use in mind. With secure payment
          processing, customizable fundraising campaigns, and an intuitive user
          interface, BantuHive makes it simple for you to raise the funds you
          need. We ensure a smooth experience for both fundraisers and backers,
          making the process of supporting meaningful causes easier than ever.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          5. A Team of Passionate Experts
        </h2>
        <p className="text-lg leading-8 text-gray-700 mb-6">
          At the heart of BantuHive is a passionate team of co-founders and
          experts who have firsthand experience with the challenges of
          fundraising in Africa. Our leadership team includes Nqoba Manana,
          Co-Founder & Co-CEO, and Joseph Adeabah, Co-Founder & Co-CEO, who
          bring decades of experience in business, technology, and innovation to
          help you succeed.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          6. Fostering a Culture of Giving
        </h2>
        <p className="text-lg leading-8 text-gray-700 mb-6">
          At BantuHive, we’re fostering a culture of giving and collaboration,
          where your project not only receives funding but also support, advice,
          and mentorship from people who truly care about its success. Join our
          growing network of change-makers and help shape the future of Africa.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          7. Access to Global Diaspora
        </h2>
        <p className="text-lg leading-8 text-gray-700 mb-6">
          Whether you're based in Africa or abroad, BantuHive offers a unique
          opportunity to tap into the African diaspora community. The platform
          connects you to people across the globe who want to invest in Africa's
          future and contribute to your cause, creating a truly global support
          network.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          8. Real Impact, Real Change
        </h2>
        <p className="text-lg leading-8 text-gray-700 mb-6">
          Every contribution you receive through BantuHive is not just a
          donation; it’s an investment in the future of Africa. By supporting
          causes on BantuHive, backers are playing a direct role in the positive
          transformation of communities across the continent.
        </p>
      </section>

      <div className="text-center">
        <Button className="text-xl py-3 px-6" size="lg" variant="outline">
          Start Your Campaign Now
        </Button>
      </div>
    </div>
  );
};

export default WhyIsThisRightForYou;
