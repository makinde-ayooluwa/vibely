/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,jsx,ts,tsx}",
    "./src/app/(tabs)/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
    "./src/layouts/**/*.{js,jsx,ts,tsx}",
  ],

  presets: [require("nativewind/preset")],

  theme: {
    extend: {
      fontFamily: {
        montserrat: ["Montserrat_400Regular"],
        "montserrat-medium": ["Montserrat_500Medium"],
        "montserrat-semibold": ["Montserrat_600SemiBold"],
        "montserrat-bold": ["Montserrat_700Bold"],
        "montserrat-extrabold": ["Montserrat_800ExtraBold"],
      },
    },
  },

  plugins: [],
};