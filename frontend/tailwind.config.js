/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#FBF7F0',
        sage: '#A8C3A0',
        peach: '#E8B4A0',
        lavender: '#C9BFE0',
        gold: '#D4AF6A',
        midnight: '#0F1229',
        indigo: {
          950: '#0B0E24',
          900: '#131735',
          800: '#1B2148',
        },
        peacock: '#1F6F5C',
        charcoal: '#232336',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'aurora-dark': 'radial-gradient(circle at 20% 20%, rgba(212,175,106,0.12), transparent 40%), radial-gradient(circle at 80% 0%, rgba(31,111,92,0.18), transparent 45%), radial-gradient(circle at 50% 100%, rgba(201,191,224,0.10), transparent 50%)',
        'aurora-light': 'radial-gradient(circle at 20% 20%, rgba(232,180,160,0.25), transparent 40%), radial-gradient(circle at 80% 0%, rgba(168,195,160,0.25), transparent 45%)',
      },
      boxShadow: {
        glow: '0 0 40px rgba(212,175,106,0.15)',
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'float-slow': 'float 10s ease-in-out infinite',
        breathe: 'breathe 4s ease-in-out infinite',
        twinkle: 'twinkle 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        breathe: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.35)' },
        },
        twinkle: {
          '0%, 100%': { opacity: 0.2 },
          '50%': { opacity: 1 },
        },
      },
    },
  },
  plugins: [],
};
