/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'deep-blue': '#0b1220',
        'accent-blue': '#2E5BB8',
        'accent-cyan': '#5DE0FF',
        'accent-purple': '#7C4DFF',
      },
      boxShadow: {
        'neon-sm': '0 0 10px rgba(93,224,255,0.4)',
        'neon-md': '0 0 20px rgba(46,91,184,0.4)',
        'neon-lg': '0 0 30px rgba(124,77,255,0.4)',
      },
      backgroundImage: {
        'neuron-grid': "radial-gradient(circle at 1px 1px, rgba(93,224,255,0.2) 1px, transparent 0)",
      },
      backgroundSize: {
        'neuron-grid': '40px 40px',
      },
    },
  },
  plugins: [],
}
