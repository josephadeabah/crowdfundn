const Footer = () => {
  return (
    <footer className="bg-white mb-0 dark:bg-gray-950">
      <div className="flex flex-col items-center px-6 w-full *:w-full *:flex *:flex-col *:items-center">
        <div className="gap-6 py-12 border-b border-solid border-b-gray-200 dark:border-b-gray-800 lg:flex-row *:flex *:items-center">
          <div className="lg:w-full">
            <a href=".">
              <svg fill="none" viewBox="0 0 28 28" height="28" width="28">
                <path
                  className="fill-red-600"
                  d="M2.333 0A2.333 2.333 0 0 0 0 2.333V14c0 7.732 6.268 14 14 14 1.059 0 2.09-.117 3.082-.34.965-.217 1.585-1.118 1.585-2.107v-2.22a4.667 4.667 0 0 1 4.666-4.666h2.334A2.333 2.333 0 0 0 28 16.333v-14A2.333 2.333 0 0 0 25.667 0H21a2.333 2.333 0 0 0-2.333 2.333V14a4.667 4.667 0 0 1-9.334 0V2.333A2.333 2.333 0 0 0 7 0H2.333Z"
                />
              </svg>
            </a>
          </div>
          <div className="flex-col gap-2 lg:flex-row *:flex *:items-center *:gap-x-1.5 *:px-2 *:py-1.5 *:text-sm *:text-gray-950 dark:*:text-gray-50 *:font-medium">
            <a href=".">
              Features
              <div className="bg-red-50 dark:bg-red-900 flex px-1.5 py-0.5 rounded-full text-xs text-red-600 dark:text-white font-medium">
                NEW
              </div>
            </a>
            <a href=".">Pricing</a>
            <a href=".">Contact</a>
          </div>
          <div className="gap-x-1 lg:w-full lg:justify-end lg:gap-x-6 *:p-2 lg:*:px-0">
            <a href=".">
              <svg
                width="16"
                height="16"
                viewBox="0 0 256 256"
                className="fill-gray-950 dark:fill-white"
              >
                <path d="M128 80a48 48 0 1 0 48 48 48.05 48.05 0 0 0-48-48Zm0 72a24 24 0 1 1 24-24 24 24 0 0 1-24 24Zm48-132H80a60.07 60.07 0 0 0-60 60v96a60.07 60.07 0 0 0 60 60h96a60.07 60.07 0 0 0 60-60V80a60.07 60.07 0 0 0-60-60Zm36 156a36 36 0 0 1-36 36H80a36 36 0 0 1-36-36V80a36 36 0 0 1 36-36h96a36 36 0 0 1 36 36ZM196 76a16 16 0 1 1-16-16 16 16 0 0 1 16 16Z" />
              </svg>
            </a>
            <a href=".">
              <svg
                width="16"
                height="16"
                viewBox="0 0 256 256"
                className="fill-gray-950 dark:fill-white"
              >
                <path d="m218.12 209.56-61-95.8 59.72-65.69a12 12 0 0 0-17.76-16.14l-55.27 60.84-37.69-59.21A12 12 0 0 0 96 28H48a12 12 0 0 0-10.12 18.44l61 95.8-59.76 65.69a12 12 0 1 0 17.76 16.14l55.31-60.84 37.69 59.21A12 12 0 0 0 160 228h48a12 12 0 0 0 10.12-18.44ZM166.59 204 69.86 52h19.55l96.73 152Z" />
              </svg>
            </a>
            <a href=".">
              <svg
                width="16"
                height="16"
                viewBox="0 0 256 256"
                className="fill-gray-950 dark:fill-white"
              >
                <path d="M216 20H40a20 20 0 0 0-20 20v176a20 20 0 0 0 20 20h176a20 20 0 0 0 20-20V40a20 20 0 0 0-20-20Zm-4 192H44V44h168Zm-100-36v-56a12 12 0 0 1 21.43-7.41A40 40 0 0 1 192 148v28a12 12 0 0 1-24 0v-28a16 16 0 0 0-32 0v28a12 12 0 0 1-24 0Zm-16-56v56a12 12 0 0 1-24 0v-56a12 12 0 0 1 24 0ZM68 80a16 16 0 1 1 16 16 16 16 0 0 1-16-16Z" />
              </svg>
            </a>
          </div>
        </div>
        <div className="gap-y-6 py-8 lg:flex-row lg:justify-between *:text-sm *:text-gray-500">
          <p>&copy; BantuHive</p>
          <div className="flex items-center gap-x-6 hover:*:text-gray-950 dark:hover:*:text-gray-50 *:transition *:duration-[250ms] *:ease-in-out">
            <a href=".">Privacy</a>
            <a href=".">Terms</a>
            <a href=".">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
