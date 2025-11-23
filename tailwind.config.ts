
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/*.{js,ts,jsx,tsx,mdx}',
    './components/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {

        // My Brand palette
        navy: '#1F2A3A',         // Steel Navy
        concrete: '#E5E7EB',     // Concrete Grey
        offwhite: '#F9FAFB',     // Background
        charcoal: '#111827',     // Body text
        teal: '#0D9488',         // Optional accent
        yellow: {
          400: '#FACC15',        // Construction Yellow
          500: '#EAB308',
        },

        // Brand palette
        brand: {
          50:  '#f5f8ff',
          100: '#e0e7ff',
          500: '#3b82f6',   // main brand
          600: '#2563eb',
          900: '#0b1850',
        },
        border: '#E5E7EB',       // For card borders
        },
        
      fontFamily: {
        // These map to the CSS variables defined by next/font in app/layout.tsx
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        heading: ['var(--font-heading)', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        'slide-left': {
          '0%':   { transform: 'translateX(100%)' },  // from right
          '100%': { transform: 'translateX(0)' },     // into place
        },
        'float': {
          '0%':   { transform: 'translatey(5%)' },  // from right
          '100%': { transform: 'translatey(0)' },     // into place
        },
      },
      animation: {
        'slide-left': 'slide-left 1.2s cubic-bezier(0.65, 0, 0.35, 1) forwards',
        'float': 'float 5s cubic-bezier(0.65, 0, 0.35, 1) infinite alternate',
      },
    },
  },
  plugins: [],
};

export default config;