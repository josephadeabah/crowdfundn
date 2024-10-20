'use client';
import React from 'react';
import { FaFacebook, FaInstagram } from 'react-icons/fa';
const Footer = () => {
  return (
    <footer className="bg-gray-50 dark:text-gray-50 text-gray-800 mb-0 dark:bg-gray-950">
      <div className="flex flex-col items-center px-6 w-full *:w-full *:flex *:flex-col *:items-center"></div>
      <div className="mx-auto px-4 lg:px-2 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="col-span-1 md:col-span-2">
          <img src="/bantuhive.svg" alt="Bantuhive Logo" className="w-30 h-auto" />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="hover:text-orange-300 transition duration-300"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-orange-300 transition duration-300"
                >
                  Pricing
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-orange-300 transition duration-300"
                >
                  Case Studies
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/team"
                  className="hover:text-orange-300 transition duration-300"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-orange-300 transition duration-300"
                >
                  Careers
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-orange-300 transition duration-300"
                >
                  Partners
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-orange-300 transition duration-300"
                >
                  News
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/helpcenter"
                  className="hover:text-orange-300 transition duration-300"
                >
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-orange-300 transition duration-300"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-orange-300 transition duration-300"
                >
                  FAQs
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-orange-300 transition duration-300"
                >
                  Community
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-400 flex flex-col md:flex-row justify-between items-center">
          <div className="flex space-x-6 mb-4 md:mb-0">
            <a
              href="#"
              className="text-2xl hover:text-orange-300 transition duration-300"
              aria-label="Facebook"
            >
              <FaFacebook />
            </a>
            <a
              href="#"
              className="text-2xl hover:text-orange-300 transition duration-300"
              aria-label="Twitter"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 256 256"
                className="fill-gray-600 dark:fill-white hover:text-orange-300 transition duration-300"
              >
                <path d="M216 20H40a20 20 0 0 0-20 20v176a20 20 0 0 0 20 20h176a20 20 0 0 0 20-20V40a20 20 0 0 0-20-20Zm-4 192H44V44h168Zm-100-36v-56a12 12 0 0 1 21.43-7.41A40 40 0 0 1 192 148v28a12 12 0 0 1-24 0v-28a16 16 0 0 0-32 0v28a12 12 0 0 1-24 0Zm-16-56v56a12 12 0 0 1-24 0v-56a12 12 0 0 1 24 0ZM68 80a16 16 0 1 1 16 16 16 16 0 0 1-16-16Z" />
              </svg>
            </a>
            <a
              href="#"
              className="text-2xl hover:text-orange-300 transition duration-300"
              aria-label="Instagram"
            >
              <FaInstagram />
            </a>
            <a
              href="#"
              className="text-2xl hover:text-orange-300 transition duration-300"
              aria-label="LinkedIn"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 256 256"
                className="fill-gray-600 dark:fill-white hover:text-orange-300 transition duration-300"
              >
                <path d="m218.12 209.56-61-95.8 59.72-65.69a12 12 0 0 0-17.76-16.14l-55.27 60.84-37.69-59.21A12 12 0 0 0 96 28H48a12 12 0 0 0-10.12 18.44l61 95.8-59.76 65.69a12 12 0 1 0 17.76 16.14l55.31-60.84 37.69 59.21A12 12 0 0 0 160 228h48a12 12 0 0 0 10.12-18.44ZM166.59 204 69.86 52h19.55l96.73 152Z" />
              </svg>
            </a>
          </div>

          {/* Links for Cookies, Privacy, and Terms */}
          <div className="flex space-x-4 mb-4 md:mb-0">
            <a
              href="/cookies"
              className="text-sm hover:text-orange-300 transition duration-300"
            >
              Cookies
            </a>
            <a
              href="/privacy"
              className="text-sm hover:text-orange-300 transition duration-300"
            >
              Privacy
            </a>
            <a
              href="/terms"
              className="text-sm hover:text-orange-300 transition duration-300"
            >
              Terms
            </a>
          </div>

          <p className="text-sm">&copy; 2024 BantuHive. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
