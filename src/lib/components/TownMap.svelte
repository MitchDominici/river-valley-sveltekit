<script lang="ts">
    import { onMount } from 'svelte';

    export let town;
    export let businesses;

    let mapElement;
    let map;
    let markers = [];

    $: if (town && map) {
        updateMap();
    }

    onMount(() => {
        if (typeof window.google !== 'undefined' && town) {
            initMap();
        } else {
            // Wait for Google Maps to load
            const checkGoogleMaps = setInterval(() => {
                if (typeof window.google !== 'undefined') {
                    clearInterval(checkGoogleMaps);
                    initMap();
                }
            }, 100);
        }

        return () => {
            // Cleanup markers when component is destroyed
            markers.forEach(marker => marker.setMap(null));
            markers = [];
        };
    });

    function initMap() {
        map = new window.google.maps.Map(mapElement, {
            center: { lat: parseFloat(town.lat), lng: parseFloat(town.long) },
            zoom: 14,
            styles: [
                {
                    featureType: "water",
                    elementType: "geometry",
                    stylers: [{ color: "#c7eaf3" }]
                }
            ]
        });

        updateMap();
    }

    function updateMap() {
        // Clear existing markers
        markers.forEach(marker => marker.setMap(null));
        markers = [];

        // Add town marker
        const townMarker = new window.google.maps.Marker({
            position: { lat: parseFloat(town.lat), lng: parseFloat(town.long) },
            map,
            title: town.name,
            icon: {
                path: window.google.maps.SymbolPath.CIRCLE,
                scale: 10,
                fillColor: "#0871e4",
                fillOpacity: 1,
                strokeWeight: 2,
                strokeColor: "#ffffff"
            }
        });
        markers.push(townMarker);

        // Add business markers
        const infoWindow = new window.google.maps.InfoWindow();

        businesses.forEach(business => {
            if (business.lat && business.long) {
                const marker = new window.google.maps.Marker({
                    position: { lat: parseFloat(business.lat), lng: parseFloat(business.long) },
                    map,
                    title: business.name,
                    icon: {
                        path: window.google.maps.SymbolPath.CIRCLE,
                        scale: 8,
                        fillColor: "#da9c4d",
                        fillOpacity: 0.8,
                        strokeWeight: 1,
                        strokeColor: "#ffffff"
                    }
                });

                marker.addListener('click', () => {
                    const content = `
                        <div class="p-2">
                            <h3 class="font-bold">${business.name}</h3>
                            <p class="text-sm text-gray-600">${business.type}</p>
                            ${business.address ? `<p class="text-sm">${business.address}</p>` : ''}
                        </div>
                    `;
                    infoWindow.setContent(content);
                    infoWindow.open(map, marker);
                });

                markers.push(marker);
            }
        });
    }
</script>

<div
        bind:this={mapElement}
        class="w-full h-96 rounded-lg shadow-lg border-2 border-primary-blue"
/>