const plugin = require('tailwindcss/plugin');

module.exports = {
  purge: [
    './pages/**/*.js',
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontSize: {
      'xs': '.6rem',
      'sm': '.75rem',
      'base': '.875rem',
      'lg': '1rem',
      'xl': '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.75rem',
      '4xl': '2rem',
      '5xl': '3rem',
      '6xl': '4rem',
      '7xl': '5rem',
    },
    cursor: {
      crosshair: 'crosshair',
    }
  },
  variants: {
    extend: {},
  },
  plugins: [
    plugin(({ addBase }) => {
      addBase({
        '.montserrat': {
          fontFamily: 'Montserrat'
        }
      });
    }),
  ],
};
