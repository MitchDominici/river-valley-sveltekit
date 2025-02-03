export const prerender = true;

export async function load({ params }) {
    const { slug } = params;
    return {
        slug
    };
}