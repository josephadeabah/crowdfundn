"use client";

import React from 'react';
import { useAuth } from '../context/auth/AuthContext';

const HowItWorks = () => {
  const { user } = useAuth();

  return (
    <div className="p-6 md:p-12 bg-gray-50 text-gray-800">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-green-700">
          How BantuHive Works
        </h1>
        <p className="text-lg leading-8 text-center mb-12 px-12 py-4">
          You’ve got a dream, a cause, or a burning desire to make a difference.
          Whether it’s for yourself, a loved one, or a community in need,
          <span className="text-orange-600 font-semibold"> BantuHive </span>
          is here to turn your vision into reality. Let’s take the first step
          together!
        </p>

        {/* Start Your Fundraiser */}
        <section className="mb-16 p-12">
          <h2 className="text-3xl font-semibold mb-6 text-green-600">
            Start Your Fundraiser
          </h2>
          <p className="text-lg leading-8 mb-4">
            The journey begins with a single step: setting up your fundraiser.
            Don’t worry – we’ve made it super simple and absolutely free to
            start.
          </p>
          <ol className="list-decimal list-inside mb-6 space-y-3">
            <li>
              <span className="font-semibold">Set your goal:</span> Decide how
              much you want to raise. Met your goal early? You can adjust it
              anytime!
            </li>
            <li>
              <span className="font-semibold">Tell your story:</span> Share why
              this fundraiser matters to you. Be heartfelt, be authentic – your
              passion will inspire others.
            </li>
            <li>
              <span className="font-semibold">Add a picture or video:</span> A
              great image or a captivating video can work wonders in bringing
              your story to life.
            </li>
          </ol>
          <a
            href="/tutorial"
            className="text-orange-600 underline hover:text-orange-700 font-semibold"
          >
            Watch our video tutorial to get started.
          </a>
        </section>

        {/* Share with Friends */}
        <section className="mb-16 p-12">
          <h2 className="text-3xl font-semibold mb-6 text-green-600">
            Share with Friends
          </h2>
          <p className="text-lg leading-8 mb-4">
            The key to a successful fundraiser? Spreading the word far and wide.
            Let the world know about your cause – and let them help you make it
            happen.
          </p>
          <ul className="list-disc list-inside mb-6 space-y-3">
            <li>
              <span className="font-semibold">Send emails:</span> Share your
              fundraiser link with family, friends, and coworkers via email.
              Tell them why their support matters.
            </li>
            <li>
              <span className="font-semibold">Leverage social media:</span> Post
              regularly on platforms like Instagram, Facebook, and Twitter. Use
              hashtags and share updates to keep the momentum going.
            </li>
            <li>
              <span className="font-semibold">Get creative:</span> Design
              posters, add QR codes, or even host a small event to spread the
              word offline.
            </li>
          </ul>
          <a
            href="/social-media-tips"
            className="text-orange-600 underline hover:text-orange-700 font-semibold"
          >
            Need tips? Check out our guide to sharing on social media.
          </a>
        </section>

        {/* Manage Donations */}
        <section className="mb-16 p-12">
          <h2 className="text-3xl font-semibold mb-6 text-green-600">
            Manage Donations
          </h2>
          <p className="text-lg leading-8 mb-4">
            Watch as donations start to roll in! BantuHive makes managing your
            fundraiser a breeze.
          </p>
          <ul className="list-disc list-inside mb-6 space-y-3">
            <li>
              <span className="font-semibold">Say thank you:</span> Use our
              built-in tools to send personalized messages of gratitude to your
              supporters.
            </li>
            <li>
              <span className="font-semibold">Post updates:</span> Keep donors
              in the loop with updates on your progress, offline events, or
              milestones reached.
            </li>
            <li>
              <span className="font-semibold">Offer rewards:</span> Reward your
              backers with exclusive perks or gifts – a heartfelt thank-you goes
              a long way!
            </li>
          </ul>
        </section>

        {/* Rewards and Recurring Donations */}
        <section className="mb-16 p-12">
          <h2 className="text-3xl font-semibold mb-6 text-green-600">
            Rewards & Recurring Donations
          </h2>
          <p className="text-lg leading-8 mb-4">
            BantuHive goes beyond one-time donations. Fundraisers can offer
            rewards to their backers – from shoutouts to exclusive items –
            creating a deeper connection with supporters.
          </p>
          <p className="text-lg leading-8">
            Have a cause that requires ongoing support? No problem! With our
            <span className="text-orange-600 font-semibold">
              {' '}
              recurring donation{' '}
            </span>
            feature, your backers can pledge continuous support for as long as
            your campaign needs.
          </p>
        </section>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <a
            href={`${user ? '/account/dashboard/create' : '/auth/register'}`}
            className="px-6 py-3 bg-green-600 text-white rounded-lg text-lg font-semibold shadow-lg hover:bg-green-700"
          >
            Start Your Fundraiser Today
          </a>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
