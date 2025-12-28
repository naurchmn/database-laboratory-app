/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
        colors: {
        background: 'rgb(var(--background) / <alpha-value>)',
        'text-black': 'rgb(var(--text-black) / <alpha-value>)',
        'text-white': 'rgb(var(--text-white) / <alpha-value>)',

        // --- Styling Colors ---
        'primary-pink': 'rgb(var(--primary-pink) / <alpha-value>)',
        'primary-dark-blue': 'rgb(var(--primary-dark-blue) / <alpha-value>)',
        'primary-gray': 'rgb(var(--primary-gray) / <alpha-value>)',

        // --- Gradient Component Colors ---
        'grad-purple': 'rgb(var(--grad-purple) / <alpha-value>)',
        'grad-pink': 'rgb(var(--grad-pink) / <alpha-value>)',
        'grad-yellow': 'rgb(var(--grad-yellow) / <alpha-value>)',
        'grad-purple-med': 'rgb(var(--grad-purple-med) / <alpha-value>)',
        'grad-purple-light': 'rgb(var(--grad-purple-light) / <alpha-value>)',
        }
    },
  },
  plugins: [],
}

