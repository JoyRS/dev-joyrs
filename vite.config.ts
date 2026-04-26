import { existsSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

const SEO_DESC =
  'Cristhian Joy Reis Serrín — Backend Lead / Cloud Engineer. Portafolio: sistemas distribuidos, event-driven y cloud.'

function seoFilesPlugin(baseUrl: string): Plugin {
  const base = baseUrl.replace(/\/$/, '') || 'https://example.com'
  return {
    name: 'seo-robots-sitemap',
    apply: 'build',
    closeBundle() {
      const outDir = join(process.cwd(), 'dist')
      if (!existsSync(outDir)) return
      const robots = `User-agent: *
Allow: /

Sitemap: ${base}/sitemap.xml
`
      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${base}/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`
      writeFileSync(join(outDir, 'robots.txt'), robots, 'utf8')
      writeFileSync(join(outDir, 'sitemap.xml'), sitemap, 'utf8')
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const siteUrl = (env.VITE_SITE_URL || 'https://example.com').replace(/\/$/, '')

  return {
    plugins: [
      react(),
      {
        name: 'html-seo',
        transformIndexHtml(html) {
          return html.replaceAll('__SITE_URL__', siteUrl).replaceAll('__SEO_DESC__', SEO_DESC)
        },
      },
      seoFilesPlugin(siteUrl),
    ],
  }
})
