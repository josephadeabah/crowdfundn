'use client';
import React from 'react';
import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';
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
              To provide an accessible, transparent, and engaging platform for
              funding initiatives that drive positive change across Africa.
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
              <h3 className="font-semibold mb-4 dark:text-gray-100">
                Learn More
              </h3>
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
                    href="#"
                    className="text-gray-600 hover:text-orange-500 dark:hover:text-orange-400 dark:text-gray-300"
                  >
                    Success Stories
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
                    href="#"
                    className="text-gray-600 hover:text-orange-500 dark:hover:text-orange-400 dark:text-gray-300"
                  >
                    Creator Handbook
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-orange-500 dark:hover:text-orange-400 dark:text-gray-300"
                  >
                    Hives
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
                    href="/press"
                    className="text-gray-600 hover:text-orange-500 dark:hover:text-orange-400 dark:text-gray-300"
                  >
                    Press
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
              </ul>
            </div>
          </div>

          {/* Newsletter */}
          <div className="md:col-span-1">
            <h3 className="font-semibold mb-4 dark:text-gray-100">
              Stay Updated
            </h3>
            <p className="text-sm text-gray-600 mb-4 dark:text-gray-300">
              Subscribe to our newsletter for the latest projects and updates.
            </p>
            <div className="flex space-x-2">
              <Input
                type="email"
                placeholder="Your email"
                className="max-w-[220px] dark:bg-gray-900 dark:border-gray-700"
              />
              <Button className="bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700">
                Subscribe
              </Button>
            </div>
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
