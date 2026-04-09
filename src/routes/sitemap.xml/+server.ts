import type { RequestHandler } from './$types';

const BASE_URL = 'https://priceeye.com';
const LOCALES = ['ko', 'en'];

const PUBLIC_PAGES = [
	{ path: '/', changefreq: 'weekly', priority: '1.0' },
	{ path: '/discover', changefreq: 'daily', priority: '0.9' },
	{ path: '/plan', changefreq: 'monthly', priority: '0.8' },
	{ path: '/terms', changefreq: 'yearly', priority: '0.3' },
	{ path: '/privacy', changefreq: 'yearly', priority: '0.3' }
];

export const GET: RequestHandler = () => {
	const today = new Date().toISOString().split('T')[0];

	const urls = PUBLIC_PAGES.map((page) => {
		const lastmod = page.changefreq === 'yearly' ? '2025-01-01' : today;
		const loc = `${BASE_URL}${page.path}`;
		const hreflangs = LOCALES.map(
			(lang) => `    <xhtml:link rel="alternate" hreflang="${lang}" href="${loc}" />`
		).join('\n');
		const xDefault = `    <xhtml:link rel="alternate" hreflang="x-default" href="${loc}" />`;

		return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
${hreflangs}
${xDefault}
  </url>`;
	}).join('\n');

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>`;

	return new Response(xml.trim(), {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'public, max-age=3600'
		}
	});
};
