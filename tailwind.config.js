/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3b82f6',
          hover: '#2563eb',
          light: '#eff6ff',
        },
        success: {
          DEFAULT: '#10b981',
          bg: '#d1fae5',
        },
        warning: {
          DEFAULT: '#f59e0b',
          bg: '#fef3c7',
        },
        danger: {
          DEFAULT: '#ef4444',
          bg: '#fee2e2',
        },
        slate: {
          950: '#0f172a',
          500: '#64748b',
          200: '#e2e8f0',
          50: '#f8fafc',
        }
      },
      borderRadius: {
        'lg': '0.75rem',
        'xl': '1rem',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
