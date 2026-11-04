import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  site: 'https://saasforge-landing2.onrender.com',
  output: 'server',
  adapter: node({
    mode: 'standalone',
  }),
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    sitemap(),
  ],
});
