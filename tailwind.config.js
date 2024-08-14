/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'neon-pink': '#FF6EC7',
        'electric-blue': '#00CCFF',
        'neon-purple': '#9D00FF',
        'lime-green': '#CCFF00',
        'hot-magenta': '#FF00FF',
        'bright-cyan': '#00FFFF',
        'bright-orange': '#FF9933',
        'vivid-yellow': '#FFFF33',
        'neon-green': '#39FF14',
        'deep-black': '#0D0D0D',
        'neon-red': '#FF073A',
      },
    },
  },
  variants: {},
  plugins: [],
}
