/** @type {import('tailwindcss').Config} */
export default {
  content: ['./components/**/*.{js,ts,jsx,tsx}', './app/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        roboto: 'var(--font-roboto)',
        ubuntu: 'var(--font-ubuntu)',
      },
      boxShadow: {
        'text': '2px 2px 4px rgba(0, 0, 0, 0.1)', // Custom text shadow
      }
    },
  },
  plugins: [],
};
