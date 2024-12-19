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

    async function parseCSV(csvText: string) {
        const lines = csvText.split('\n');
        const headers = lines[0].split('|');
        return lines
            .slice(1)
            .filter((line) => line.trim())
            .map((line) => {
                const values = line.split('|');
                const event: any = {};
                headers.forEach((header, index) => {
                    event[header.trim()] = values[index]?.trim();
                });
                return event;
            });
    }

    async function loadEvents(date: Date = new Date()) {
        try {
            const year = date.getFullYear();
            const monthNum = date.getMonth() + 1;
            const response = await fetch(`${base}/data/events/${year}/${monthNum}.csv`);
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