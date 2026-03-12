import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: '#1B2D5E',
        'navy-mid': '#243872',
        'navy-light': '#2E4491',
        coral: '#F4614E',
        'coral-hover': '#E04D3A',
        sky: '#A8C4F0',
        'gray-text': '#8899BB',
        bg: '#F0F3FA',
      },
      fontFamily: {
        onest: ['var(--font-onest)', 'sans-serif'],
        bebas: ['var(--font-onest)', 'sans-serif'],
        nunito: ['var(--font-onest)', 'sans-serif'],
      },
      borderRadius: {
        card: '20px',
      },
      keyframes: {
        bounce3: {
          '0%, 80%, 100%': { transform: 'scale(0.6)', opacity: '0.5' },
          '40%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      animation: {
        bounce3: 'bounce3 1.2s infinite ease-in-out',
      },
    },
  },
  plugins: [],
}

export default config
