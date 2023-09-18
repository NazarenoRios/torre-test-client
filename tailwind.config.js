/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'custom-yellow': '#cddc39',
      },
    },
  },
  plugins: [require('daisyui')],
};
