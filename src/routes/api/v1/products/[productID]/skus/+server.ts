import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { API_BASE } from '$lib/api/config';

export const GET: RequestHandler = async ({ params, cookies }) => {
	const accessToken = cookies.get('access_token');
	if (!accessToken) {
		throw error(401, 'Unauthorized');
	}

	const productID = params.productID;
	const target = `${API_BASE}/v1/products/${encodeURIComponent(productID)}/skus`;

	const res = await fetch(target, {
		headers: { Authorization: `Bearer ${accessToken}` }
	});

	const data = await res.json().catch(() => ({}));
	return json(data, { status: res.status });
};
