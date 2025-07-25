'use client';
import React from 'react';
import BantuHiveLogoIcon from './icons/BantuHiveLogoIcon';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="relative bg-gray-50 border-t dark:bg-gray-950">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-no-repeat bg-contain opacity-10 dark:opacity-5"
        style={{
          backgroundImage: "url('/undraw_fall-is-coming_tjgw.svg')",
          backgroundPosition: 'right bottom',
          backgroundSize: '30% auto',
        }}
      ></div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Mission */}
          <div className="md:col-span-1">
            <div className="mb-4">
              <BantuHiveLogoIcon className="w-40 h-auto" />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              We're democratizing access to funding. Empowering individuals and
              communities to build legacies, spark innovation, and make good
              things happen.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://web.facebook.com/profile.php?id=61568192851056"
                className="text-gray-400 hover:text-orange-500 dark:hover:text-orange-400"
                aria-label="Facebook"
              >
                <FaFacebook className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                className="text-gray-400 hover:text-orange-500 dark:hover:text-orange-400"
                aria-label="Twitter"
              >
                <FaTwitter className="h-5 w-5" />
              </a>
              <a
                href="https://www.instagram.com/bantuhive_fund/"
                className="text-gray-400 hover:text-orange-500 dark:hover:text-orange-400"
                aria-label="Instagram"
              >
                <FaInstagram className="h-5 w-5" />
              </a>
              <a
                href="https://www.linkedin.com/company/bantu-hive/posts/?feedView=all"
                className="text-gray-400 hover:text-orange-500 dark:hover:text-orange-400"
                aria-label="LinkedIn"
              >
                <FaLinkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="grid grid-cols-2 md:grid-cols-3 col-span-1 md:col-span-2 gap-8">
            <div>
              <h3 className="font-semibold mb-4 dark:text-gray-100">Product</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="/how-it-works"
                    className="text-gray-600 hover:text-orange-500 dark:hover:text-orange-400 dark:text-gray-300"
                  >
                    How it Works
                  </a>
                </li>
                <li>
                  <a
                    href="/upgrade"
                    className="text-gray-600 hover:text-orange-500 dark:hover:text-orange-400 dark:text-gray-300"
                  >
                    Enterprise Support
                  </a>
                </li>
                <li>
                  <a
                    href="/faqs"
                    className="text-gray-600 hover:text-orange-500 dark:hover:text-orange-400 dark:text-gray-300"
                  >
                    FAQ
                  </a>
                </li>
                <li>
                  <a
                    href="/trust-and-safety"
                    className="text-gray-600 hover:text-orange-500 dark:hover:text-orange-400 dark:text-gray-300"
                  >
                    Trust & Safety
                  </a>
                </li>
                <li>
                  <a
                    href="/pricing"
                    className="text-gray-600 hover:text-orange-500 dark:hover:text-orange-400 dark:text-gray-300"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="/features"
                    className="text-gray-600 hover:text-orange-500 dark:hover:text-orange-400 dark:text-gray-300"
                  >
                    Features
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4 dark:text-gray-100">
                Resources
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="/blog"
                    className="text-gray-600 hover:text-orange-500 dark:hover:text-orange-400 dark:text-gray-300"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="/creator-handbook"
                    className="text-gray-600 hover:text-orange-500 dark:hover:text-orange-400 dark:text-gray-300"
                  >
                    Creator Handbook
                  </a>
                </li>
                <li>
                  <a
                    href="/investor-guide"
                    className="text-gray-600 hover:text-orange-500 dark:hover:text-orange-400 dark:text-gray-300"
                  >
                    Investor Guide
                  </a>
                </li>
                <li>
                  <a
                    href="/partners"
                    className="text-gray-600 hover:text-orange-500 dark:hover:text-orange-400 dark:text-gray-300"
                  >
                    Partners
                  </a>
                </li>
                <li>
                  <a
                    href="/case-studies"
                    className="text-gray-600 hover:text-orange-500 dark:hover:text-orange-400 dark:text-gray-300"
                  >
                    Case Studies
                  </a>
                </li>
                <li>
                  <a
                    href="/webinars"
                    className="text-gray-600 hover:text-orange-500 dark:hover:text-orange-400 dark:text-gray-300"
                  >
                    Webinars
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4 dark:text-gray-100">Company</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="/about-us"
                    className="text-gray-600 hover:text-orange-500 dark:hover:text-orange-400 dark:text-gray-300"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="/careers"
                    className="text-gray-600 hover:text-orange-500 dark:hover:text-orange-400 dark:text-gray-300"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="/team"
                    className="text-gray-600 hover:text-orange-500 dark:hover:text-orange-400 dark:text-gray-300"
                  >
                    Team
                  </a>
                </li>
                <li>
                  <a
                    href="/contactus"
                    className="text-gray-600 hover:text-orange-500 dark:hover:text-orange-400 dark:text-gray-300"
                  >
                    Contact
                  </a>
                </li>
                <li>
                  <a
                    href="/press"
                    className="text-gray-600 hover:text-orange-500 dark:hover:text-orange-400 dark:text-gray-300"
                  >
                    Press
                  </a>
                </li>
                <li>
                  <a
                    href="/newsroom"
                    className="text-gray-600 hover:text-orange-500 dark:hover:text-orange-400 dark:text-gray-300"
                  >
                    Newsroom
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Compliance & Legal Section */}
          <div className="md:col-span-1">
            <h3 className="font-semibold mb-4 dark:text-gray-100">
              Compliance & Legal
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="/sec-regulations"
                  className="text-gray-600 hover:text-orange-500 dark:hover:text-orange-400 dark:text-gray-300"
                >
                  SEC Regulations
                </a>
              </li>
              <li>
                <a
                  href="/investment-compliance"
                  className="text-gray-600 hover:text-orange-500 dark:hover:text-orange-400 dark:text-gray-300"
                >
                  Investment Compliance
                </a>
              </li>
              <li>
                <a
                  href="/venture-funding-laws"
                  className="text-gray-600 hover:text-orange-500 dark:hover:text-orange-400 dark:text-gray-300"
                >
                  Venture Funding Laws
                </a>
              </li>
              <li>
                <a
                  href="/impact-investing-standards"
                  className="text-gray-600 hover:text-orange-500 dark:hover:text-orange-400 dark:text-gray-300"
                >
                  Impact Investing Standards
                </a>
              </li>
              <li>
                <a
                  href="/disclosures"
                  className="text-gray-600 hover:text-orange-500 dark:hover:text-orange-400 dark:text-gray-300"
                >
                  Disclosures
                </a>
              </li>
              <li>
                <a
                  href="/investor-protections"
                  className="text-gray-600 hover:text-orange-500 dark:hover:text-orange-400 dark:text-gray-300"
                >
                  Investor Protections
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 text-sm text-gray-500 flex flex-col md:flex-row justify-between">
          <div className="mb-4 md:mb-0 dark:text-gray-400">
            &copy; {new Date().getFullYear()} BantuHive Ltd. All rights
            reserved.
          </div>
          <div className="flex space-x-6">
            <a
              href="/terms"
              className="hover:text-orange-500 dark:hover:text-orange-400"
            >
              Terms
            </a>
            <a
              href="/privacy"
              className="hover:text-orange-500 dark:hover:text-orange-400"
            >
              Privacy
            </a>
            <a
              href="/cookies"
              className="hover:text-orange-500 dark:hover:text-orange-400"
            >
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
