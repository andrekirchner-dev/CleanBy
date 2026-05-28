/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        noite: '#0A1628',
        oceano: '#0E3D6B',
        chuva: '#1A7AC8',
        nevoa: '#E8F4FF',
        'verde-agua': '#00C9A0',
        'off-white': '#F5F5F0',
        success: '#1D9E75',
        error: '#E24B4A',
        warning: '#EF9F27',
        info: '#378ADD',
      },
      fontFamily: {
        jakarta: ['PlusJakartaSans'],
        sora: ['Sora-ExtraBold'],
      },
    },
  },
  plugins: [],
};
