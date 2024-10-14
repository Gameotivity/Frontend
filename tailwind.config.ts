import { type Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'
import tailwindcssAnimate from 'tailwindcss-animate'

// Default config https://github.com/tailwindlabs/tailwindcss/blob/master/stubs/config.full.js

const config = {
  darkMode: ['class'],
  content: ['./public/index.html', './src/**/*.{js,ts,tsx}'],
  plugins: [tailwindcssAnimate],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
      },
      screens: {
        ...defaultTheme.screens,
        '2xl': '1400px',
      },
    },
    fontFamily: {
      sans: [
        'SFRounded',
        'ui-rounded',
        'SF Pro Rounded',
        '-apple-system',
        'BlinkMacSystemFont',
        'Segoe UI',
        'Roboto',
        'Helvetica',
        'Arial',
        'sans-serif',
        'Apple Color Emoji',
        'Segoe UI Emoji',
        'Segoe UI Symbol',
      ],
    },
    extend: {
      screens: {
        '3xl': '2268px',
        '4xl': '3024px',
      },
      backgroundImage: {
        memes: "url('/img/memes.svg')",
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: '12px',
        md: '8px',
        sm: '4px',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'fade-in': {
          '0%': { position: 'relative', opacity: '0', top: '30px' },
          '50%': { position: 'relative', opacity: '0.5' },
          '100%': { position: 'relative', opacity: '1', top: '0px' },
        },
        'infinite-scroll': {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-100%)' },
        },
        shake: {
          '10%, 90%': {
            transform: 'translate3d(-1px, 0, 0)',
          },
          '20%, 80%': {
            transform: 'translate3d(2px, 0, 0)',
          },
          '30%, 50%, 70%': {
            transform: 'translate3d(-4px, 0, 0)',
          },
          '40%, 60%': {
            transform: 'translate3d(4px, 0, 0)',
          },
        },
        beacon: {
          '0%': {
            transform: 'scale(0.8)',
            'box-shadow': '0 0 0 0 hsl(var(--primary))',
          },
          '70%': {
            transform: 'scale(1)',
            'box-shadow': '0 0 0 60px rgba(0, 0, 0, 0)',
          },
          '100%': {
            transform: 'scale(0.8)',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.6s ease-in-out forwards',
        'infinite-scroll':
          'infinite-scroll var(--animation-duration, 25s) var(--animation-direction, forwards) linear infinite',
        shake: 'shake 4s cubic-bezier(.36,.07,.19,.97) both infinite',
        beacon: 'beacon 2s infinite',
      },
      scale: {
        '1025': '1.025',
        '200': '2.0',
      },
      borderWidth: {
        '1': '1px',
      },
      transitionTimingFunction: {
        'in-rotate': 'cubic-bezier(0.27, 0, 0.24, 0.99)',
      },
      transitionDuration: {
        '2000': '2000ms',
      },
    },
  },
} satisfies Config

export default config
