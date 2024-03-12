module.exports = {
  mode: "jit",
  content: ["./src/**/**/*.{js,ts,jsx,tsx,html,mdx}", "./src/**/*.{js,ts,jsx,tsx,html,mdx}"],
  darkMode: "class",
  theme: {
    screens: { md: { max: "1050px" }, sm: { max: "550px" } },
    extend: {
      colors: {
        gray: { 100: "#f4f6f9", 400: "#b1b1b1", 900: "#232323", "100_03": "#f3f3f5" },
        indigo: { 200: "#8ba3cb", 300: "#718ebf", A700_02: "#1814f3", "50_02": "#e6eff5", "50_01": "#e5eef4" },
        blue_gray: { 50: "#edf1f7", 800: "#343c6a" },
        white: { A700: "#ffffff", A700_b2: "#ffffffb2" },
        pink: { 50: "#ffe0eb", A100: "#ff82ac" },
        teal: { 50: "#deeaf2", 300: "#41d4a8", A400_01: "#16dbcc", "50_01": "#dfeaf2" },
        cyan: { 50: "#dcfaf8" },
        blue: { 50: "#e7edff", A700: "#2d60ff" },
        red: { A200: "#ff4b4a" },
        orange: { 50: "#fff5d9" },
      },
      boxShadow: { xs: "4px 4px  18px -2px #e6e3e7cc", sm: "0px 2px  5px 0px #00000019" },
      fontFamily: { inter: "Inter", mont: "Mont", lato: "Lato" },
      backgroundImage: {
        gradient: "linear-gradient(180deg, #ffffff26,#ffffff26)",
        gradient1: "linear-gradient(135deg, #4c49ed,#0a06f4)",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};