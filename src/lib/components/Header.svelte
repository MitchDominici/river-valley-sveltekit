<script lang="ts">
    // Import page store properly
    import {page} from '$app/stores';
    import {base} from '$app/paths';

    // State for mobile menu
    let isMobileMenuOpen = false;

    const toggleMobileMenu = () => {
        isMobileMenuOpen = !isMobileMenuOpen;
    };
</script>

<div class="bg-white shadow-md">
    <nav class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
            <a href="/">
                <img
                        alt="Missouri River Valley LOOP logo"
                        class="h-28 hover:cursor-pointer"
                        src="{base}/images/main/logo-alt-1.png"
                />
            </a>

            <div class="hidden md:flex space-x-6">
                <a
                        class="mt-2 px-10 py-4 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors opacity-0 transform -translate-y-4 animate-fade-in animation-delay-600 font-fun text-2xl md:text-3xl inline-block"
                        class:active={$page.url.pathname === '/'}
                        href="{base}/"
                >
                    Home
                </a>
                <a
                        class="mt-2 px-10 py-4 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors opacity-0 transform -translate-y-4 animate-fade-in animation-delay-600 font-fun text-2xl md:text-3xl inline-block"
                        class:active={$page.url.pathname.includes('/towns')}
                        href="{base}/towns"
                >
                    Towns
                </a>
                <a
                        class="mt-2 px-10 py-4 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors opacity-0 transform -translate-y-4 animate-fade-in animation-delay-600 font-fun text-2xl md:text-3xl inline-block"
                        class:active={$page.url.pathname === '/events'}
                        href="{base}/events"
                >
                    Events
                </a>
                <a
                        class="mt-2 px-10 py-4 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors opacity-0 transform -translate-y-4 animate-fade-in animation-delay-600 font-fun text-2xl md:text-3xl inline-block"
                        class:active={$page.url.pathname === '/map'}
                        href="{base}/map"
                >
                    Map
                </a>
                <a
                        class="mt-2 px-10 py-4 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors opacity-0 transform -translate-y-4 animate-fade-in animation-delay-600 font-fun text-2xl md:text-3xl inline-block"
                        class:active={$page.url.pathname === '/about'}
                        href="{base}/about"
                >
                    About
                </a>
            </div>

            <button
                    aria-label="Toggle mobile menu"
                    class="md:hidden p-2"
                    on:click={toggleMobileMenu}
            >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                            d="M4 6h16M4 12h16M4 18h16"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                    />
                </svg>
            </button>
        </div>

        {#if isMobileMenuOpen}
            <div class="md:hidden mt-4">
                <div class="flex flex-col space-y-3">
                    <a
                            class="text-left text-gray-600 hover:text-gray-900"
                            href="/"
                    >
                        Home
                    </a>
                    <a
                            class="text-left text-gray-600 hover:text-gray-900"
                            href="/towns"
                    >
                        Towns
                    </a>
                    <a
                            class="text-left text-gray-600 hover:text-gray-900"
                            href="/events"
                    >
                        Events
                    </a>
                    <a
                            class="text-left text-gray-600 hover:text-gray-900"
                            href="/map"
                    >
                        Map
                    </a>
                    <a
                            class="text-left text-gray-600 hover:text-gray-900"
                            href="/about"
                    >
                        About
                    </a>
                </div>
            </div>
        {/if}
    </nav>
</div>

<style>
    .active {
        @apply text-primary-blue bg-white border-primary-blue border-2 font-semibold;
    }
</style>