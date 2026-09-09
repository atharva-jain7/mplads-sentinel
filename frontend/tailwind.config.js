/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gov: {
          navy: '#0A2540',
          blue: '#1E3A8A',
          light: '#F4F7FB',
          border: '#E2E8F0',
          saffron: '#FF671F',
          green: '#046A38'
        },
        risk: {
          critical: '#DC2626',
          high: '#EA580C',
          medium: '#D97706',
          low: '#16A34A'
        }
      }
    },
  },
  plugins: [],
}
