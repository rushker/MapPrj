export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
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
