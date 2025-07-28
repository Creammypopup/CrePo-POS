    /** @type {import('tailwindcss').Config} */
    export default {
      content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
      theme: {
        extend: {
          colors: {
            'brand-purple': '#A076F9',
            'brand-purple-light': '#D9ACF5',
            'brand-pink': '#FFABE1',
            'brand-pink-light': '#FFF5E4',
            'brand-bg': '#F6F5F2', // สีพื้นหลังสะอาดๆ ที่ไม่ใช่สีขาว
            'brand-text': '#434242',
            'brand-text-light': '#777676',
            'brand-success': '#B7E5B4',
            'brand-warning': '#FFD384',
            'brand-danger': '#FF9494',
            'brand-info': '#A6D0DD',
          },
          boxShadow: {
            '3d': '4px 4px 10px #d1d1d1, -4px -4px 10px #ffffff',
            '3d-inset': 'inset 4px 4px 10px #d1d1d1, inset -4px -4px 10px #ffffff',
            '3d-purple': '6px 6px 12px #c5b2e3, -6px -6px 12px #f3e8ff',
            '3d-purple-inset': 'inset 6px 6px 12px #c5b2e3, inset -6px -6px 12px #f3e8ff',
          }
        },
      },
      plugins: [
        require('@tailwindcss/forms'),
      ],
    };
    