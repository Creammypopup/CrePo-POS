/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'pastel-purple': {
          light: '#E9D5FF', // bg-purple-200
          DEFAULT: '#C084FC', // bg-purple-400
          dark: '#9333EA',  // bg-purple-600
        },
        'pastel-sky': {
          light: '#BAE6FD',
          DEFAULT: '#38BDF8',
          dark: '#0284C7',
        },
        'pastel-mint': {
          light: '#A7F3D0',
          DEFAULT: '#34D399',
          dark: '#059669',
        },
        'pastel-peach': {
          light: '#FED7AA',
          DEFAULT: '#FB923C',
          dark: '#EA580C',
        },
        'pastel-yellow': {
          light: '#FDE68A',
          DEFAULT: '#FACC15',
          dark: '#CA8A04',
        },
        'pastel-pink': {
          light: '#FBCFE8',
          DEFAULT: '#F472B6',
          dark: '#DB2777',
        },
        'pastel-gray': {
          light: '#F3F4F6', // gray-100
          DEFAULT: '#D1D5DB', // gray-300
          dark: '#6B7280',   // gray-500
        },
      }
    },
  },
  plugins: [],
}
