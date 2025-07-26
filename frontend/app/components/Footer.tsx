'use client';
import React from 'react';
import BantuHiveLogoIcon from './icons/BantuHiveLogoIcon';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  const footerSections = [
    {
      title: 'Product',
      links: [
        { name: 'How it Works', path: '/how-it-works' },
        { name: 'Enterprise Support', path: '/enterprise-support' },
        { name: 'FAQ', path: '/faqs' },
        { name: 'Trust & Safety', path: '/trust-safety' },
        { name: 'Pricing', path: '/pricing' },
        { name: 'Features', path: '/platform-features' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { name: 'Blog', path: '/blog' },
        { name: 'Creator Handbook', path: '/creator-handbook' },
        { name: 'Investor Guide', path: '/investor-guide' },
        { name: 'Partners', path: '/partnerships' },
        { name: 'Case Studies', path: '/case-studies' },
        { name: 'Webinars', path: '/webinars' },
      ],
    },
    {
      title: 'Company',
      links: [
        { name: 'About', path: '/about-us' },
        { name: 'Careers', path: '/careers' },
        { name: 'Team', path: '/team' },
        { name: 'Contact', path: '/contactus' },
        { name: 'Press', path: '/press' },
        { name: 'Newsroom', path: '/newsroom' },
      ],
    },
    {
      title: 'Compliance & Legal',
      links: [
        { name: 'SEC Regulations', path: '/sec-regulations' },
        { name: 'Investment Compliance', path: '/investment-compliance' },
        { name: 'Venture Funding Laws', path: '/venture-funding-laws' },
        {
          name: 'Impact Investing Standards',
          path: '/impact-investing-standards',
        },
        { name: 'Disclosures', path: '/disclosures' },
        { name: 'Investor Protections', path: '/investor-protections' },
      ],
    },
  ];

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
        <div className="grid grid-cols-1 md:grid-cols-7 gap-8">
          {/* Logo and Mission - spans 2 columns on md+ screens */}
          <div className="md:col-span-2">
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

          {/* First three sections (Product, Resources, Company) - each spans 1 column */}
          {footerSections.slice(0, 3).map((section, index) => (
            <div key={index} className="md:col-span-1">
              <h3 className="font-semibold mb-4 dark:text-gray-100">
                {section.title}
              </h3>
              <ul className="space-y-2 text-sm">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href={link.path}
                      className="text-gray-600 hover:text-orange-500 dark:hover:text-orange-400 dark:text-gray-300"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Compliance & Legal section - spans 2 columns */}
          <div className="md:col-span-2">
            <h3 className="font-semibold mb-4 dark:text-gray-100">
              {footerSections[3].title}
            </h3>
            <ul className="space-y-2 text-sm">
              {footerSections[3].links.map((link, linkIndex) => (
                <li key={linkIndex}>
                  <a
                    href={link.path}
                    className="text-gray-600 hover:text-orange-500 dark:hover:text-orange-400 dark:text-gray-300"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
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
