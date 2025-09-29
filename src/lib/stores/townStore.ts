import {writable} from 'svelte/store';
import {base} from '$app/paths';

type Town = {
    name: string;
    formattedName: string;
    county: string;
    population: string;
    established: string;
    lat: number;
    long: number;
    main_image: string;
    images: string[];
    description: string;
    state: string;
};

type Business = {
    name: string;
    type: string;
    town: string;
    townNameFormatted: string;
    address?: string;
    state?: string;
    zip?: string;
    website?: string;
    facebook?: string;
    instagram?: string;
    tiktok?: string;
    sunday?: string;
    monday?: string;
    tuesday?: string;
    wednesday?: string;
    thursday?: string;
    friday?: string;
    saturday?: string;
    phone?: string;
    image?: string;
    description?: string;
    'business of the month'?: string;
};

function createTownStore() {
    const {subscribe, set, update} = writable<{
        towns: Town[];
        businesses: Business[];
        businessOfTheMonth?: Business | null;
        loaded: boolean;
    }>({
        towns: [],
        businesses: [],
        businessOfTheMonth: null,
        loaded: false
    });

    function getImagePathsForTown(townName: string): string[] {
        // Use Vite's import.meta.glob to get all images in the town's folder
        const imageFiles = import.meta.glob('/static/images/towns/**/*.{jpg,jpeg,png,gif}', {
            eager: true,
            as: 'url'
        });

        // Filter and format the paths for the specific town
        const townFolderPath = `/images/towns/${townName.toLowerCase()}`;
        const imagePaths = Object.keys(imageFiles)
            .filter(path => path.startsWith(`/static${townFolderPath}`))
            .map(path => path.replace('/static', ''))
            .sort();

        return imagePaths;
    }

    function getMainImagePathForTown(images: any): string {
        return images.find((image: any) => image.includes('main'));
    }

    async function loadData() {
        try {
            const [townsResponse, businessesResponse] = await Promise.all([
                fetch(`${base}/data/towns.json`),
                fetch(`${base}/data/businesses.json`)
            ]);

            const [rawTowns, businesses] = await Promise.all([
                townsResponse.json(),
                businessesResponse.json()
            ]);

            // trim whitespace from business town
            businesses.forEach((business: any) => {
                business.town = business.town.trim();
                business.townNameFormatted = business.town.toLowerCase().replace(' ', '-');
            });

            businesses.forEach((business: any) => {
                business.type = business.type.trim();
                business.type = business.type.charAt(0).toUpperCase() + business.type.slice(1);
            });

            // Enhance towns with image paths
            const towns = rawTowns.map((town: { name: string; }) => ({
                ...town,
                images: getImagePathsForTown(town.name.toLowerCase().replace(' ', '-')),
                formattedName: town.name.toLowerCase().replace(' ', '-'),
            }));

            // Add main image path for each town
            towns.forEach((town: { main_image: string; images: any; }) => {
                town.main_image = getMainImagePathForTown(town.images);
            });

            // Sort towns alphabetically by name
            // towns.sort((a, b) => a.name.localeCompare(b.name));
            const townSortOrder = [
                'New Haven',
                'Gerald',
                'Rosebud',
                'Oensville',
                'Swiss',
                'Hermann',
                'Berger',
                'Stony Hill',
            ];
            // Sort towns based on the predefined order
            for (let i = 0; i < townSortOrder.length; i++) {
                const town = towns.find((t: any) => t.name === townSortOrder[i]);
                if (town) {
                    towns.splice(towns.indexOf(town), 1);
                    towns.splice(i, 0, town);
                }
            }

            // Sort businesses alphabetically by name within each town
            businesses.sort((a: any, b: any) => {
                const townCompare = a.town.localeCompare(b.town);
                if (townCompare === 0) {
                    return a.name.localeCompare(b.name);
                }
                return townCompare;
            });

            // Get business of the month
            const businessOfTheMonth = getBusinessOfTheMonth(businesses);

            update(state => ({
                ...state,
                towns,
                businesses,
                businessOfTheMonth,
                loaded: true
            }));
            console.log('Towns and businesses loaded');
        } catch (error) {
            console.error('Error loading data:', error);
            update(state => ({
                ...state,
                loaded: true
            }));
        }
    }

    function getTown(townName: string) {
        return new Promise<Town>((resolve, reject) => {
            subscribe(({towns, loaded}) => {
                if (loaded) {
                    const town = towns.find(
                        t => (t.name.toLowerCase() === townName.toLowerCase()) || (t.formattedName === townName)
                    );
                    if (town) resolve(town);
                    else reject(new Error(`Town ${townName} not found`));
                }
            })();
        });
    }

    function getTownBusinesses(townName: string) {
        return new Promise<Business[]>((resolve) => {
            subscribe(({businesses, loaded}) => {
                if (loaded) {
                    resolve(
                        businesses.filter(
                            b => (b.town.toLowerCase() === townName.toLowerCase()) || (b.townNameFormatted === townName)
                        )
                    );
                }
            })();
        });
    }

    function getBusinessOfTheMonth(businesses: Business[]) {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        const businessOfTheMonth = businesses.filter(b => {
            const businessMonth = b['business of the month'];
            if (!businessMonth) return false;
            // Expecting format "YYYY-MM-DDT06:00:00.000Z"
            const [year, month] = businessMonth.split('-').map(Number);
            return year === currentYear && (month - 1) === currentMonth;
        });

        // Add default image and description if not present
        if (businessOfTheMonth[0]) {
            const business = businessOfTheMonth[0];
            // Add a placeholder image if none exists
            if (!business.image) {
                business.image = `${base}/images/placeholder-business.jpg`; // You'll need to add this
            }
            // Generate a description from available data
            if (!business.description) {
                business.description = `Visit ${business.name} in ${business.town}. ${business.type} serving our community with pride.`;
            }
        }

        return businessOfTheMonth[0] || null;
    }

    return {
        subscribe,
        loadData,
        getTown,
        getTownBusinesses,
        getBusinessOfTheMonth
    };
}

export const townStore = createTownStore();