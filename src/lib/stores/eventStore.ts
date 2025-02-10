import { writable } from 'svelte/store';
import { base } from '$app/paths';

type Event = {
    'Event Name': string;
    'Date and Time': string;
    Description: string;
    Location: string;
    Duration: string;
    Price: string;
    Tags: string;
    Website: string;
};

function createEventStore() {
    const { subscribe, set, update } = writable<{
        currentDate: Date;
        events: Event[];
        loaded: boolean;
        allEvents: Event[];
    }>({
        currentDate: new Date(),
        events: [],
        allEvents: [],
        loaded: false
    });

    async function loadEvents(date: Date = new Date()) {
        try {
            // If we haven't loaded the events yet, fetch them
            const response = await fetch(`${base}/data/events.json`);
            let allEvents: Event[] = await response.json();


            allEvents = allEvents.flatMap(event => {
                const dates = event['Date and Time'].split(',');
                return dates.map(date => ({
                    ...event,
                    'Date and Time': date.trim()
                }));
            });

            // Filter events for the current month
            const filteredEvents = allEvents.filter(event => {
                const eventDate = new Date(event['Date and Time']);
                return eventDate.getMonth() === date.getMonth() &&
                    eventDate.getFullYear() === date.getFullYear();
            });

            // Sort events by date
            const sortedEvents = filteredEvents.sort((a, b) => {
                return new Date(a['Date and Time']).getTime() -
                    new Date(b['Date and Time']).getTime();
            });

            update(state => ({
                ...state,
                events: sortedEvents,
                allEvents,
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

            // Filter existing events for the new month instead of fetching again
            const filteredEvents = state.allEvents.filter(event => {
                const eventDate = new Date(event['Date and Time']);
                return eventDate.getMonth() === newDate.getMonth() &&
                    eventDate.getFullYear() === newDate.getFullYear();
            });

            // Sort events by date
            const sortedEvents = filteredEvents.sort((a, b) => {
                return new Date(a['Date and Time']).getTime() -
                    new Date(b['Date and Time']).getTime();
            });

            return {
                ...state,
                currentDate: newDate,
                events: sortedEvents
            };
        });
    }

    function reset() {
        set({
            currentDate: new Date(),
            events: [],
            allEvents: [],
            loaded: false
        });
    }

    return {
        subscribe,
        loadEvents,
        changeMonth,
        reset
    };
}

export const eventStore = createEventStore();