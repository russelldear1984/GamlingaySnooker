/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      colors: {
        club: {
          bg: '#020617',
          surface: '#0f172a',
          card: '#111827',
          primary: '#14b8a6',
          accent: '#facc15'
        }
      },
      boxShadow: {
        card: '0 10px 25px rgba(15, 23, 42, 0.35)'
      }
    }
  },
  plugins: []
};
