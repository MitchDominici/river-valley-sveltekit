import { promises as fs, readFileSync } from 'fs';
import { base } from '$app/paths';
import { error } from '@sveltejs/kit';

export const prerender = true;

export async function load() {
    try {
        // Read the towns CSV file
        const townsData = await fs.readFile('static/data/towns.csv', 'utf-8');

        // Parse CSV to get town names (assuming first line is header)
        const lines = townsData.split('\n');
        const headers = lines[0].split(',');
        const nameIndex = headers.findIndex(h => h.trim().toLowerCase() === 'name');

        if (nameIndex === -1) {
            // @ts-ignore
            throw new error(500, 'Invalid towns data format');
        }

        // Get town names from CSV, skipping header
        const towns = lines
            .slice(1)
            .map(line => {
                const columns = line.split(',');
                return columns[nameIndex]?.trim().toLowerCase() || '';
            })
            .filter(Boolean); // Remove empty entries

        return {
            towns
        };
    } catch (err) {
        console.error('Error loading towns:', err);
        throw error(500, 'Could not load towns data');
    }
}

export const entries = () => {
    // Read the towns CSV synchronously for entries
    const townsData = readFileSync('static/data/towns.csv', 'utf-8');
    const lines = townsData.split('\n');
    const headers = lines[0].split(',');
    const nameIndex = headers.findIndex(h => h.trim().toLowerCase() === 'name');

    const towns = lines
        .slice(1)
        .map(line => {
            const columns = line.split(',');
            return columns[nameIndex]?.trim().toLowerCase() || '';
        })
        .filter(Boolean);

    return towns.map(slug => ({ slug }));
};