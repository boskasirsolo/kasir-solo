
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
      },
      colors: {
        brand: {
          black: '#050505',
          dark: '#0f0f0f',
          card: '#141414',
          orange: '#FF5F1F',      
          glow: '#FF914D',        
          dim: '#331000',         
          action: '#FF5F1F',      
          actionGlow: '#FF914D'
        }
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #FF5F1F 0%, #DC2626 100%)',
        'brand-gradient-hover': 'linear-gradient(135deg, #FF7A45 0%, #EF4444 100%)',
      },
      boxShadow: {
        'neon': '0 0 10px rgba(255, 95, 31, 0.3), 0 0 20px rgba(255, 95, 31, 0.1)',
        'neon-strong': '0 0 15px rgba(255, 95, 31, 0.6), 0 0 30px rgba(255, 95, 31, 0.4)',
        'neon-text': '0 0 10px rgba(255, 95, 31, 0.8)',
        'action': '0 0 10px rgba(255, 95, 31, 0.3), 0 0 20px rgba(255, 95, 31, 0.1)',
        'action-strong': '0 0 15px rgba(255, 95, 31, 0.6), 0 0 30px rgba(255, 95, 31, 0.4)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'marquee': 'marquee 60s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-100%)' },
        }
      }
    }
  },
  plugins: [],
}
