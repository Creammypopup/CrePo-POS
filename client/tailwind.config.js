/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      // เพิ่มชุดสีพาสเทลที่เราจะใช้
      colors: {
        'pastel-purple': '#D9C4EC', // ม่วง
        'pastel-pink': '#F5DCE0',   // ชมพู
        'pastel-yellow': '#FFEFB3', // เหลือง
        'pastel-green': '#C3EEFA',  // เขียวอมฟ้า
        'pastel-blue': '#B9D7EA',   // ฟ้า
        'brand-purple': {
          light: '#A9A9E8',
          DEFAULT: '#9379C2',
          dark: '#6C5B7B',
        },
      },
    },
  },
  plugins: [],
};
