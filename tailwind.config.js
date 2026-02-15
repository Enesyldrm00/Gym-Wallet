/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'gym-dark': '#0f172a',
                'gym-green': '#22c55e',
            },
        },
    },
    plugins: [],
}
