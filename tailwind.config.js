/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        'primary-bg': '#FBF9F6',
        'primary-text': '#5C5470',
        'accent-peach': '#F3AB9A',
        'accent-lavender': '#B9B2D8',
        'accent-green': '#A4BFA0',
      },
      fontFamily: {
        lora: ['Lora', 'serif'],
        lexend: ['Lexend', 'sans-serif'],
      },
    },
  },
  plugins: [],
};