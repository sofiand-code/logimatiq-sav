/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#EFF5FB',
          100: '#D9E7F4',
          500: '#1E6CB8',
          600: '#0F4C81',
          700: '#0B3A63',
          900: '#062242',
        },
        accent: {
          500: '#F59E0B',
          600: '#D97706',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    }
  },
  plugins: [],
};
