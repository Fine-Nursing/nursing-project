import type { Config } from 'tailwindcss';

export default {
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
