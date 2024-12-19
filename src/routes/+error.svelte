<script>
    import {page} from '$app/stores';
    import {base} from '$app/paths';
</script>

<div class="flex flex-col items-center justify-center min-h-screen p-4">
    <h1 class="text-4xl font-bold mb-4">Page Not Found</h1>
    <p class="text-lg mb-8">The page you're looking for doesn't exist or has been moved.</p>
    <a
            class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            href="{base}/"
    >
        Return Home
    </a>
</div>