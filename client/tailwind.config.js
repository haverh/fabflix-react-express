/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      screens: {
        'sm': '650px',
        'md': '968px',
        'lg': '1320px',
        'xl': '1613px'
      }
      
    },
  },
  plugins: [],
}

