/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Primary accent palette
        accent: '#3E70FF',         // bg-accent, text-accent, border-accent
        'accent-dark': '#2B54CC',

        // Green / cream / coral palette referenced in your CSS
        'green-light': '#C7DB9C',
        green: '#8BC34A',
        cream: '#FFF0BD',
        'coral-light': '#FDAB9E',
        coral: '#E50046'
      },
      fontFamily: {
        Limerick: ['"Limerick-Serial Regular"', 'sans-serif']
      },

      animation: {
        'pulse-subtle': 'pulse-subtle 3s ease-in-out infinite',
      },
      keyframes: {
        'pulse-subtle': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(1.01)' },
        }
      }
    }
  },
  plugins: [],
};
