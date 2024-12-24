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
            center: { lat: 38.70416299155045, lng: -91.43934350849095 },
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
                } else {
                    alert('Could not fetch directions: ' + status);
                }
            }
        );
    };
</script>

<style>
    #map {
        min-height: calc(100vh - 13rem);
        max-width: 90%;
        margin: 50px auto 0 auto;
    }
    .controls {
        gap: 1em;
        margin-left: 50px;
    }

    .loader {
        border: 4px solid #f3f3f3;
        border-radius: 50%;
        border-top: 4px solid #3498db;
        width: 40px;
        height: 40px;
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
</style>

<div class="map-container h-full w-full flex-1 relative">
    {#if isLoading}
        <div class="absolute inset-0 flex items-center justify-center bg-white">
            <div class="loader"></div>
        </div>
    {/if}
    <div id="map"></div>
</div>

<div class="controls">
    <input
            type="text"
            bind:value={start}
            placeholder="Start location (Hermann)"
    />
    <input
            type="text"
            bind:value={end}
            placeholder="End location (Berger)"
    />
    <button class="px-3 py-1 rounded-full text-sm hover:bg-blue-700 hover:text-white transition-colors bg-steel-blue text-white" on:click={getDirections}>Get Directions</button>
</div>