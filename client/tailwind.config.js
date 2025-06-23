
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
   theme: {
    extend: {
      animation: {
        'pulse-fast': 'pulse 0.8s linear infinite',
      },
    },
  },
  plugins: [],
};