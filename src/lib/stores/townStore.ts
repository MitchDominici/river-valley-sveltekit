import {writable} from 'svelte/store';
import {base} from '$app/paths';

type Town = {
    name: string;
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
};

function createTownStore() {
    const {subscribe, set, update} = writable<{
        towns: Town[];
        businesses: Business[];
        loaded: boolean;
    }>({
        towns: [],
        businesses: [],
        loaded: false
    });

    function parseCSVLine(line: string) {
        const result = [];
        let current = '';
        let inQuotes = false;

        for (let i = 0; i < line.length; i++) {
            if (line[i] === '"') {
                inQuotes = !inQuotes;
                continue;
            }
            if (line[i] === ',' && !inQuotes) {
                result.push(current);
                current = '';
                continue;
            }
            current += line[i];
        }
        result.push(current);
        return result;
    }

    async function parseCSV(csvText: string) {
        const lines = csvText.split('\n');
        const headers = parseCSVLine(lines[0]);

        return lines
            .slice(1)
            .filter((line) => line.trim())
            .map((line) => {
                const values = parseCSVLine(line);
                const obj: any = {};
                headers.forEach((header, index) => {
                    obj[header.trim()] = values[index]?.trim();
                    if (header === 'images') {
                        obj[header] = values[index].split('|');
                    }
                });
                return obj;
            });
    }

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
    async function loadData() {
        try {
            const [townsResponse, businessesResponse] = await Promise.all([
                fetch(`${base}/data/towns.csv`),
                fetch(`${base}/data/businesses.csv`)
            ]);

            const [townsText, businessesText] = await Promise.all([
                townsResponse.text(),
                businessesResponse.text()
            ]);

            const rawTowns = await parseCSV(townsText);
            const businesses = await parseCSV(businessesText);

            // Enhance towns with image paths
            const towns = rawTowns.map(town => ({
                ...town,
                images: getImagePathsForTown(town.name.toLowerCase().replace(' ', '-'))
            }));

            towns.forEach(town => {
                town.main_image = `/images/towns/${town.name.toLowerCase().replace(' ', '-')}/main.jpg`;
            });

            update(state => ({
                ...state,
                towns,
                businesses,
                loaded: true
            }));
        } catch (error) {
            console.error('Error loading data:', error);
        }
    }

    function getTown(townName: string) {
        return new Promise<Town>((resolve, reject) => {
            subscribe(({towns, loaded}) => {
                if (loaded) {
                    const town = towns.find(
                        t => t.name.toLowerCase() === townName.toLowerCase()
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
                            b => b.town.toLowerCase() === townName.toLowerCase()
                        )
                    );
                }
            })();
        });
    }

    return {
        subscribe,
        loadData,
        getTown,
        getTownBusinesses
    };
}

export const townStore = createTownStore();