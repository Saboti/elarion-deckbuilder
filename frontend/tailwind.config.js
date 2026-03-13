/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        nocturne: '#6b21a8',
        ironheart: '#b45309',
        wildborn: '#15803d',
        veilwalkers: '#0369a1',
        silvertongue: '#64748b',
        fleshbound: '#be123c',
        stat: {
          power: '#3b82f6',
          damage: '#ef4444',
          cost: '#eab308',
        },
        frame: {
          gold: '#d4af37',
          bronze: '#cd7f32',
        },
        surface: {
          card: '#1a1625',
          panel: '#0f0d13',
        },
      },
      fontFamily: {
        fantasy: ['Cinzel', 'Georgia', 'serif'],
      },
      animation: {
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 5px currentColor, 0 0 10px currentColor' },
          '50%': { boxShadow: '0 0 10px currentColor, 0 0 20px currentColor' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
    },
  },
  plugins: [],
}
