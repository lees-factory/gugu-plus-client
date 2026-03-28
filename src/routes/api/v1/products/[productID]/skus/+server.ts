import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { API_BASE } from '$lib/api/config';
import { bffFetch, BffNetworkError } from '$lib/api/bff-fetch';

export const GET: RequestHandler = async ({ params, cookies }) => {
	const accessToken = cookies.get('access_token');
	if (!accessToken) {
		throw error(401, 'Unauthorized');
	}

	const productID = params.productID;
	const target = `${API_BASE}/v1/products/${encodeURIComponent(productID)}/skus`;

	let res: Response;
	try {
		res = await bffFetch(
			target,
			{ headers: { Authorization: `Bearer ${accessToken}` } },
			cookies
		);
	} catch (e) {
		if (e instanceof BffNetworkError)
			return json({ error: { message: e.message } }, { status: 503 });
		throw e;
	}

	const data = await res.json().catch(() => ({}));
	return json(data, { status: res.status });
};
