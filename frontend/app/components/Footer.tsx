'use client';
import React from 'react';
import { FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <div className="bg-gray-50 dark:text-gray-50 text-gray-800 dark:bg-gray-950 mt-auto w-full">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-screen-xl">
        {/* Main Footer Content */}
        <div className="flex flex-col lg:flex-row justify-between space-y-8 lg:space-y-0">
          {/* Logo and Mission/Vision */}
          <div className="space-y-6 max-w-sm">
            <img
              src="/bantuhive.svg"
              alt="Bantuhive Logo"
              className="w-30 h-auto"
            />
            <div className="text-sm space-y-4">
              <div>
                <div className="font-semibold">Mission:</div>
                <p>
                  To empower people, organizations, and communities across Africa by connecting them with the financial support they need to transform their ideas and aspirations into impactful realities.
                </p>
              </div>
              <div>
                <div className="font-semibold">Vision:</div>
                <p>
                  To be Africa's leading platform for crowdfunding, driving collective growth and transforming communities through collaboration and support.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                {['How It Works', 'Pricing'].map((item) => (
                  <li key={item}>
                    <a
                      href={`/${item.toLowerCase().replace(/\s+/g, '-')}`}
                      className="hover:text-orange-300 transition duration-300"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                {['About Us', 'Careers'].map((item) => (
                  <li key={item}>
                    <a
                      href={
                        item === 'About Us'
                          ? '/about-us'
                          : `/${item.toLowerCase().replace(' ', '-')}`
                      }
                      className="hover:text-orange-300 transition duration-300"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                {['Help Center', 'FAQs'].map((item) => (
                  <li key={item}>
                    <a
                      href={`/${item.toLowerCase().replace(' ', '-')}`}
                      className="hover:text-orange-300 transition duration-300"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-12 pt-8 border-t border-gray-400"></div>

        {/* Bottom Section */}
        <div className="mt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Social Media Links */}
          <div className="flex space-x-6">
            <a
              href="https://web.facebook.com/profile.php?id=61568192851056"
              className="text-2xl hover:text-orange-300 transition duration-300"
              aria-label="Facebook"
            >
              <FaFacebook />
            </a>
            <a
              href="https://www.instagram.com/bantuhive_fund/"
              className="text-2xl hover:text-orange-300 transition duration-300"
              aria-label="Instagram"
            >
              <FaInstagram />
            </a>
            <a
              href="https://www.linkedin.com/company/bantu-hive/posts/?feedView=all"
              target="_blank"
              rel="noopener noreferrer"
              className="text-2xl hover:text-orange-300 transition duration-300"
              aria-label="LinkedIn"
            >
              <FaLinkedin />
            </a>
          </div>

          {/* Legal Links */}
          <div className="flex space-x-4">
            {['Cookies', 'Privacy', 'Terms'].map((item) => (
              <a
                key={item}
                href={`/${item.toLowerCase()}`}
                className="text-sm hover:text-orange-300 transition duration-300"
              >
                {item}
              </a>
            ))}
          </div>

          {/* Copyright and Registration */}
          <div className="text-sm text-center md:text-right space-y-1">
            <p>&copy; {new Date().getFullYear()} BantuHive Ltd. All rights reserved.</p>
            <p>Company Registration Number: <strong>CS185241124</strong></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;