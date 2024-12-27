<script>
    import {onMount} from 'svelte';
    import {townStore} from "$lib/stores/townStore";

    let map;
    let directionsService;
    let directionsRenderer;
    let start = '';
    let end = '';
    let towns = [];
    let isLoading = true;
    let isGettingLocation = false;
    let hasDirections = false;
    let filteredStartTowns = [];
    let filteredEndTowns = [];
    let showStartDropdown = false;
    let showEndDropdown = false;
    let googleMapsUrl = '';

    $: isDirectionsDisabled = !start || !end;

    $: {
        townStore.subscribe(state => {
            if (state.loaded) {
                towns = state.towns;
                if (map) {
                    addMarkers();
                }
            }
        });
    }

    $: {
        if (start) {
            filteredStartTowns = towns.filter(town =>
                town.name.toLowerCase().includes(start.toLowerCase())
            );
            showStartDropdown = filteredStartTowns.length > 0;
        } else {
            showStartDropdown = false;
        }
    }

    $: {
        if (end) {
            filteredEndTowns = towns.filter(town =>
                town.name.toLowerCase().includes(end.toLowerCase())
            );
            showEndDropdown = filteredEndTowns.length > 0;
        } else {
            showEndDropdown = false;
        }
    }

    function selectStartTown(town) {
        start = `${town.name}, MO`;
        showStartDropdown = false;
    }

    function selectEndTown(town) {
        end = `${town.name}, MO`;
        showEndDropdown = false;
    }

    async function getCurrentLocation() {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser');
            return;
        }

        try {
            isGettingLocation = true;
            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject);
            });

            const geocoder = new window.google.maps.Geocoder();
            const latlng = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            const result = await new Promise((resolve, reject) => {
                geocoder.geocode({ location: latlng }, (results, status) => {
                    if (status === 'OK') {
                        resolve(results[0].formatted_address);
                    } else {
                        reject(new Error('Could not get address'));
                    }
                });
            });

            start = result;
        } catch (error) {
            alert('Error getting location: ' + error.message);
        } finally {
            isGettingLocation = false;
        }
    }

    function addMarkers() {
        const infoWindow = new window.google.maps.InfoWindow();

        towns.forEach(town => {
            const marker = new window.google.maps.Marker({
                position: {lat: parseFloat(town.lat), lng: parseFloat(town.long)},
                map,
                title: town.name
            });

            const content = `
                <div class="p-4">
                    <h2 class="text-lg font-bold">${town.name}</h2>
                    <p class="text-sm text-gray-600 mb-2">${town.county} County</p>
                    <p class="text-sm">${town.description}</p>
                </div>
            `;

            marker.addListener('click', () => {
                infoWindow.setContent(content);
                infoWindow.open(map, marker);
            });
        });
    }

    onMount(() => {
        const checkGoogleMaps = setInterval(() => {
            if (typeof window.google !== 'undefined') {
                clearInterval(checkGoogleMaps);
                initializeMap();
                isLoading = false;
            }
        }, 100);
    });

    function initializeMap() {
        map = new window.google.maps.Map(document.getElementById('map'), {
            center: { lat: 38.55, lng: -91.43934350849095 },
            zoom: 10
        });

        directionsService = new window.google.maps.DirectionsService();
        directionsRenderer = new window.google.maps.DirectionsRenderer();
        directionsRenderer.setMap(map);

        townStore.loadData();
    }
    const getDirections = () => {
        if (!start || !end) return alert('Please specify both start and end locations.');

        directionsService.route(
            {
                origin: start,
                destination: end,
                travelMode: window.google.maps.TravelMode.DRIVING
            },
            (result, status) => {
                if (status === window.google.maps.DirectionsStatus.OK) {
                    directionsRenderer.setDirections(result);
                    hasDirections = true;
                    // Create Google Maps URL
                    googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(start)}&destination=${encodeURIComponent(end)}`;
                } else {
                    alert('Could not fetch directions: ' + status);
                }
            }
        );
    };

    const clearDirections = () => {
        directionsRenderer.setDirections({ routes: [] });
        hasDirections = false;
        start = '';
        end = '';
        googleMapsUrl = '';
        map.setZoom(10);
        map.setCenter({ lat: 38.55, lng: -91.43934350849095 });
    };
</script>

<style>
    #map {
        min-height: calc(100vh - 13rem);
        max-width: 90%;
        margin: 10px auto 0 auto;
    }
    .controls {
        display: flex;
        gap: 1em;
        align-items: center;
        justify-content: center;
        margin-top: 1rem;
    }
    .loader {
        border: 4px solid #f3f3f3;
        border-radius: 50%;
        border-top: 4px solid #3498db;
        width: 40px;
        height: 40px;
        animation: spin 1s linear infinite;
    }

    .location-loader {
        border: 2px solid #f3f3f3;
        border-radius: 50%;
        border-top: 2px solid #3498db;
        width: 16px;
        height: 16px;
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }

    .dropdown {
        position: absolute;
        width: 100%;
        background: white;
        border: 1px solid #e2e8f0;
        border-radius: 0.5rem;
        margin-top: 0.25rem;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        z-index: 50;
    }

    .dropdown-item {
        padding: 0.5rem 1rem;
        cursor: pointer;
    }

    .dropdown-item:hover {
        background-color: #f7fafc;
    }
</style>
<div class="controls mt-4">
    <div class="relative">
        <input
                type="text"
                bind:value={start}
                placeholder="Start location (Hermann)"
                class="pr-10 w-64 px-4 py-2 border-2 border-primary-blue rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {#if showStartDropdown}
            <div class="dropdown">
                {#each filteredStartTowns as town}
                    <div class="dropdown-item" on:click={() => selectStartTown(town)}>
                        {town.name}, MO
                    </div>
                {/each}
            </div>
        {/if}
        <button
                on:click={getCurrentLocation}
                class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                title="Use current location"
                disabled={isGettingLocation}
        >
            {#if isGettingLocation}
                <div class="location-loader"></div>
            {:else}
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            {/if}
        </button>
    </div>
    <div class="relative">
        <input
                type="text"
                bind:value={end}
                placeholder="End location (Berger)"
                class="w-64 px-4 py-2 border-2 border-primary-blue rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {#if showEndDropdown}
            <div class="dropdown">
                {#each filteredEndTowns as town}
                    <div class="dropdown-item" on:click={() => selectEndTown(town)}>
                        {town.name}, {town.state ?? 'MO'}
                    </div>
                {/each}
            </div>
        {/if}
    </div>
    {#if hasDirections}
        <div class="flex gap-2">
            <button
                    class="px-4 py-2 rounded-full text-sm hover:bg-red-700 hover:text-white transition-colors bg-red-500 text-white"
                    on:click={clearDirections}
            >
                Clear Directions
            </button>
            <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="px-4 py-2 rounded-full text-sm hover:bg-green-700 hover:text-white transition-colors bg-green-600 text-white"
            >
                Open in Google Maps
            </a>
        </div>
    {:else}
        <button
                class="px-4 py-2 rounded-full text-sm hover:bg-primary-blue hover:text-white transition-colors bg-primary-blue text-white disabled:opacity-80 disabled:cursor-not-allowed"
                on:click={getDirections}
                disabled={isDirectionsDisabled}
        >
            Get Directions
        </button>
    {/if}
</div>


<div class="map-container h-full w-full flex-1 relative">
    {#if isLoading}
        <div class="absolute inset-0 flex items-center justify-center bg-white">
            <div class="loader"></div>
        </div>
    {/if}
    <div id="map"></div>
</div>

