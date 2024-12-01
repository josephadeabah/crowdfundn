'use client';
import React from 'react';
import { FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-50 dark:text-gray-50 text-gray-800 mb-0 dark:bg-gray-950">
      <div className="mx-auto px-3 md:px-0 py-12 max-w-screen-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="col-span-1 md:col-span-2">
            <img
              src="/bantuhive.svg"
              alt="Bantuhive Logo"
              className="w-30 h-auto mb-4"
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
            {['How It Works', 'Pricing', 'Case Studies'].map((item) => (
              <li key={item}>
                <a
                  href={`/${item.toLowerCase().replace(/\s+/g, '-')}`} // Regular expression to handle multiple spaces
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
              {['About Us', 'Careers', 'Partners', 'News'].map((item) => (
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
              {['Help Center', 'Contact Us', 'FAQs', 'Community'].map(
                (item) => (
                  <li key={item}>
                    <a
                      href={`/${item.toLowerCase().replace(' ', '-')}`}
                      className="hover:text-orange-300 transition duration-300"
                    >
                      {item}
                    </a>
                  </li>
                ),
              )}
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
            <a
              href="#"
              className="text-2xl hover:text-orange-300 transition duration-300"
              aria-label="Twitter"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 256 256"
                className="fill-gray-600 dark:fill-white"
              >
                <path d="m218.12 209.56-61-95.8 59.72-65.69a12 12 0 0 0-17.76-16.14l-55.27 60.84-37.69-59.21A12 12 0 0 0 96 28H48a12 12 0 0 0-10.12 18.44l61 95.8-59.76 65.69a12 12 0 1 0 17.76 16.14l55.31-60.84 37.69 59.21A12 12 0 0 0 160 228h48a12 12 0 0 0 10.12-18.44ZM166.59 204 69.86 52h19.55l96.73 152Z" />
              </svg>
            </a>
          </div>

          {/* Links for Cookies, Privacy, and Terms */}
          <div className="flex space-x-4 mb-4 md:mb-0">
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

          <p className="text-sm text-center md:text-right">
            &copy; {new Date().getFullYear()} BantuHive Ltd. All rights
            reserved.
          </p>
          {/* Company Registration Number */}
          <p className="text-sm text-center md:text-right mt-2">
            Company Registration Number: <strong>CS185241124</strong>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
