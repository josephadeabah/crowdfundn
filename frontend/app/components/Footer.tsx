'use client';
import React from 'react';
import { FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa';
import BantuHiveLogoIcon from './icons/BantuHiveLogoIcon';

const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-r from-green-500 to-green-800 hover:from-green-800 hover:to-green-700 text-gray-50 py-16">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-no-repeat bg-contain opacity-10"
        style={{ backgroundImage: "url('/undraw_fall-is-coming_tjgw.svg')" }}
      ></div>

      <div className="relative max-w-7xl mx-auto px-6 md:px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo & Mission */}
          <div>
            <BantuHiveLogoIcon className="w-40 h-auto mb-4" />
            <p className="text-sm">
              Empowering communities to fund dreams, transform lives, and drive
              Africa’s growth.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              {[
                'How It Works',
                'Pricing',
                'SME Fundraising',
                'Team Fundraising',
                'Corporate Fundraising',
                'Event Fundraising',
                'Charity Fundraising',
                'Success Stories',
                'Integrations',
              ].map((item) => (
                <li key={item}>
                  <a
                    href={`/${item.toLowerCase().replace(/\s+/g, '-')}`}
                    className="hover:text-orange-400 transition duration-300"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              {[
                'About Us',
                'Blog',
                'Careers',
                'Partners',
                'Investors',
                'Supported Countries',
              ].map((item) => (
                <li key={item}>
                  <a
                    href={`/${item.toLowerCase().replace(/\s+/g, '-')}`}
                    className="hover:text-orange-400 transition duration-300"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              {['FAQs', 'Community Forum', 'Contact Support'].map((item) => (
                <li key={item}>
                  <a
                    href={`/${item.toLowerCase().replace(/\s+/g, '-')}`}
                    className="hover:text-orange-400 transition duration-300"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Mission & Vision Section */}
        <div className="mt-12 text-center border-t border-green-700 pt-8">
          <h3 className="text-xl font-bold">Our Vision</h3>
          <p className="text-sm mt-2 max-w-2xl mx-auto">
            To be Africa’s leading crowdfunding platform, driving a thriving
            continent through innovation, collaboration, and shared prosperity.
          </p>
        </div>

        {/* Social Media & Policies */}
        <div className="mt-12 flex flex-col md:flex-row justify-between items-center text-sm">
          <div className="flex space-x-6 mb-4 md:mb-0">
            <a
              href="https://web.facebook.com/profile.php?id=61568192851056"
              className="text-2xl hover:text-orange-400 transition duration-300"
              aria-label="Facebook"
            >
              <FaFacebook />
            </a>
            <a
              href="https://www.instagram.com/bantuhive_fund/"
              className="text-2xl hover:text-orange-400 transition duration-300"
              aria-label="Instagram"
            >
              <FaInstagram />
            </a>
            <a
              href="https://www.linkedin.com/company/bantu-hive/posts/?feedView=all"
              className="text-2xl hover:text-orange-400 transition duration-300"
              aria-label="LinkedIn"
            >
              <FaLinkedin />
            </a>
          </div>

          <div className="flex space-x-4">
            {['Cookies', 'Privacy', 'Terms'].map((item) => (
              <a
                key={item}
                href={`/${item.toLowerCase()}`}
                className="hover:text-orange-400 transition duration-300"
              >
                {item}
              </a>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <p className="text-center text-xs mt-8">
          &copy; {new Date().getFullYear()} BantuHive Ltd. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
