import tailwindcss from '@tailwindcss/vite';
import {cloudflare} from '@cloudflare/vite-plugin';
import {sites} from '@openai/sites-vite-plugin';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  const siteUrl = (
    env.VITE_SITE_URL || 'https://glodi-mputu-portfolio.michelinekalamboyo76.chatgpt.site'
  ).replace(/\/$/, '');

  return {
    plugins: [
      {
        name: 'site-seo-origin',
        enforce: 'pre',
        transformIndexHtml: (html) => html.replaceAll('__SITE_URL__', siteUrl),
      },
      react(),
      tailwindcss(),
      cloudflare({viteEnvironment: {name: 'server'}}),
      sites(),
    ],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {ignored: ['**/.wrangler/**']},
    },
  };
});
