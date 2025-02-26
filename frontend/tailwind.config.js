// import withMT from '@material-tailwind/react/utils/withMT';

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
    },
  },
  plugins: [],
};
