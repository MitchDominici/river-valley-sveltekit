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
      base: '/river-valley-sveltekit'
    },
    prerender: {
      entries: [
        '*',
        '/towns/[slug]'
      ],
      handleHttpError: ({ path, referrer, message }) => {
        // Ignore certain 404s
        if (path.includes('.') && !path.includes('/_app/')) {
          return;
        }
        console.warn(`${path} - ${message}`);
      }
    }
  },
  preprocess: vitePreprocess()
};

export default config;