/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      maxHeight: {
        'sidebar': '600px', // Now you can use max-h-sidebar
        'viewer': '800px',  // Now you can use max-h-viewer
      }
    },
  },
  plugins: [],
}