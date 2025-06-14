/** @type {import('tailwindcss').Config} */
import theme from 'tailwindcss/theme' // <-- Import the default theme

const config = {
  darkMode: 'class',
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    ...theme, // <-- This line includes all of Tailwind's default styles
    extend: {
      // Your custom theme extensions can go here
    },
  },
  plugins: [],
};
export default config;