/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  corePlugins: {
    // Disable oklch color space to use RGB instead for html2canvas compatibility
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
}
