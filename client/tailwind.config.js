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
        'pastel-green': {
          light: '#D1FAE5', // bg-green-200
          DEFAULT: '#6EE7B7', // bg-green-300
          dark: '#059669',   // bg-green-700
        },
        'pastel-yellow': {
          light: '#FEF3C7', // bg-amber-200
          DEFAULT: '#FCD34D', // bg-amber-300
          dark: '#B45309',   // bg-amber-700
        },
        'pastel-pink': {
          light: '#FCE7F3', // bg-pink-100
          DEFAULT: '#F9A8D4', // bg-pink-300
          dark: '#BE185D',   // bg-pink-700
        },
        'pastel-blue': {
          light: '#DBEAFE', // bg-blue-200
          DEFAULT: '#93C5FD', // bg-blue-300
          dark: '#2563EB',   // bg-blue-600
        },
        'pastel-peach': {
          light: '#FFEDD5', // bg-orange-200
          DEFAULT: '#FDBA74', // bg-orange-300
          dark: '#C2410C',   // bg-orange-700
        }
      }
    },
  },
  plugins: [],
}