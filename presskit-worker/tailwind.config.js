/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{tsx,jsx,ts,js}'],
	theme: {
		extend: {}
	},
	plugins: [require('@tailwindcss/typography'), require('daisyui')]
}
