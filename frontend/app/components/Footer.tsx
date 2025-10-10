'use client';
import React from 'react';
import BantuHiveLogoIcon from './icons/BantuHiveLogoIcon';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  const footerSections = [
    {
      title: 'Product',
      links: [
        { name: 'How it Works', path: '/info/how-it-works' },
        { name: 'Enterprise Support', path: '/info/upgrade' },
        { name: 'FAQ', path: '/info/faqs' },
        { name: 'Trust & Safety', path: '/info/trust-safety' },
        { name: 'Pricing', path: '/info/pricing' },
        { name: 'Features', path: '/info/platform-features' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { name: 'Blog', path: '/info/blog' },
        { name: 'Creator Handbook', path: '/info/creator-handbook' },
        { name: 'Investor Guide', path: '/info/investor-guide' },
        { name: 'Partners', path: '/info/partnerships' },
        { name: 'Case Studies', path: '/info/case-studies' },
        { name: 'Webinars', path: 'https://www.pnpmmedia.com' },
      ],
    },
    {
      title: 'Company',
      links: [
        { name: 'About', path: '/info/about-us' },
        { name: 'Careers', path: '/info/careers' },
        { name: 'Team', path: '/info/team' },
        { name: 'Contact', path: '/info/contactus' },
        { name: 'Press', path: 'https://www.pnpmmedia.com/journal' },
        { name: 'Newsroom', path: 'https://www.pnpmmedia.com/journal' },
      ],
    },
    {
      title: 'Compliance & Legal',
      links: [
        { name: 'SEC Regulations', path: '/info/sec-regulations' },
        { name: 'Investment Compliance', path: '/info/investment-compliance' },
        { name: 'Venture Funding Laws', path: '/info/venture-funding-laws' },
        {
          name: 'Risk Policy & Framework',
          path: '/info/risk-framework-policy',
        },
        {
          name: 'Impact Investing Standards',
          path: '/info/impact-investing-standards',
        },
        { name: 'Disclosures', path: '/info/disclosures' },
        { name: 'Investor Protections', path: '/info/investor-protections' },
      ],
    },
  ];

  return (
    <footer className="relative bg-gray-50 border-t text-gray-900">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-no-repeat bg-contain"
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
            <p className="text-sm text-gray-800 mb-4">
              We're on a mission to democratize access to funding and provide
              all types of investors with exclusive opportunities to invest in
              exciting early-stage and growth-stage African business
              opportunities that were previously inaccessible.
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
              <h3 className="font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2 text-sm">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href={link.path}
                      className="text-gray-800 hover:text-orange-500 dark:hover:text-orange-400"
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
            <h3 className="font-semibold mb-4">{footerSections[3].title}</h3>
            <ul className="space-y-2 text-sm">
              {footerSections[3].links.map((link, linkIndex) => (
                <li key={linkIndex}>
                  <a
                    href={link.path}
                    className="text-gray-800 hover:text-orange-500 dark:hover:text-orange-400"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-gray-200 text-sm flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0 text-gray-400">
            &copy; {new Date().getFullYear()} BantuHive Ltd. All rights
            reserved.
          </div>
          <div className="flex items-center space-x-6">
            <a
              href="/info/terms"
              className="hover:text-orange-500 dark:hover:text-orange-400"
            >
              Terms
            </a>
            <a
              href="/info/privacy"
              className="hover:text-orange-500 dark:hover:text-orange-400"
            >
              Privacy
            </a>
            <a
              href="/info/cookies"
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
