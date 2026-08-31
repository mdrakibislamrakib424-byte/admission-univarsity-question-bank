/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#0B0F17',
          900: '#0E1420',
          800: '#171E2E',
          700: '#232C41',
          600: '#3A4560',
          500: '#5C6889',
          400: '#9AA3B5',
          200: '#D8DBE3',
          100: '#EDEFF5'
        },
        paper: '#F5F4EF',
        amber: {
          DEFAULT: '#E8A33D',
          dark: '#C4832A',
          light: '#F5C97C'
        },
        leaf: {
          DEFAULT: '#2FA36B',
          dark: '#1F7A4D'
        },
        brick: {
          DEFAULT: '#E15252',
          dark: '#B93E3E'
        }
      },
      fontFamily: {
        display: ['"Tiro Bangla"', 'serif'],
        sans: ['"Hind Siliguri"', '"Inter"', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
}
