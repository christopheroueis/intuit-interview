
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        intuit: {
          blue: '#0077C5',
          navy: '#1B3A6B',
          coral: '#E5461B',
          amber: '#F4A01C',
          green: '#2ECC71',
          light: '#F4F4F4'
        }
      }
    },
  },
  plugins: [],
}

