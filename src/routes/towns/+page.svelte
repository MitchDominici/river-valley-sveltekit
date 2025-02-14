<script lang="ts">
    import {onMount} from 'svelte';
    import {townStore} from '$lib/stores/townStore';
    import {base} from '$app/paths';

    let loaded = false;
    let towns = [];
    let businessesCount = 0;
    let townsCount = 0;
    let selectedView = 'medium'; // Default to medium view (3 per row)

    // Subscribe to the store
    $: ({towns, businesses: allBusinesses, loaded} = $townStore);
    $: if (loaded) {
        businessesCount = allBusinesses.length;
        townsCount = towns.length;
    }

    // View options with their configurations
    const viewOptions = {
        small: {
            name: 'Small Cards',
            cols: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
            height: 'h-48',
            textSize: 'text-xl'
        },
        medium: {
            name: 'Medium Cards',
            cols: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
            height: 'h-72',
            textSize: 'text-4xl'
        },
        large: {
            name: 'Large Cards',
            cols: 'grid-cols-1 lg:grid-cols-2',
            height: 'h-96',
            textSize: 'text-5xl'
        }
    };

    onMount(async () => {
        if (!loaded) {
            await townStore.loadData();
            console.log(towns);
        }
    });
</script>

<div id="towns-page" class="my-4 px-4 py-8">
    <!-- Header section -->
    <div class="text-center my-8">
        <h1 class="text-6xl mb-6 font-fun text-primary-blue">Historic River Towns</h1>
        <p class="text-3xl text-gray-700 max-w-3xl mx-auto">
            Discover the unique charm and rich history of the communities along the Missouri River Valley
            LOOP.
        </p>
    </div>

    <!-- Stats bar -->
    <div class="grid grid-cols-3 gap-8 max-w-4xl mx-auto mb-16">
        <div class="text-center">
            <h3 class="text-4xl font-bold text-primary-blue">{townsCount}</h3>
            <p class="text-gray-600 font-display text-3xl">Towns</p>
        </div>
        <div class="text-center">
            <h3 class="text-4xl font-bold text-primary-blue">{businessesCount}</h3>
            <p class="text-gray-600 font-display text-3xl">Small Businesses</p>
        </div>
        <div class="text-center">
            <h3 class="text-4xl font-bold text-primary-blue">75+</h3>
            <p class="text-gray-600 font-display text-3xl">Miles of Adventure</p>
        </div>
    </div>

    <!-- Towns grid -->
    <div class="grid {viewOptions.small.cols} gap-4 px-4 md:px-8 lg:px-16">
        {#each towns as town}
            <div class="town-wrapper">
                <a
                href="{base}/towns/{town.formattedName.toLowerCase()}"
                class="town-container block {viewOptions.small.height}"
                class:list-view={selectedView === 'list'}
                >
                <div class="town-image-container">
                    <img
                            src={town.main_image}
                            alt={town.name}
                            class="town-image"
                    />
                    <div class="town-overlay">
                        <h2 class="{viewOptions.small.textSize} font-bold font-display">{town.name}</h2>
                        {#if selectedView === 'list'}
                            <p class="text-white text-lg mt-1">{town.county} County</p>
                        {/if}
                    </div>
                </div>
                </a>
            </div>
        {/each}
    </div>
</div>

<style>
    .town-wrapper {
        padding: 4px;
        border-radius: 12px;
        overflow: hidden;
    }

    .town-container {
        position: relative;
        width: 100%;
        margin: 0 auto;
        border-radius: 12px;
        overflow: hidden;
        border: #0871e4 4px dashed;
        transition: all 0.3s ease;
    }

    .town-container:hover {
        transform: scale(1.02);
    }

    .town-container.list-view {
        height: 8rem;
    }

    .town-container.list-view .town-overlay {
        display: flex;
        align-items: center;
        background: linear-gradient(to right, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.4));
        padding: 1rem 2rem;
    }

    .town-image-container {
        position: relative;
        width: 100%;
        height: 100%;
    }

    .town-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .town-overlay {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
        padding: 2rem;
        color: white;
    }
</style>