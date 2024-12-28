<script lang="ts">
    import {onMount} from 'svelte';
    import {townStore} from '$lib/stores/townStore';
    import {base} from '$app/paths';

    let loaded = false;
    let towns = [];
    let businessesCount = 0;
    let townsCount = 0;

    // Subscribe to the store
    $: ({towns, businesses: allBusinesses, loaded} = $townStore);
    $: if (loaded) {
        businessesCount = allBusinesses.length;
        townsCount = towns.length;
    }

    onMount(async () => {
        if (!loaded) {
            await townStore.loadData();
        }
    });
</script>

<div id="towns-page" class="px-4 py-8">
    <!-- Header section -->
    <div class="text-center my-8">
        <h1 class="text-6xl mb-6 font-fun text-primary-blue">Historic River Towns</h1>
        <p class="text-3xl text-gray-700 max-w-3xl mx-auto">
            Discover the unique charm and rich history of the communities along the Missouri River Valley
            Loop.
        </p>
    </div>

    <!-- Stats bar -->
    <div class="grid grid-cols-3 gap-8 max-w-4xl mx-auto mb-16">
        <div class="text-center">
            <h3 class="text-4xl font-bold text-primary-blue">{townsCount}</h3>
            <p class="text-gray-600 font-display text-3xl">Towns</p>
        </div>
        <div class="text-center">
            <h3 class="text-4xl font-bold text-primary-blue">{businessesCount}+</h3>
            <p class="text-gray-600 font-display text-3xl">Small Businesses</p>
        </div>
        <div class="text-center">
            <h3 class="text-4xl font-bold text-primary-blue">75+</h3>
            <p class="text-gray-600 font-display text-3xl">Miles of Adventure</p>
        </div>
    </div>

    <!-- Towns grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 px-16">
        {#each towns as town}
            <div class="town-wrapper">
                <a
                        href="{base}/towns/{town.name.toLowerCase()}"
                        class="town-container block"
                >
                    <div class="town-image-container">
                        <img
                                src={town.main_image}
                                alt={town.name}
                                class="town-image"
                                width="200"
                                height="200"
                        />
                        <div class="town-overlay">
                            <h2 class="text-4xl font-bold font-display">{town.name}</h2>
                        </div>
                    </div>
                </a>
            </div>
        {/each}
    </div>
</div>

<style>
    .town-wrapper {
        padding: 8px;
        border-radius: 12px;
        overflow: hidden;
    }

    .town-container {
        position: relative;
        width: 90%;
        height: 300px;
        margin: 20px auto;
        border-radius: 12px;
        overflow: hidden;
        border: #0871e4 4px dashed;
        transition: transform 0.3s ease;
    }

    .town-container:hover {
        transform: scale(1.02);
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