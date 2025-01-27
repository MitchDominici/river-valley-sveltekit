<script lang="ts">
    import { onMount } from 'svelte';

    export let town;
    export let businesses;

    let mapElement;
    let map;
    let markers = [];
    let geocoder;
    let businessMarkers = new Map();
    let isMapInitialized = false;

    // Explicitly export the centerOnBusiness function
    export function centerOnBusiness(businessName) {
        if (!isMapInitialized) return;
        const marker = businessMarkers.get(businessName);
        if (marker) {
            map.panTo(marker.getPosition());
            map.setZoom(16);
        }
    }

    async function geocodeAddress(business) {
        if (!geocoder) {
            geocoder = new window.google.maps.Geocoder();
        }

        const address = `${business.address}, ${business.town}, ${business.state} ${business.zip}`;

        return new Promise((resolve, reject) => {
            geocoder.geocode({ address }, (results, status) => {
                if (status === 'OK') {
                    resolve(results[0].geometry.location);
                } else {
                    reject(status);
                }
            });
        });
    }

    async function initMap() {
        map = new window.google.maps.Map(mapElement, {
            center: { lat: parseFloat(town.lat), lng: parseFloat(town.long) },
            zoom: 14,
            styles: [
                {
                    featureType: "poi",
                    elementType: "labels",
                    stylers: [{ visibility: "off" }]
                },
                {
                    featureType: "water",
                    elementType: "geometry",
                    stylers: [{ color: "#c7eaf3" }]
                }
            ]
        });

        await updateMap();
        isMapInitialized = true;
    }

    async function updateMap() {
        // Clear existing markers
        markers.forEach(marker => marker.setMap(null));
        markers = [];
        businessMarkers.clear();

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

        for (const business of businesses) {
            if (business.address) {
                try {
                    const location = await geocodeAddress(business);
                    const marker = new window.google.maps.Marker({
                        position: location,
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
                                <p class="text-sm">${business.address}</p>
                            </div>
                        `;
                        infoWindow.setContent(content);
                        infoWindow.open(map, marker);
                    });

                    markers.push(marker);
                    businessMarkers.set(business.name, marker);
                } catch (error) {
                    console.error(`Error geocoding address for ${business.name}:`, error);
                }
            }
        }
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
            businessMarkers.clear();
        };
    });

    // Watch for changes in town or businesses props
    $: if (town && map && isMapInitialized) {
        updateMap();
    }
</script>

<div
        bind:this={mapElement}
        class="w-full h-96 rounded-lg shadow-lg border-2 border-primary-blue"
/>