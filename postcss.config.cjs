/** @type {import('postcss-load-config').Config} */
module.exports = ({ env }) => ({ plugins: [require('tailwindcss')(), require('autoprefixer')()] })
