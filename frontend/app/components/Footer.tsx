'use client';
import React, { useState } from 'react';
import { FaFacebook, FaInstagram } from 'react-icons/fa';
const Footer = () => {
  const [email, setEmail] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(true);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputEmail = e.target.value;
    setEmail(inputEmail);
    setIsValidEmail(validateEmail(inputEmail));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isValidEmail && email) {
      console.log('Subscribed with email:', email);
      setEmail('');
    }
  };

  return (
    <footer className="bg-white mb-0 dark:bg-gray-950">
      <div className="flex flex-col items-center px-6 w-full *:w-full *:flex *:flex-col *:items-center"></div>
      <div className="mx-auto px-4 lg:px-2 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="col-span-1 md:col-span-2">
            <svg
              fill="none"
              viewBox="0 0 512 512"
              height="56"
              width="56"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g
                transform="translate(0.000000,512.000000) scale(0.125,-0.125)"
                fill="#C7253E"
                stroke="none"
              >
                <path d="M1671 3681 c62 -147 60 -113 56 -1114 -2 -501 -7 -930 -11 -952 l-7 -40 19 35 c24 43 48 141 61 240 20 156 33 632 28 1035 -5 429 -7 451 -56 620 -29 98 -28 133 5 145 28 11 232 12 279 1 25 -6 41 0 92 34 35 22 61 45 59 50 -1 6 -106 11 -278 13 l-276 2 29 -69z" />
                <path d="M1148 3702 c16 -24 80 -62 106 -62 8 0 19 -6 23 -13 17 -27 75 -58 164 -87 52 -17 100 -38 107 -47 19 -27 14 -6 -13 47 -63 124 -133 167 -294 178 l-108 7 15 -23z" />
                <path d="M2963 3696 c-99 -46 -182 -141 -257 -292 -89 -182 -366 -838 -366 -869 0 -13 26 -15 158 -14 86 1 148 3 137 6 -73 15 -68 9 -61 66 12 84 95 324 194 557 99 235 216 382 339 429 119 45 213 37 293 -27 l45 -36 -30 33 c-44 49 -149 121 -213 147 -79 32 -169 32 -239 0z" />
                <path d="M2360 3633 c0 -49 -8 -75 -21 -67 -5 3 -9 15 -9 28 0 12 -2 25 -5 28 -6 6 -116 -31 -160 -54 -83 -45 -135 -137 -135 -243 0 -78 11 -125 95 -400 53 -176 75 -231 75 -195 0 8 23 71 50 139 27 69 47 127 45 130 -3 2 -5 -1 -5 -8 0 -9 -3 -9 -13 1 -19 19 -28 47 -33 103 -3 28 -7 56 -10 63 -2 8 5 44 16 81 15 49 33 80 66 116 67 75 79 100 77 175 -1 36 -8 83 -17 105 l-15 40 -1 -42z" />
                <path d="M3307 3415 c-75 -26 -123 -95 -197 -280 -24 -60 -79 -195 -122 -299 -43 -105 -78 -193 -78 -196 0 -4 35 -5 78 -2 70 4 139 -4 197 -23 14 -5 16 -4 7 3 -20 14 -12 116 14 187 12 33 30 83 41 110 10 28 20 52 23 55 11 11 45 84 43 92 -2 4 1 8 6 8 5 0 13 10 17 22 8 28 79 97 111 109 37 14 75 11 96 -8 20-18 20-18 2 17 -10 19 -25 46 -35 60 -9 14 -15 30 -13 37 2 7 -6 25 -18 42 -12 16 -19 36 -16 44 4 11 -6 18 -38 26 -55 14 -71 13 -118 -4z" />
                <path d="M3727 3183 c5 -58 2 -77 -11 -98 -16 -24 -15 -25 2 -25 10 0 26 6 37 13 22 17 17 72 -13 138 l-21 44 6 -72z" />
                <path d="M2098 2402 c-49 -76 -131 -250 -170 -359 -29 -84 -31 -98 -37 -293 -6 -195 -8 -207 -33 -255 -25 -49 -67 -94 -118 -129 -24 -17 -23 -17 55 -11 65 5 83 11 98 28 9 12 31 39 48 60 16 20 36 37 43 37 11 0 10 10 -1 53 -17 61 -11 141 17 248 10 40 17 76 14 80 -2 4 2 10 8 12 8 4 9 6 2 6 -21 2 4 99 117 454 15 48 16 63 6 92 l-12 34 -37 -57z" />
                <path d="M2341 2219 c-11 -24 -59 -152 -107 -284 -80 -220 -88 -246 -88 -315 -1 -119 43 -175 153 -192 31 -5 62 -10 68 -10 7 -1 21 -11 30 -22 l18 -21 -25 20 -25 20 16 -20 c10 -11 19 -29 22 -40 4 -16 5 -17 6 -2 0 9 8 17 16 17 18 0 19 -3 -2 67 -22 73 -21 245 1 281 4 6 5 16 1 22 -3 5 -2 17 3 27 46 93 57 111 66 106 5 -4 7 3 4 15 -4 12 -2 20 3 16 5 -3 9 0 9 6 0 14 47 78 75 103 63 56 223 95 406 99 72 2 92 -2 123 -20 l37 -22 -12 22 c-26 48 -92 107 -152 134 l-62 28 -283 4 -282 4 -19 -43z" />
                <path d="M3346 2151 c14 -35 30 -98 36 -141 32 -216 -95 -450 -294 -545 -41 -19 -94 -39 -119 -44 -35 -7 -38 -9 -14 -10 80 -2 241 79 330 166 98 96 155 260 135 388 -12 76 -53 190 -80 225 -17 21 -16 15 6 -39z" />
                <path d="M3693 1910 c-1 -176 -55 -315 -174 -443 -89 -97 -172 -159 -284 -213 -131 -64 -224 -85 -380 -87 -159 -2 -175 4 -175 68 l0 45 -73 0 c-44 0 -78 5 -87 13 -7 6 -1 -4 13 -24 15 -20 51 -48 79 -64 29 -16 71 -40 93 -55 59 -39 104 -58 197 -82 95 -25 252 -29 340 -8 61 15 172 62 182 79 4 6 15 11 24 11 9 0 35 16 57 36 22 20 62 55 88 77 27 23 58 58 70 77 11 19 33 50 49 68 15 18 28 37 28 42 0 6 12 34 26 63 22 45 25 66 25 147 1 114 -10 159 -60 265 l-37 80 -1 -95z" />
                <path d="M2400 1263 c0 -44 -4 -55 -26 -72 -26 -21 -36 -21 -493 -21 l-466 0 45 -25 c207 -116 224 -119 595 -109 154 3 287 8 295 10 8 1 32 3 52 3 24 1 47 10 65 25 l28 24 -24 54 c-13 29 -34 78 -47 108 l-24 55 0 -52z" />
              </g>
            </svg>
            <p className="text-lg font-semibold mb-4">
              Causing Change and Transforming Lives
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="text-xl font-bold">Subscribe to our newsletter</h3>
              <p className="text-sm">
                Stay updated with our latest news and offers!
              </p>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <input
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="Enter your email"
                  aria-label="Email for newsletter"
                  className={`flex-grow px-4 py-2 rounded-md border focus:outline-none text-gray-900 dark:bg-gray-700 dark:text-white ${!isValidEmail && email ? 'border-red-500' : 'border-gray-300'}`}
                />
                <button
                  type="submit"
                  className="bg-red-600 text-white dark:text-gray-50 px-6 py-2 rounded-md hover:bg-red-300 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                  disabled={!isValidEmail || !email}
                >
                  Subscribe
                </button>
              </div>
              {!isValidEmail && email && (
                <p className="text-red-300 text-sm">
                  Please enter a valid email address.
                </p>
              )}
            </form>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="hover:text-red-300 transition duration-300"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-red-300 transition duration-300"
                >
                  Pricing
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-red-300 transition duration-300"
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
                  className="hover:text-red-300 transition duration-300"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-red-300 transition duration-300"
                >
                  Careers
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-red-300 transition duration-300"
                >
                  Partners
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-red-300 transition duration-300"
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
                  href="#"
                  className="hover:text-red-300 transition duration-300"
                >
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-red-300 transition duration-300"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-red-300 transition duration-300"
                >
                  FAQs
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-red-300 transition duration-300"
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
              className="text-2xl hover:text-red-300 transition duration-300"
              aria-label="Facebook"
            >
              <FaFacebook />
            </a>
            <a
              href="#"
              className="text-2xl hover:text-red-300 transition duration-300"
              aria-label="Twitter"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 256 256"
                className="fill-gray-950 dark:fill-white"
              >
                <path d="M216 20H40a20 20 0 0 0-20 20v176a20 20 0 0 0 20 20h176a20 20 0 0 0 20-20V40a20 20 0 0 0-20-20Zm-4 192H44V44h168Zm-100-36v-56a12 12 0 0 1 21.43-7.41A40 40 0 0 1 192 148v28a12 12 0 0 1-24 0v-28a16 16 0 0 0-32 0v28a12 12 0 0 1-24 0Zm-16-56v56a12 12 0 0 1-24 0v-56a12 12 0 0 1 24 0ZM68 80a16 16 0 1 1 16 16 16 16 0 0 1-16-16Z" />
              </svg>
            </a>
            <a
              href="#"
              className="text-2xl hover:text-red-300 transition duration-300"
              aria-label="Instagram"
            >
              <FaInstagram />
            </a>
            <a
              href="#"
              className="text-2xl hover:text-red-300 transition duration-300"
              aria-label="LinkedIn"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 256 256"
                className="fill-gray-950 dark:fill-white"
              >
                <path d="m218.12 209.56-61-95.8 59.72-65.69a12 12 0 0 0-17.76-16.14l-55.27 60.84-37.69-59.21A12 12 0 0 0 96 28H48a12 12 0 0 0-10.12 18.44l61 95.8-59.76 65.69a12 12 0 1 0 17.76 16.14l55.31-60.84 37.69 59.21A12 12 0 0 0 160 228h48a12 12 0 0 0 10.12-18.44ZM166.59 204 69.86 52h19.55l96.73 152Z" />
              </svg>
            </a>
          </div>

          {/* Links for Cookies, Privacy, and Terms */}
          <div className="flex space-x-4 mb-4 md:mb-0">
            <a
              href="/cookies"
              className="text-sm hover:text-red-300 transition duration-300"
            >
              Cookies
            </a>
            <a
              href="/privacy"
              className="text-sm hover:text-red-300 transition duration-300"
            >
              Privacy
            </a>
            <a
              href="/terms"
              className="text-sm hover:text-red-300 transition duration-300"
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
