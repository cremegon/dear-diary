/** @type {import('tailwindcss').Config} */
const tailwindConfig = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        Radley: ["Radley", "sans-serif"],
        STIXTwoText: ["STIX Two Text", "serif"],
        Enriqueta: ["Enriqueta", "sans-serif"],
        Inter: ["Inter", "sans-serif"],
        MerriweatherSans: ["Merriweather Sans", "sans-serif"],
        PoiretOne: ["Poiret One", "sans-serif"],
        Gabarito: ["Gabarito", "sans-serif"],
        SourGummy: ["Sour Gummy", "sans-serif"],
        Yellowtail: ["Yellowtail", "sans-serif"],
        Chewy: ["Chewy", "sans-serif"],
        HomemadeApple: ["Homemade Apple", "sans-serif"],
        UnifrakturCook: ["UnifrakturCook", "sans-serif"],
        Lugrasimo: ["Lugrasimo", "sans-serif"],
        Smokum: ["Smokum", "sans-serif"],
        FreckleFace: ["Freckle Face", "sans-serif"],
        Geo: ["Geo", "sans-serif"],
        Silkscreen: ["Silkscreen", "sans-serif"],
        SpecialElite: ["Special Elite", "sans-serif"],
        Lacquer: ["Lacquer", "sans-serif"],
        MaidenOrange: ["Maiden Orange", "sans-serif"],
        Fascinate: ["Fascinate", "sans-serif"],
        Barrio: ["Barrio", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default tailwindConfig;
