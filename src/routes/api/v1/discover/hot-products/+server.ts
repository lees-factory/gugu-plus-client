import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { API_BASE } from '$lib/api/config';

export const GET: RequestHandler = async ({ url }) => {
	const page = url.searchParams.get('page') ?? '1';
	const size = url.searchParams.get('size') ?? '20';

	const target = `${API_BASE}/v1/discover/hot-products?page=${encodeURIComponent(page)}&size=${encodeURIComponent(size)}`;

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
