import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { API_BASE } from '$lib/api/config';
import { bffFetch, BffNetworkError } from '$lib/api/bff-fetch';

const buildTarget = (productID: string) =>
	`${API_BASE}/v1/products/${encodeURIComponent(productID)}/alert`;

export const POST: RequestHandler = async ({ params, request, cookies }) => {
	const accessToken = cookies.get('access_token');
	if (!accessToken) throw error(401, 'Unauthorized');

	const body = await request.text();

	let res: Response;
	try {
		res = await bffFetch(
			buildTarget(params.productID),
			{
				method: 'POST',
				headers: {
					Authorization: `Bearer ${accessToken}`,
					'Content-Type': 'application/json'
				},
				body
			},
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

export const DELETE: RequestHandler = async ({ params, cookies }) => {
	const accessToken = cookies.get('access_token');
	if (!accessToken) throw error(401, 'Unauthorized');

	let res: Response;
	try {
		res = await bffFetch(
			buildTarget(params.productID),
			{
				method: 'DELETE',
				headers: { Authorization: `Bearer ${accessToken}` }
			},
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
