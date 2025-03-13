/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'student': '#F39C12',
        'teacher': '#4CAF50',
      }
    },
  },
  plugins: [],
}

