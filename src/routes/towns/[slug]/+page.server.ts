import { promises as fs, readFileSync } from 'fs';
import { base } from '$app/paths';
import { error } from '@sveltejs/kit';

export const prerender = true;

export async function load() {
    try {
        // Read both JSON files
        const [townsData, businessesData] = await Promise.all([
            fs.readFile('static/data/towns.json', 'utf-8'),
            fs.readFile('static/data/businesses.json', 'utf-8')
        ]);

        const towns = JSON.parse(townsData);
        const businesses = JSON.parse(businessesData);

        return {
            towns,
            businesses
        };
    } catch (err) {
        console.error('Error loading data:', err);
        throw error(500, 'Could not load data');
    }
}

export const entries = () => {
    try {
        // Read towns data synchronously for entries
        const townsData = readFileSync('static/data/towns.json', 'utf-8');
        const towns = JSON.parse(townsData);

        // Return array of slug objects for each town
        return towns.map((town: { name: string; }) => ({
            slug: town.name.toLowerCase().replace(/\s+/g, '-')
        }));
    } catch (err) {
        console.error('Error generating entries:', err);
        return [];
    }
};