export const prerender = true;

// @ts-ignore
export const load: PageLoad = async ({ params, parent }) => {
    const { towns, businesses } = await parent();
    const { slug } = params;

    // Convert slug back to town name format (e.g., 'new-haven' -> 'New Haven')
    const townName = slug
        .split('-')
        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

    // Find the town data
    const town = towns.find((t: { name: string; }) => t.name.toLowerCase() === townName.toLowerCase());
    if (!town) {
        throw new Error(`Town ${townName} not found`);
    }

    // Find businesses for this town
    const townBusinesses = businesses.filter((b: { town: string; }) =>
        b.town.toLowerCase() === townName.toLowerCase()
    );

    return {
        town,
        businesses: townBusinesses
    };
};