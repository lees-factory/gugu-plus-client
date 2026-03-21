import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { API_BASE } from '$lib/api/config';

export const GET: RequestHandler = async ({ params, url, cookies }) => {
	const accessToken = cookies.get('access_token');
	if (!accessToken) {
		throw error(401, 'Unauthorized');
	}

	const userId = cookies.get('user_id');
	if (!userId) {
		throw error(401, 'Unauthorized');
	}

	const productID = params.productID;
	const searchParams = new URLSearchParams(url.searchParams);
	searchParams.set('user_id', userId);
	const qs = searchParams.toString();
	const target = `${API_BASE}/v1/products/${encodeURIComponent(productID)}${qs ? `?${qs}` : ''}`;

	const res = await fetch(target, {
		headers: { Authorization: `Bearer ${accessToken}` }
	});

	const data = await res.json().catch(() => ({}));
	return json(data, { status: res.status });
};
