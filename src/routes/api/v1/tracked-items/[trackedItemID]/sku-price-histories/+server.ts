import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { API_BASE } from '$lib/api/config.server';
import { bffFetch, BffNetworkError } from '$lib/api/bff-fetch';

export const GET: RequestHandler = async ({ params, url, cookies }) => {
	const accessToken = cookies.get('access_token');
	if (!accessToken) {
		return json({ error: { message: 'Unauthorized' } }, { status: 401 });
	}

	const userId = cookies.get('user_id');
	if (!userId) {
		return json({ error: { message: 'Unauthorized' } }, { status: 401 });
	}

	const id = params.trackedItemID;

	const qs = new URLSearchParams(url.searchParams);
	qs.set('user_id', userId);
	const target = `${API_BASE}/v1/tracked-items/${encodeURIComponent(id)}/sku-price-histories?${qs}`;

	let res: Response;
	try {
		res = await bffFetch(target, { headers: { Authorization: `Bearer ${accessToken}` } }, cookies);
	} catch (e) {
		if (e instanceof BffNetworkError)
			return json({ error: { message: e.message } }, { status: 503 });
		throw e;
	}

	const data = await res.json().catch(() => ({}));
	return json(data, {
		status: res.status,
		headers: res.ok ? { 'Cache-Control': 'private, max-age=30' } : undefined
	});
};
