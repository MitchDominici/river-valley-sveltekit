<script lang="ts">
    import {onMount} from 'svelte';
    import {eventStore} from '$lib/stores/eventStore';

    let modal;
    let selectedEvents = [];

    $: currentDate = $eventStore.currentDate;
    $: events = $eventStore.events;

    onMount(() => {
        eventStore.loadEvents();
    });

    function closeModal() {
        modal?.classList.add('hidden');
    }

    function showEvents(dayEvents) {
        selectedEvents = dayEvents;
        modal?.classList.remove('hidden');
    }

    function handleModalClick(e) {
        if (e.target === modal) {
            closeModal();
        }
    }

    function getDaysInMonth(date) {
        const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        const days = [];

        // Add empty cells for days before the first of the month
        for (let i = 0; i < firstDay.getDay(); i++) {
            days.push(null);
        }

        // Add days of the month
        for (let day = 1; day <= lastDay.getDate(); day++) {
            const currentDate = new Date(date.getFullYear(), date.getMonth(), day);
            const dayEvents = events.filter(
                (event) => new Date(event['Date and Time']).toDateString() === currentDate.toDateString()
            );
            days.push({day, events: dayEvents, date: currentDate});
        }

        return days;
    }

    $: days = getDaysInMonth(currentDate);
    $: monthYearText = currentDate.toLocaleString('default', {month: 'long', year: 'numeric'});
    $: weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
</script>
<!-- Event Modal -->
<div
        bind:this={modal}
        class="hidden fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
        on:click={handleModalClick}
>
    <div class="relative top-20 mx-auto p-5 border w-full max-w-xl bg-white rounded-lg shadow-xl m-4">
        <div class="flex justify-between items-center border-b pb-4">
            <h3 class="text-xl md:text-2xl font-fun text-primary-blue">
                {selectedEvents[0] ? new Date(selectedEvents[0]['Date and Time']).toLocaleDateString() : ''}
            </h3>
            <button class="text-gray-600 hover:text-gray-800 text-2xl" on:click={closeModal}>&times;</button>
        </div>
        <div class="mt-4 overflow-y-auto max-h-[70vh]">
            {#each selectedEvents as event}
                <div class="mb-6 p-6 border rounded-lg hover:shadow-lg transition-shadow">
                    <h4 class="text-2xl md:text-4xl text-bold font-display text-primary-blue mb-2">{event['Event Name']}</h4>
                    <p class="text-xl md:text-3xl text-primary-blue">{new Date(event['Date and Time']).toLocaleTimeString()}</p>
                    <p class="text-lg md:text-3xl text-gray-700 mt-3">{event.Description}</p>
                    <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <span class="font-semibold text-gray-600 text-lg md:text-2xl">Location:</span>
                            <p class="text-gray-800 text-base md:text-xl">{event.Location}</p>
                        </div>
                        {#if event.Duration}
                        <div>
                            <span class="font-semibold text-gray-600 text-lg md:text-2xl">Duration:</span>
                            <p class="text-gray-800 text-base md:text-xl">{event.Duration}</p>
                        </div>
                        {/if}
                        {#if event.Price}
                        <div>
                            <span class="font-semibold text-gray-600 text-lg md:text-2xl">Price:</span>
                            <p class="text-gray-800 text-base md:text-xl">
                                {#if typeof event.Price === 'number'}
                                    {`$${event.Price.toFixed(2)}`}
                                {:else} {event.Price}
                                {/if}
                            </p>
                        </div>
                        {/if}
                        {#if event.Website}
                        <div>
                            <a href="{event.Website}" target="_blank" class="text-primary-blue underline md:text-xl text-lg">More Information</a>
                        </div>
                        {/if}
                    </div>
                    <div class="mt-4 flex flex-wrap gap-2">
                        {#each event.Tags.split(',') as tag}
              <span class="px-3 py-1 bg-blue-50 text-primary-blue rounded-full text-sm">
                {tag.trim()}
              </span>
                        {/each}
                    </div>
                </div>
            {/each}
        </div>
    </div>
</div>

<div class="px-4 py-8" id="events-page">
    <!-- Increase max width and add more padding on larger screens -->
    <div class="max-w-full mx-auto min-h-full md:max-w-[950px] sm:max-w-[680px]">
        <!-- Adjust header spacing -->
        <div class="mb-12 space-y-6 text-center relative">
            <div class="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4" id="left-decoration"/>
            <div class="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4" id="right-decoration"/>

            <h1 class="text-3xl md:text-6xl font-fun text-primary-blue">Upcoming Events</h1>
            <p class="text-base md:text-xl text-gray-700 max-w-4xl mx-auto">
                Discover the heart and soul of Missouri's river communities through our vibrant local
                events. From seasonal festivals to farmers' markets, experience the best of our historic
                towns.
            </p>
        </div>

        <!-- Increase padding and sizing for the calendar container -->
        <div class="bg-white rounded-lg shadow-lg p-4 md:p-8 lg:p-12 border-4 border-dashed border-primary-blue hover:border-primary-blue transition-colors duration-300">
            <div class="flex justify-between items-center mb-6 md:mb-8">
                <button
                        class="text-primary-blue hover:text-blue-800 font-semibold text-lg md:text-xl"
                        on:click={() => eventStore.changeMonth(-1)}
                >
                    &lt; Previous
                </button>
                <h2 class="text-2xl md:text-4xl font-fun text-primary-blue">{monthYearText}</h2>
                <button
                        class="text-primary-blue hover:text-blue-800 font-semibold text-lg md:text-xl"
                        on:click={() => eventStore.changeMonth(1)}
                >
                    Next &gt;
                </button>
            </div>

            <!-- Adjust the calendar grid sizing -->
            <div class="overflow-x-auto">
                <!-- Add px-1 for slight padding and overflow-visible to prevent border cutoff -->
                <div class="min-w-[768px] md:min-w-full px-1 overflow-visible">
                    <!-- Add a small padding to the grid itself -->
                    <div class="grid grid-cols-7 gap-2 md:gap-4 p-0.5">
                        {#each weekDays as day}
                            <div class="text-center font-semibold py-2 md:py-4 text-primary-blue text-base md:text-xl">{day}</div>
                        {/each}

                        {#each days as dayInfo}
                            {#if dayInfo === null}
                                <div class="p-4 md:p-6 lg:p-8 bg-gray-50 rounded-lg border border-gray-100 min-h-[100px] md:min-h-[150px]"/>
                            {:else}
                                <div
                                        class="p-4 md:p-6 lg:p-8 rounded-lg border transition-all duration-300 min-h-[100px] md:min-h-[150px] {dayInfo.events.length ? 'has-events cursor-pointer' : 'bg-gray-50 border-gray-100'} {dayInfo.date.toDateString() === new Date().toDateString() ? 'ring-2 ring-primary-blue' : ''}"
                                        on:click={() => dayInfo.events.length && showEvents(dayInfo.events)}
                                >
                                    <div class="font-medium text-lg md:text-xl {dayInfo.date.toDateString() === new Date().toDateString() ? 'text-primary-blue' : ''}">{dayInfo.day}</div>
                                    {#if dayInfo.events.length}
                                        <div class="text-sm md:text-base text-primary-blue mt-2">
                                            {dayInfo.events.length} event{dayInfo.events.length > 1 ? 's' : ''}
                                        </div>
                                    {/if}
                                </div>
                            {/if}
                        {/each}
                    </div>
                </div>
            </div>

            <!-- Mobile scroll indicator -->
            <div class="md:hidden text-center text-sm text-gray-500 mt-4">
                Scroll horizontally to view more dates
            </div>
        </div>
    </div>
</div>

<style>
    :global(.has-events) {
        background: linear-gradient(135deg, #f0f9ff 0%, #e6f3ff 100%);
        border-color: #3b82f6;
    }

    :global(.has-events:hover) {
        background: linear-gradient(135deg, #e6f3ff 0%, #dceeff 100%);
    }

    /* Custom scrollbar styles for WebKit browsers */
    .overflow-x-auto {
        scrollbar-width: thin;
        scrollbar-color: #3b82f6 #f0f9ff;
    }

    .overflow-x-auto::-webkit-scrollbar {
        height: 6px;
    }

    .overflow-x-auto::-webkit-scrollbar-track {
        background: #f0f9ff;
        border-radius: 3px;
    }

    .overflow-x-auto::-webkit-scrollbar-thumb {
        background-color: #3b82f6;
        border-radius: 3px;
    }
</style>