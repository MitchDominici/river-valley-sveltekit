/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{html,js,svelte,ts}'],
    theme: {
        extend: {
            colors: {
                'primary-blue': '#0871e4',
                'soft-periwinkle': '#e6e9f9',
                'earthy-brown': '#6f430e',
                'warm-taupe': '#8b7355',
                'soft-sky-blue': '#c7eaf3'
            },
            fontFamily: {
                'display': ['Kaushan Script', 'cursive'],
                'fun': ['Pacifico', 'cursive'],
                'accent': ['Satisfy', 'cursive']
            }
        },
    },
    plugins: [],
}