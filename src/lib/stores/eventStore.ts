import { writable } from 'svelte/store';
import { base } from '$app/paths';

type Event = {
    'Event Name': string;
    Description?: string;
    Location: string;
    Duration?: string;
    Price?: string | number;
    Tags?: string;
    Website?: string;
    Dates: string;
    'Start Time'?: string;
    'End Time'?: string;
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

    // Helper function to calculate duration from start and end times
    function calculateDuration(startTime: string | undefined, endTime: string | undefined): string | undefined {
        if (!startTime || !endTime) return undefined;

        const start = new Date(`1970-01-01 ${startTime}`);
        const end = new Date(`1970-01-01 ${endTime}`);

        if (isNaN(start.getTime()) || isNaN(end.getTime())) return undefined;

        const diffMs = end.getTime() - start.getTime();
        if (diffMs <= 0) return undefined;

        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

        if (hours > 0) {
            return `${hours} hour${hours !== 1 ? 's' : ''}${minutes > 0 ? ` ${minutes} minute${minutes !== 1 ? 's' : ''}` : ''}`;
        } else {
            return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
        }
    }

    // Helper function to get date from event
    function getEventDate(event: Event, dateStr: string): Date {
        const datePart = dateStr.trim();
        const timePart = event['Start Time'] || '12:00:00 PM';
        return new Date(`${datePart} ${timePart}`);
    }

    async function loadEvents(date: Date = new Date()) {
        try {
            const response = await fetch(`${base}/data/events.json`);
            let allEvents: Event[] = await response.json();
            console.log(allEvents);

            // Process events with multiple dates
            allEvents = allEvents.flatMap(event => {
                if (!event.Dates) return [event];

                const dates = event.Dates.split(',');
                if (dates.length === 1) {
                    // Calculate duration if needed for single date events
                    if (!event.Duration && event['Start Time'] && event['End Time']) {
                        event.Duration = calculateDuration(event['Start Time'], event['End Time']);
                    }
                    return [event];
                }

                // For multi-date events, create a copy for each date with only that specific date
                return dates.map(dateStr => {
                    const newEvent = { ...event };
                    // Set the Dates field to just this single date
                    newEvent.Dates = dateStr.trim();

                    // Calculate duration if not provided but start and end times exist
                    if (!newEvent.Duration && newEvent['Start Time'] && newEvent['End Time']) {
                        newEvent.Duration = calculateDuration(newEvent['Start Time'], newEvent['End Time']);
                    }

                    return newEvent;
                });
            });

            // Filter events for the current month
            const filteredEvents = allEvents.filter(event => {
                if (!event.Dates) return false;

                const eventDate = getEventDate(event, event.Dates);
                return eventDate.getMonth() === date.getMonth() &&
                    eventDate.getFullYear() === date.getFullYear();
            });

            // Sort events by date and time
            const sortedEvents = filteredEvents.sort((a, b) => {
                const aDate = getEventDate(a, a.Dates);
                const bDate = getEventDate(b, b.Dates);
                return aDate.getTime() - bDate.getTime();
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

            // Filter existing events for the new month
            const filteredEvents = state.allEvents.filter(event => {
                if (!event.Dates) return false;

                const eventDate = getEventDate(event, event.Dates);
                return eventDate.getMonth() === newDate.getMonth() &&
                    eventDate.getFullYear() === newDate.getFullYear();
            });

            // Sort events by date and time
            const sortedEvents = filteredEvents.sort((a, b) => {
                const aDate = getEventDate(a, a.Dates);
                const bDate = getEventDate(b, b.Dates);
                return aDate.getTime() - bDate.getTime();
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