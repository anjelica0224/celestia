/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: '#080A0B'
      }
    },
    fontFamily: {
      Robota: ['Roboto-VariableFont_wdth,wght.ttf'],
      RobotaThin: ['Roboto-Light.ttf']
    },
    plugins: [],
  }
}