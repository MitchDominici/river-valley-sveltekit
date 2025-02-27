<script lang="ts">
    import {onMount} from 'svelte';
    import {townStore} from '$lib/stores/townStore';
    import {page} from '$app/stores';
    import {base} from '$app/paths';
    import ImageSlideshow from "$lib/components/ImageSlideshow.svelte";
    import TownMap from "$lib/components/TownMap.svelte";
    import {goto} from '$app/navigation';

    let loading = true;

    let town = null;
    let businesses = [];
    let filteredBusinesses = [];
    let isFilterMenuOpen = false;

    let townMapComponent;

    const ALL_DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday',];
    let availableDays: string[] = [];
    let selectedDay: string | null = null;
    let selectedType: string | null = null;
    let availableTypes: string[] = [];

    function toggleDayFilter(day: string) {
        selectedDay = selectedDay === day ? null : day;
        filterBusinesses();
    }

    function clearAllFilters() {
        selectedDay = null;
        selectedType = null;
        filterBusinesses();
    }

    function filterBusinesses() {
        if (selectedDay && selectedDay.includes('by')) {
            // Show only businesses that have "by" in any day
            filteredBusinesses = businesses.filter(business =>
                ALL_DAYS.some(day => business[day] && business[day].toLowerCase().includes('by'))
            );
        } else if (selectedDay) {
            // Show businesses that are available on the selected day, but exclude "by"
            filteredBusinesses = businesses.filter(business =>
                business[selectedDay] && business[selectedDay].toLowerCase() !== 'closed' && !business[selectedDay].toLowerCase().includes('by')
            );
        } else {
            // No day filter, show all businesses
            filteredBusinesses = [...businesses];
        }

        if (selectedType) {
            filteredBusinesses = filteredBusinesses.filter(business => business.type.toLowerCase().includes(selectedType.toLowerCase()));
        }


        // filteredBusinesses = businesses.filter(business => {
        //     console.log('business:', business.name);
        //     if(selectedDay){
        //         const selectedDayValue = business[selectedDay];
        //         console.log('Selected day:', selectedDay, selectedDayValue);
        //
        //
        //
        //
        //         if(business[selectedDay]){
        //             const matchesDay = !selectedDay ||
        //                 (business[selectedDay] && business[selectedDay].toLowerCase() !== 'closed'
        //                     && !business[selectedDay].toLowerCase().includes('by')
        //                     && (business[selectedDay].toLowerCase().includes('am') || business[selectedDay].toLowerCase().includes('pm'))
        //                 );
        //             let hasByInDays = false;
        //             for (let day of ALL_DAYS) {
        //                 if (business[day] && business[day].toLowerCase().includes('by')) {
        //                     hasByInDays = true;
        //                 }
        //             }
        //             // const byAppointment = isByAppointmentOrAvailability && (business[selectedDay] && business[selectedDay].toLowerCase().includes('by'));
        //             // const byAvailability = isByAppointmentOrAvailability && (business[selectedDay] && business[selectedDay].toLowerCase().includes('by'));
        //             const matchesType = !selectedType || business.type.toLowerCase().includes(selectedType.toLowerCase());
        //             return (matchesDay || hasByInDays) && matchesType;
        //         }
        //     }
        //
        //     return true;
        // });
    }

    // Add type filter toggle
    function toggleTypeFilter(type: string) {
        selectedType = selectedType === type ? null : type;
        filterBusinesses();
    }

    async function goToTown(direction) {
        const townIndex = $townStore.towns.findIndex(t => t.name === town.name);
        let newTownIndex = townIndex + direction;
        if (newTownIndex < 0) {
            newTownIndex = $townStore.towns.length - 1;
        } else if (newTownIndex >= $townStore.towns.length) {
            newTownIndex = 0;
        }

        const newTown = $townStore.towns[newTownIndex].formattedName;
        console.log('New town:', newTown);

        await loadTown(newTown);

        goto(`/towns/${newTown}`);

    }

    async function loadTown(townName){
        loading = true;
        try {
            town = await townStore.getTown(townName);
            businesses = await townStore.getTownBusinesses(townName);
            availableTypes = [...new Set(businesses.map(b => b.type.toLowerCase()))]
                .sort()
                .map(type => type.charAt(0).toUpperCase() + type.slice(1)).filter(x => x !== 'null' && x !== 'undefined' && x !== '');
            for (let type of availableTypes) {
                type = type.charAt(0).toUpperCase() + type.slice(1);
                if (type.includes(',')) {
                    let subtypes = type.split(',');
                    availableTypes = availableTypes.filter(t => t !== type);
                    subtypes = subtypes.map(t => t.trim()).map(t => t.charAt(0).toUpperCase() + t.slice(1));
                    availableTypes.push(...subtypes);
                }
            }
            // Dedupe availableTypes and sort
            availableTypes = [...new Set(availableTypes)].sort();

            availableDays = ALL_DAYS.filter(day => businesses.some(business => business[day]));
            availableDays.push('by appointment/availability');

            filteredBusinesses = businesses;

            townMapComponent?.initMap(town);
        } catch (error) {
            console.error('Error loading town:', error);
        } finally {
            loading = false;
        }
    }

    onMount(async () => {
        const townName = $page.params.slug;

        loading = true;

        if (!$townStore.loaded) {
            await townStore.loadData();
        }

        await loadTown(townName);
    });

    function businessMapClickHandler(businessName: string) {
        console.log('Business clicked:', businessName);
        townMapComponent?.centerOnBusiness(businessName)
        scrollToMap();
    }

    function scrollToMap() {
        document.getElementById('townMap')!.scrollIntoView({behavior: 'smooth'})
    }
</script>


<!-- Main content -->
<div id="town-page" class="my-8 px-4 py-8">
    {#if loading}
        <div class="text-center">
            <svg class="animate-spin h-12 w-12 text-primary-blue mx-auto" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor"
                      d="M4 12a8 8 0 018-8V0c4.418 0 8 3.582 8 8s-3.582 8-8 8V4a4 4 0 00-4 4H0v4h4a8 8 0 01-4-8z"></path>
            </svg>
        </div>
    {/if}
    {#if town}
        <!-- Town Header Info -->
        <div class="container mx-auto pt-16">
            <div class="town-card bg-secondary-yellow rounded-lg shadow-lg p-8 mt-8 relative overflow-hidden border-2 border-dashed border-earthy-brown hover:border-warm-taupe transition-colors duration-300">
                <div class="flex flex-col md:flex-row gap-8">
                    <!-- Town Shape with Main Image -->
                    <div class="relative w-full md:w-1/2 aspect-square">
                        <div class="absolute inset-0 p-4">
                            <div class="relative h-full transform hover:scale-105 transition-transform duration-300">
                                <img
                                        id="{town.name}-main-image"
                                        src="{town.main_image}"
                                        alt={town.name}
                                        class="w-full h-full object-cover rounded-lg border-4 border-primary-blue shadow-xl"
                                />
                            </div>
                        </div>
                    </div>

                    <!-- Town Info -->
                    <div class="w-full md:w-1/2">
                        <h1 class="text-5xl font-fun text-primary-blue mb-4">{town.name}</h1>
                        <div class="flex flex-wrap gap-4 mb-6">
                            <div class="stat-badge">
                                <div class="text-sm text-gray-600">Population</div>
                                <div class="text-2xl font-bold text-primary-blue">{town.population}</div>
                            </div>
                            <div class="stat-badge">
                                <div class="text-sm text-gray-600">County</div>
                                <div class="text-2xl font-bold text-primary-blue">{town.county}</div>
                            </div>
                            <div class="stat-badge">
                                <div class="text-sm text-gray-600">Founded</div>
                                <div class="text-2xl font-bold text-primary-blue">{town.established}</div>
                            </div>
                        </div>
                        <div class="description-box">
                            <p class="text-gray-700 text-lg">{town.description}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Image Gallery -->
        <div class="container mx-auto px-4 py-12">
            {#if town && town.images && town.images.length > 0}
                <ImageSlideshow
                        images={town.images.map(image => `${base}${image}`)}
                        townName={town.name}
                        interval={5000}
                />
            {/if}
        </div>

        <!-- Things to Do -->
        <div class="container mx-auto px-4 py-12">
            <h2 class="text-3xl font-fun text-primary-blue mb-6">
                Things to do in {town.name}
            </h2>
            <div class="mb-4 text-gray-600 font-display text-xl">
                Every business takes pride in delivering personalized, high-quality experiences that make your visit
                memorable.
            </div>

            <div class="flex justify-end mb-4 space-x-4">
                <button
                        class="bg-primary-blue text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                        on:click={() => isFilterMenuOpen = !isFilterMenuOpen}
                >
                    Filter
                </button>
                <button
                        class="bg-primary-blue text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                        on:click={() => clearAllFilters()}
                >
                    Clear Filters
                </button>
            </div>

            {#if isFilterMenuOpen}
                <div class="bg-white rounded-lg shadow-md p-4 mb-4">
                    <h3 class="text-lg font-semibold mb-2">Open On:</h3>
                    <div class="flex flex-wrap gap-2">
                        {#each availableDays as day}
                            <button
                                    class="px-3 py-1 rounded-full text-sm {selectedDay === day ? 'bg-primary-blue text-white' : 'bg-gray-200 text-gray-700'}
                hover:bg-blue-700 hover:text-white transition-colors"
                                    on:click={() => toggleDayFilter(day)}
                            >
                                {day.charAt(0).toUpperCase() + day.slice(1)}
                            </button>
                        {/each}
                    </div>

                    <div class="mt-4">
                        <h3 class="text-lg font-semibold mb-2">Business Type:</h3>
                        <div class="flex flex-wrap gap-2">
                            {#each availableTypes as type}
                                {#if type !== ''}
                                    <button
                                            class="px-3 py-1 rounded-full text-sm {selectedType === type ? 'bg-primary-blue text-white' : 'bg-gray-200 text-gray-700'}
                hover:bg-blue-700 hover:text-white transition-colors"
                                            on:click={() => toggleTypeFilter(type)}
                                    >
                                        {type}
                                    </button>
                                {:else}
                                    <span></span>
                                {/if}
                            {/each}
                        </div>
                    </div>
                </div>

            {/if}

            <div class="space-y-4">
                {#each filteredBusinesses as business}
                    <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                        <div class="flex items-center justify-between">
                            <div class="flex-1">
                                {#if business.website}
                                    <a
                                            href={business.website.startsWith('http') ? business.website : `https://${business.website}`}
                                            target="_blank"
                                            class="flex items-center justify-between"
                                    >
                                        <h3 class="text-xl font-bold text-blue-900">{business.name}</h3>
                                    </a>
                                {:else}
                                    <h3 class="text-xl font-bold text-blue-900">{business.name}</h3>
                                {/if}
                                <p class="text-gray-600">{business.type}</p>
                                <p class="text-sm text-gray-500 mt-2">
                                    {#if business.phone}
                                        <strong>Phone:</strong> {business.phone} <br/>
                                    {/if}

                                    {#if business.address}
                                        <strong>Address:</strong> {business.address} {business.town}
                                        , {business.state} {business.zip}
                                    {/if}
                                </p>

                                <div class="flex flex-wrap gap-4 mt-3 text-sm text-gray-600">
                                    {#each ALL_DAYS as day}
                                        {#if business[day]}
                                            <div class="w-full md:w-auto">
                                                <span class="font-medium text-primary-blue"><strong>{day.charAt(0).toUpperCase() + day.slice(1)}
                                                    :</strong> </span>
                                                <span>{business[day]}</span>
                                            </div>
                                        {/if}
                                    {/each}
                                </div>
                            </div>
                            <div class="flex items-center gap-4">
                                <div class="flex gap-3">
                                    {#if business.facebook}
                                        <a
                                                href={business.facebook.startsWith('http') ?
                    business.facebook :
                    `https://facebook.com/${business.facebook.replace(/\s/g, '')}`
                  }
                                                target="_blank"
                                                class="text-blue-600 hover:text-blue-800"
                                        >
                                            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z"/>
                                            </svg>
                                        </a>
                                    {/if}

                                    {#if business.instagram}
                                        <a
                                                href={`https://instagram.com/${business.instagram.replace(/\s/g, '')}`}
                                                target="_blank"
                                                class="text-pink-600 hover:text-pink-800"
                                        >
                                            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                            </svg>
                                        </a>
                                    {/if}

                                    {#if business.tiktok}
                                        <a
                                                href={`https://tiktok.com/@${business.tiktok.replace(/\s/g, '')}`}
                                                target="_blank"
                                                class="text-gray-800 hover:text-gray-600"
                                        >
                                            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                                            </svg>
                                        </a>
                                    {/if}
                                </div>

                                {#if business.address}
                                    <button
                                            on:click={() => businessMapClickHandler(business.name)}
                                            class="text-gray-600 hover:text-primary-blue transition-colors"
                                            title="Show on map"
                                            id="{business.name}-map-button"
                                    >
                                        <!--                                        <a href="#townMap"-->
                                        <!--                                           on:click="{(event) => { event.preventDefault(); scrollToMap(); }}"></a>-->
                                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                                        </svg>
                                    </button>
                                {/if}

                                {#if business.website}
                                    <svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor"
                                         viewBox="0 0 24 24">
                                        <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-width="2"
                                                d="M14 5l7 7m0 0l-7 7m7-7H3"
                                        />
                                    </svg>
                                {/if}
                            </div>
                        </div>
                    </div>
                {/each}
            </div>

            <div class="my-4 px-4 py-8" id="townMap">
                <TownMap bind:this={townMapComponent} {town} {businesses}/>
            </div>


            <div id="page-navigation" class="flex justify-center mt-8 space-x-4">
                <button
                        class="bg-primary-blue text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                        on:click={() => goToTown(-1)}
                >
                    Previous Town
                </button>
                <button
                        class="bg-primary-blue text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                        on:click={() => goToTown(1)}
                >
                    Next Town
                </button>
            </div>
        </div>
    {/if}
</div>

<style>
    .stat-badge {
        text-align: center;
        padding: 1rem;
        background: white;
        border-radius: 0.5rem;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        border: 2px solid #e5e7eb;
        transition: all 0.3s ease;
    }

    .stat-badge:hover {
        transform: translateY(-2px);
        border-color: #3b82f6;
    }

    .description-box {
        background: white;
        padding: 1.5rem;
        border-radius: 0.5rem;
        border: 2px dashed #6f430e;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        margin-top: 1rem;
    }
</style>