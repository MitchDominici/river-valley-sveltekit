import {writable} from 'svelte/store';
import {base} from '$app/paths';

type Event = {
    'Event Name': string;
    'Date and Time': string;
    Description: string;
    Location: string;
    Duration: string;
    Price: string;
    Tags: string;
};

function createEventStore() {
    const {subscribe, set, update} = writable<{
        currentDate: Date;
        events: Event[];
        loaded: boolean;
    }>({
        currentDate: new Date(),
        events: [],
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

    async function loadEvents(date: Date = new Date()) {
        try {
            const year = date.getFullYear();
            const monthNum = date.getMonth() + 1;
            const response = await fetch(`${base}/data/events/${year}_${monthNum}.csv`);
            const csvText = await response.text();
            const events = await parseCSV(csvText);

            update(state => ({
                ...state,
                events,
                currentDate: date,
                loaded: true
            }));
        } catch (error) {
            console.error('Error loading events:', error);
            update(state => ({
                ...state,
                events: [],
                loaded: true
            }));
        }
    }

    function changeMonth(delta: number) {
        update(state => {
            const newDate = new Date(state.currentDate);
            newDate.setMonth(newDate.getMonth() + delta);
            loadEvents(newDate);
            return {
                ...state,
                currentDate: newDate
            };
        });
    }

    return {
        subscribe,
        loadEvents,
        changeMonth
    };
}

export const eventStore = createEventStore();