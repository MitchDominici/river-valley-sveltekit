import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit()],
  // Add base URL when building for production
  base: process.env.NODE_ENV === 'production' ? '/river-valley-sveltekit/' : '/'
});