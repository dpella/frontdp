/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        gilroyReg: ['GilroyReg', "sans-serif"],
        gilroyMed: ['GilroyMed', "sans-sherif"]
      }
    },
  },
  plugins: [],
}

