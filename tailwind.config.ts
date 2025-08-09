import type { Config } from 'tailwindcss';

export default {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        // Healthcare Professional Theme
        primary: {
          50: '#E8F4FD',
          100: '#C5E4FA',
          200: '#9FD3F7',
          300: '#73BEF3',
          400: '#4AABEF',
          500: '#2196F3',
          600: '#1976D2',
          700: '#145A9C',
          800: '#0D3E6B',
          900: '#082340',
        },
        secondary: {
          50: '#E8F5E9',
          100: '#C8E6C9',
          200: '#A5D6A7',
          300: '#81C784',
          400: '#66BB6A',
          500: '#4CAF50',
          600: '#43A047',
          700: '#388E3C',
          800: '#2E7D32',
          900: '#1B5E20',
        },
        accent: {
          50: '#E0F7FA',
          100: '#B2EBF2',
          200: '#80DEEA',
          300: '#4DD0E1',
          400: '#26C6DA',
          500: '#00BCD4',
          600: '#00ACC1',
          700: '#0097A7',
          800: '#00838F',
          900: '#006064',
        },
        warm: {
          50: '#FFF3E0',
          100: '#FFE0B2',
          200: '#FFCC80',
          300: '#FFB74D',
          400: '#FFA726',
          500: '#FF9800',
          600: '#FB8C00',
          700: '#F57C00',
          800: '#EF6C00',
          900: '#E65100',
        },
      },

      keyframes: {
        'peel-off': {
          '0%': {
            transform: 'rotate(0deg) scale(1)',
          },
          '20%': {
            transform: 'rotate(5deg) scale(1.02)',
            boxShadow: '2px 2px 10px rgba(0,0,0,0.1)',
          },
          '40%': {
            transform: 'rotate(-15deg) scale(1.05) translateY(-10px)',
            boxShadow: '4px 4px 20px rgba(0,0,0,0.15)',
          },
          '60%': {
            transform: 'rotate(10deg) scale(1.1) translateY(-20px)',
            boxShadow: '6px 6px 30px rgba(0,0,0,0.2)',
          },
          '80%': {
            transform: 'rotate(-5deg) scale(1.05) translateY(-10px)',
            boxShadow: '4px 4px 20px rgba(0,0,0,0.15)',
          },
          '100%': {
            transform: 'rotate(0deg) scale(1)',
            boxShadow: '2px 2px 10px rgba(0,0,0,0.1)',
          },
        },
        'shadow-wave': {
          '0%, 100%': { opacity: '0' },
          '50%': { opacity: '1' },
        },
      },
      animation: {
        'peel-off': 'peel-off 0.8s ease-in-out',
        'shadow-wave': 'shadow-wave 0.8s ease-in-out',
      },
    },
  },
  plugins: [],
} satisfies Config;
