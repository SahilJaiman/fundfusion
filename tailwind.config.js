/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  corePlugins: {
    preflight: true,
  },
  content: [
    "./app/**/*.{js,ts,jsx,tsx,json}",
    "./pages/**/*.{js,ts,jsx,tsx,json}",
    "./components/**/*.{js,ts,jsx,tsx,json}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx.json}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'),

  ],
}