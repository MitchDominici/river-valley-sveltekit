/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{html,js,svelte,ts}'],
    theme: {
        extend: {
            colors: {
                'primary-blue': '#0871e4',
                'neutral-gray': '#bbb3b3',
                'secondary-yellow': '#e6a450',
                'earthy-brown': '#6f430e',
                'muted-gold': '#cf9c67',
                'soft-sky-blue': '#bfe5ef', //#bfe5ef
                'steel-blue': '#7087bb',
                'soft-periwinkle': '#adb4e1',
                'warm-taupe': '#977b5d',
                'blush-beige': '#e4c8b4',
                'cream-100': '#FFF8DC',
                'amber-800': '#8B4513',
                'amber-900': '#6d3611',
                'amber-200': '#E8D4A3',
            },
            fontFamily: {
                'display': ['Kaushan Script', 'cursive'],
                'fun': ['Pacifico', 'cursive'],
                'accent': ['Satisfy', 'cursive']
            },
            animation: {
                'fade-in': 'fadeIn 0.3s ease-out',
                'slide-up': 'slideUp 0.3s ease-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(-30px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                }
            }
        },
    },
    plugins: [],
}