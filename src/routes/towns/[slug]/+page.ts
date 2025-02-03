import type {Load} from '@sveltejs/kit';

export const load = (async ({params}) => {
    return {
        slug: params.slug
    };
}) satisfies Load;