/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './components/**/*.{js,ts,jsx,tsx}',
    'node_modules/preline/dist/*.js',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        roboto: 'var(--font-roboto)',
        ubuntu: 'var(--font-ubuntu)',
      },
    },
  },
  plugins: [require('preline/plugin')],
};
