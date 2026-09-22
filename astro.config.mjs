import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
const site = process.env.SITE_URL || 'http://localhost:4321';
const base = process.env.BASE_PATH || '/';
if (process.env.GITHUB_ACTIONS && !process.env.SITE_URL) throw new Error('SITE_URL es obligatorio en CI');
export default defineConfig({ site, base, output: 'static', trailingSlash: 'always',
  integrations: [sitemap({ filter: (page) => !page.endsWith('/404/') && !page.endsWith('/404.html') && !page.includes('/tags/') })] });
