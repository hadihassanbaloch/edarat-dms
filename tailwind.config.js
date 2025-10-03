/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['SF Pro Display', 'SF Pro Text', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      colors: {
        glass: {
          50: 'rgba(255, 255, 255, 0.05)',
          100: 'rgba(255, 255, 255, 0.1)',
          200: 'rgba(255, 255, 255, 0.15)',
          300: 'rgba(255, 255, 255, 0.25)',
          400: 'rgba(255, 255, 255, 0.35)',
          500: 'rgba(255, 255, 255, 0.5)',
        },
        // Primary Colors
        primary: {
          dark: '#03778d',    // Primary Dark
          bright: '#08bed5',  // Primary Bright
          50: '#d5eef7',      // Lightest tint from secondary
          100: '#92d6e3',     // Light tint from secondary  
          200: '#08bed5',     // Primary Bright
          300: '#06a8bd',     // Slightly darker bright
          400: '#0592a5',     // Medium
          500: '#03778d',     // Primary Dark
          600: '#026575',     // Darker
          700: '#02535d',     // Much darker
          800: '#014045',     // Very dark
          900: '#012d32',     // Darkest
        },
        // Secondary Colors
        secondary: {
          dark: '#3E4242',    // Secondary dark gray
          light: '#eaeaea',   // Secondary light gray
          blue: '#08bed5',    // Secondary blue (same as primary bright)
          lightest: '#d5eef7', // Secondary lightest
          medium: '#92d6e3',  // Secondary medium blue
        },
        // Legacy eteal for backwards compatibility (mapped to new primary)
        eteal: {
          50: '#d5eef7',
          100: '#92d6e3',
          200: '#08bed5',
          300: '#06a8bd',
          400: '#0592a5',
          500: '#03778d',
          600: '#026575',
          700: '#02535d',
          800: '#014045',
          900: '#012d32',
          950: '#01232a',
        },
        enterprise: {
          slate: {
            25: '#fcfcfd',
            50: '#f8fafc',
            75: '#f1f5f9',
            100: '#e2e8f0',
            200: '#cbd5e1',
            300: '#94a3b8',
            400: '#64748b',
            500: '#475569',
            600: '#334155',
            700: '#1e293b',
            800: '#0f172a',
            900: '#020617',
          }
        }
      },
      backdropBlur: {
        'xs': '2px',
        '4xl': '72px',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'ripple': 'ripple 0.6s ease-out',
        'glass-morph': 'glass-morph 0.3s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(59, 130, 246, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(59, 130, 246, 0.8), 0 0 30px rgba(59, 130, 246, 0.4)' },
        },
        ripple: {
          '0%': { transform: 'scale(0)', opacity: '1' },
          '100%': { transform: 'scale(4)', opacity: '0' },
        },
        'glass-morph': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'glass-lg': '0 25px 50px -12px rgba(31, 38, 135, 0.25)',
        'neon': '0 0 20px rgba(59, 130, 246, 0.5)',
        'neon-lg': '0 0 40px rgba(59, 130, 246, 0.6)',
        'spatial': '0 20px 40px -12px rgba(0, 0, 0, 0.25), inset 0 1px 0 0 rgba(255, 255, 255, 0.05)',
      }
    },
  },
  plugins: [],
};