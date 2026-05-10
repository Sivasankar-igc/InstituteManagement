/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        blush:      '#E7A9A2',
        'blush-dark': '#D4897F',
        'blush-light': '#F2C4BF',
        nude:       '#D4A398',
        'nude-light': '#E8C5BE',
        cream:      '#FBF8F5',
        peach:      '#F1DBD5',
        'peach-mid': '#EAC9C1',
        rose:       '#C47B72',
        'rose-dark': '#B8685E',
      },
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'luxury-sm': '0 2px 8px rgba(180,120,110,0.10)',
        'luxury':    '0 4px 20px rgba(180,120,110,0.13)',
        'luxury-lg': '0 8px 40px rgba(180,120,110,0.16)',
        'luxury-xl': '0 16px 60px rgba(180,120,110,0.20)',
        'glow':      '0 0 30px rgba(231,169,162,0.35)',
      },
      animation: {
        'fade-in':    'fadeIn 0.5s ease forwards',
        'slide-up':   'slideUp 0.4s ease forwards',
        'slide-left': 'slideLeft 0.4s ease forwards',
        'scale-in':   'scaleIn 0.3s cubic-bezier(0.34,1.56,0.64,1) forwards',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'counter':    'counter 1s ease-out forwards',
        'shimmer':    'shimmer 1.5s infinite',
        'float':      'float 3s ease-in-out infinite',
        'gradient-x': 'gradientX 3s ease infinite',
      },
      keyframes: {
        fadeIn:    { from: { opacity: '0', transform: 'translateY(12px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        slideUp:   { from: { opacity: '0', transform: 'translateY(20px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        slideLeft: { from: { opacity: '0', transform: 'translateX(-20px)' }, to: { opacity: '1', transform: 'translateX(0)' } },
        scaleIn:   { from: { opacity: '0', transform: 'scale(0.95)' }, to: { opacity: '1', transform: 'scale(1)' } },
        pulseGlow: { '0%,100%': { boxShadow: '0 0 0 0 rgba(231,169,162,0.4)' }, '50%': { boxShadow: '0 0 0 12px rgba(231,169,162,0)' } },
        shimmer:   { '0%': { backgroundPosition: '-400px 0' }, '100%': { backgroundPosition: '400px 0' } },
        float:     { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-8px)' } },
        gradientX: { '0%,100%': { backgroundPosition: '0% 50%' }, '50%': { backgroundPosition: '100% 50%' } },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
