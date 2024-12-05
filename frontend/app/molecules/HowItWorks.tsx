'use client';

import React from 'react';
import { useAuth } from '../context/auth/AuthContext';

const HowItWorks = () => {
  const { user } = useAuth();

  return (
    <div className="h-full p-6 md:p-12 bg-gray-50 text-gray-800">
      <div className="max-w-7xl mx-auto h-full py-16">
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

        {/* Feature Goals for the Next 3 Years */}
        <section className="mb-16 p-12">
          <h2 className="text-3xl font-semibold mb-6 text-green-600">
            Our Vision: What's Next for BantuHive in five years
          </h2>
          <p className="text-lg leading-8 mb-4">
            At BantuHive, we’re not just about helping you reach your goals
            today – we’re also building the tools and features that will shape
            the future of crowdfunding. Here’s a glimpse of where we’re headed
            in the next five years:
          </p>
          <ul className="list-disc list-inside mb-6 space-y-3">
            <li>
              <span className="font-semibold">
                AI-Driven Fundraising Insights:
              </span>{' '}
              Personalized strategies and recommendations to optimize your
              campaign and maximize engagement.
            </li>
            <li>
              <span className="font-semibold">
                Collaborative Campaign Building:
              </span>{' '}
              Create campaigns with your team, with shared dashboards and pooled
              efforts to amplify success.
            </li>
            <li>
              <span className="font-semibold">
                Mobile App with Offline Access:
              </span>{' '}
              Manage your campaigns and connect with donors anytime, anywhere –
              even without the internet.
            </li>
            <li>
              <span className="font-semibold">Gamified Challenges:</span> Foster
              engagement with milestone-based challenges and rewarding donor
              interactions.
            </li>
          </ul>
          <ul className="list-disc list-inside mb-6 space-y-3">
            <li>
              <span className="font-semibold">
                Incentivized Sharing with Rewards & Gamification:
              </span>{' '}
              Earn badges, unlock platform discounts, or receive donation
              matches for sharing your campaign. Our gamified point system
              ensures every share counts!
            </li>
            <li>
              <span className="font-semibold">Seamless Sharing Tools:</span>{' '}
              Share with a single click across social media. Take advantage of
              our pre-designed templates, auto-generated captions, and
              storytelling tools to effortlessly spread the word.
            </li>
            <li>
              <span className="font-semibold">
                Social Proof & Community Engagement:
              </span>{' '}
              See who’s sharing and join the excitement! Our crowdfunding
              leaderboards and sharing challenges create an energetic and
              supportive community.
            </li>
            <li>
              <span className="font-semibold">
                Influencer & Ambassador Programs:
              </span>{' '}
              Partner with micro-influencers or sign up as an ambassador to
              champion your cause. Our referral programs reward those who go
              above and beyond in sharing campaigns.
            </li>
            <li>
              <span className="font-semibold">
                Progress Tracking & Visibility:
              </span>{' '}
              Track your impact with visual sharing progress bars and real-time
              updates. Celebrate milestones with personalized prompts to keep
              the momentum alive.
            </li>
            <li>
              <span className="font-semibold">
                Smart Personalization with AI:
              </span>{' '}
              Data-driven insights suggest the best times and platforms for
              sharing, helping you reach your audience when they’re most
              engaged.
            </li>
            <li>
              <span className="font-semibold">Crowdfunding Collaboration:</span>{' '}
              Team up with friends, family, or colleagues to raise funds
              together. Shared dashboards and team goals make fundraising a
              collaborative effort.
            </li>
            <p className="text-3xl leading-8 font-semibold py-6 text-green-600">
              Earn an honorable Award for your Impact.
            </p>
            <ul className="mt-2 ml-6 list-disc space-y-2">
              <li>
                <span className="font-semibold">
                  Certificate of Generosity:
                </span>{' '}
                Highlights your commitment to spreading kindness and supporting
                meaningful causes.
              </li>
              <li>
                <span className="font-semibold">
                  Ambassador of Impact Award:
                </span>{' '}
                Celebrates individuals who actively amplify campaigns and drive
                meaningful change.
              </li>
              <li>
                <span className="font-semibold">
                  Community Champion Certificate:
                </span>{' '}
                Honors those who lead by example in creating a supportive and
                engaged community.
              </li>
              <li>
                <span className="font-semibold">Honor of Advocacy:</span>{' '}
                Recognizes passionate individuals advocating for diverse causes
                through sharing.
              </li>
              <li>
                <span className="font-semibold">Beacon of Hope Award:</span>{' '}
                Symbolizes your role in bringing hope and visibility to
                important causes.
              </li>
              <li>
                <span className="font-semibold">
                  Certificate of Social Impact:
                </span>{' '}
                Emphasizes the tangible difference you have made by supporting
                and sharing campaigns.
              </li>
              <li>
                <span className="font-semibold">
                  Certificate of Empowerment:
                </span>{' '}
                Highlights how you empower others by amplifying their stories
                and campaigns.
              </li>
            </ul>
          </ul>
          <p className="text-lg leading-8 font-semibold mb-6 text-green-600">
            These upcoming features are just the beginning. At BantuHive, we’re
            committed to evolving with your needs, making crowdfunding smarter,
            more connected, and more successful for everyone.
          </p>
          <p className="text-lg leading-8">
            Together, we’re redefining crowdfunding – empowering you to achieve
            more, connect deeply, and make a lasting impact.
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
