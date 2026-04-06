import { Router } from 'express';

const router = Router();

const DOMAIN = 'https://permitpilot.online';
const TODAY = new Date().toISOString().split('T')[0];

const pages = [
  { url: '/', priority: '1.0', changefreq: 'weekly' },
  { url: '/features', priority: '0.9', changefreq: 'monthly' },
  { url: '/about', priority: '0.8', changefreq: 'monthly' },
  { url: '/blog', priority: '0.9', changefreq: 'weekly' },
  { url: '/contact', priority: '0.7', changefreq: 'monthly' },
  { url: '/privacy', priority: '0.3', changefreq: 'yearly' },
  { url: '/terms', priority: '0.3', changefreq: 'yearly' },
  { url: '/auth', priority: '0.6', changefreq: 'monthly' },
  // Blog posts
  { url: '/blog/fort-worth-building-permit-requirements-2026', priority: '0.9', changefreq: 'monthly' },
  { url: '/blog/how-long-does-a-building-permit-take-dfw-2026', priority: '0.9', changefreq: 'monthly' },
  { url: '/blog/pool-permit-requirements-texas-dfw-2026', priority: '0.9', changefreq: 'monthly' },
  { url: '/blog/dfw-contractor-license-bond-requirements-2026', priority: '0.9', changefreq: 'monthly' },
  { url: '/blog/room-addition-permit-requirements-frisco-mckinney-allen-plano-2026', priority: '0.9', changefreq: 'monthly' },
];

router.get('/sitemap.xml', (_req: any, res: any) => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(p => `  <url>
    <loc>${DOMAIN}${p.url}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  res.set('Content-Type', 'application/xml');
  res.send(xml);
});

export default router;
