import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { API_BASE } from '$lib/api/config.server';

export const GET: RequestHandler = async ({ url }) => {
	const rawPage = Number(url.searchParams.get('page') ?? '1');
	const rawSize = Number(url.searchParams.get('size') ?? '20');
	const language = url.searchParams.get('language') ?? 'KO';

	const page = Number.isInteger(rawPage) && rawPage >= 1 ? rawPage : 1;
	const size = Number.isInteger(rawSize) && rawSize >= 1 ? Math.min(rawSize, 100) : 20;

	const target = `${API_BASE}/v1/discover/hot-products?page=${page}&size=${size}&language=${encodeURIComponent(language)}`;

	const res = await fetch(target).catch(() => null);

	if (!res) {
		return json({ result: 'ERROR', error: { message: 'Cannot reach backend' } }, { status: 503 });
	}

	const data = await res.json().catch(() => ({}));
	return json(data, {
		status: res.status,
		headers: { 'Cache-Control': res.ok ? 'public, max-age=300' : 'no-store' }
	});
};
