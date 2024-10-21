/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        darkcerulean: "#22577A",
        lightseagreen: "#38A3A5",
        jetstream: "#BDD5D6",
        celadon: "#B2E5A8",
        navy: "#000080",
        fuzzywuzzy: "#C86967",
        mediumseagreen: "#3AA074",
        bordergray: "#B0B0B0",
      },
      boxShadow: {
        "custom-1":
          "0px 2px 1px rgba(0, 0, 0, 0.09), 0px 4px 2px rgba(0, 0, 0, 0.09), 0px 8px 4px rgba(0, 0, 0, 0.09), 0px 16px 8px rgba(0, 0, 0, 0.09), 0px 32px 16px rgba(0, 0, 0, 0.09)",
        "custom-2":
          "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px",
      },
    },
  },
  plugins: [],
};
