/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{html,js,svelte,ts}'],
    theme: {
        extend: {
            colors: {
                'primary-blue': '#0871e4',
                'neutral-gray': '#bbb3b3',
                'secondary-yellow': '#da9c4d',
                'earthy-brown': '#6f430e',
                'muted-gold': '#cf9c67',
                'soft-sky-blue': '#c7eaf3',
                'steel-blue': '#7087bb',
                'soft-periwinkle': '#adb4e1',
                'warm-taupe': '#977b5d',
                'blush-beige': '#e4c8b4',
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