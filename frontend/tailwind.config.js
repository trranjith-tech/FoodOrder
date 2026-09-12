/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF4500',
          50: '#FFF0EB',
          100: '#FFD5C2',
          200: '#FFB099',
          300: '#FF8B70',
          400: '#FF6647',
          500: '#FF4500',
          600: '#E03D00',
          700: '#B83200',
          800: '#902700',
          900: '#681C00',
        },
        navy: { DEFAULT: '#1A1A2E', light: '#2D2D44' },
        gold: '#FFD700',
      },
      fontFamily: { sans: ['Inter', 'sans-serif'] },
      boxShadow: {
        card: '0 2px 8px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)',
        'card-hover': '0 8px 24px rgba(0,0,0,0.12), 0 2px 6px rgba(0,0,0,0.06)',
        'primary': '0 4px 14px rgba(255,69,0,0.35)',
      },
      animation: {
        'bounce-in': 'bounceIn 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'slide-up': 'slideUp 0.3s ease-out',
        'fade-in': 'fadeIn 0.2s ease-out',
        'shake': 'shake 0.5s ease-in-out',
      },
      keyframes: {
        bounceIn: { '0%': { transform: 'scale(0.8)', opacity: 0 }, '100%': { transform: 'scale(1)', opacity: 1 } },
        slideUp: { '0%': { transform: 'translateY(20px)', opacity: 0 }, '100%': { transform: 'translateY(0)', opacity: 1 } },
        fadeIn: { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        shake: { '0%, 100%': { transform: 'translateX(0)' }, '20%': { transform: 'translateX(-8px)' }, '40%': { transform: 'translateX(8px)' }, '60%': { transform: 'translateX(-4px)' }, '80%': { transform: 'translateX(4px)' } },
      },
    },
  },
  plugins: [],
}
