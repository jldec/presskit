/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{tsx,jsx,ts,js}'],
	theme: {
		extend: {}
	},
	daisyui: {
    themes: ["light", "dark", "emerald"],
  },
	plugins: [require('@tailwindcss/typography'), require('daisyui')]
}
