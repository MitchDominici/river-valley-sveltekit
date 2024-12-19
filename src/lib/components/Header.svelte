<script lang="ts">
    // Import page store properly
    import {page} from '$app/stores';

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
                        alt="Missouri River Valley Loop logo"
                        class="h-28 hover:cursor-pointer"
                        src="images/main/logo-alt-1.png"
                />
            </a>

            <div class="hidden md:flex space-x-6">
                <a
                        class="text-gray-600 hover:text-earthy-brown active:text-primary-blue"
                        class:active={$page.url.pathname === '/'}
                        href="/"
                >
                    Home
                </a>
                <a
                        class="text-gray-600 hover:text-gray-900 active:text-primary-blue"
                        class:active={$page.url.pathname === '/towns'}
                        href="/towns"
                >
                    Towns
                </a>
                <a
                        class="text-gray-600 hover:text-gray-900 active:text-primary-blue"
                        class:active={$page.url.pathname === '/events'}
                        href="/events"
                >
                    Events
                </a>
                <a
                        class="text-gray-600 hover:text-gray-900 active:text-primary-blue"
                        class:active={$page.url.pathname === '/map'}
                        href="/map"
                >
                    Map
                </a>
                <a
                        class="text-gray-600 hover:text-gray-900 active:text-primary-blue"
                        class:active={$page.url.pathname === '/about'}
                        href="/about"
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
        @apply text-primary-blue font-semibold;
    }
</style>