module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/app/*.{js,ts,jsx,tsx, css}",
  ],
  theme: {
    extend: {
      colors: {
        pastelDark: {
          bg: '#2b2b2b',
          input: '#3b3b3b',
          button: '#444444',
          text: '#d3d3d3',
        },
      },
    },
  },
  plugins: [],
}
