<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import {base} from '$app/paths';

    export let images: string[] = [];
    export let townName: string = '';
    export let interval: number = 3000;

    let currentIndex = 0;
    let isPlaying = true;
    let timer: ReturnType<typeof setInterval>;

    // Get three images at a time, starting from the current index
    $: visibleImages = [
        images[currentIndex],
        images[(currentIndex + 1) % images.length],
        images[(currentIndex + 2) % images.length]
    ];

    function startSlideshow() {
        timer = setInterval(() => {
            currentIndex = (currentIndex + 1) % images.length;
        }, interval);
    }

    function stopSlideshow() {
        clearInterval(timer);
    }

    function goToNext() {
        currentIndex = (currentIndex + 1) % images.length;
        resetTimer();
    }

    function goToPrevious() {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        resetTimer();
    }

    function resetTimer() {
        if (isPlaying) {
            stopSlideshow();
            startSlideshow();
        }
    }

    onMount(() => {
        if (isPlaying && images.length > 3) {
            startSlideshow();
        }
    });

    onDestroy(() => {
        stopSlideshow();
    });
</script>

<div class="container mx-auto px-4 py-12">
    <h2 class="text-3xl font-fun text-primary-blue mb-6">Gallery</h2>
    <div class="relative">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            {#each visibleImages as image}
                <div class="overflow-hidden rounded-lg shadow-lg">
                    <img
                            src={image}
                            alt={townName}
                            class="w-full h-64 object-cover hover:scale-110 transition-transform duration-300"
                    />
                </div>
            {/each}
        </div>

        {#if images.length > 3}
            <!-- Navigation Arrows -->
            <button
                    on:click={goToPrevious}
                    class="absolute left-0 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors -translate-x-1/2"
                    aria-label="Previous images"
            >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
            </button>

            <button
                    on:click={goToNext}
                    class="absolute right-0 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors translate-x-1/2"
                    aria-label="Next images"
            >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
            </button>
        {/if}
    </div>
</div>