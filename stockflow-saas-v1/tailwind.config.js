/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html','./src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: { brand: { 600:'#0f766e',700:'#115e59',800:'#0b4d47' } },
      boxShadow:{ soft:'0 1px 2px rgb(16 24 40 / 6%), 0 1px 3px rgb(16 24 40 / 10%)' },
      borderRadius:{ xl:'1rem','2xl':'1.25rem' }
    }
  },
  plugins: [],
}
