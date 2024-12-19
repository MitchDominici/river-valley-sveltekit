import {parse} from 'csv-parse/sync';
import {promises as fs} from 'fs';

async function loadTown() {
    const response = await fetch('data/towns.csv');
    const csvText = await response.text();
    console.log(csvText);
    // const towns = parseCSV(csvText);
    // town = towns.find((t) => t.name.toLowerCase() === townName.toLowerCase());
}

export async function load() {
    try {
        await loadTown();
        const townsData = await fs.readFile('data/towns.csv', 'utf-8');
        const businessesData = await fs.readFile('data/businesses.csv', 'utf-8');

        const towns = parse(townsData, {
            columns: true,
            skip_empty_lines: true
        });

        const businesses = parse(businessesData, {
            columns: true,
            skip_empty_lines: true
        });

        return {
            towns,
            businessesCount: businesses.length,
            townsCount: towns.length
        };
    } catch (error) {
        console.error('Error loading data:', error);
        return {
            towns: [],
            businessesCount: 0,
            townsCount: 0
        };
    }
}