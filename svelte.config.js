import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter({
      pages: 'build',
      assets: 'build',
      fallback: '404.html',
      precompress: false,
      strict: true
    }),
    paths: {
      base: '/river-valley-sveltekit'  // Make sure this matches your repository name exactly
    },
    // Add this to ensure assets are properly referenced
    prerender: {
      handleHttpError: ({ path, referrer, message }) => {
        // Ignore static asset 404s since they'll be available in production
        if (path.includes('.') && !path.includes('/_app/')) {
          return;
        }
        throw new Error(message);
      }
    }
  },
  preprocess: vitePreprocess()
};

export default config;