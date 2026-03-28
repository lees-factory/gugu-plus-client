import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { API_BASE } from '$lib/api/config';
import { bffFetch, BffNetworkError } from '$lib/api/bff-fetch';

export const GET: RequestHandler = async ({ params, cookies }) => {
	const accessToken = cookies.get('access_token');
	if (!accessToken) {
		throw error(401, 'Unauthorized');
	}

	const userId = cookies.get('user_id');
	if (!userId) {
		throw error(401, 'Unauthorized');
	}

	const id = params.trackedItemID;
	const qs = new URLSearchParams({ user_id: userId }).toString();

	let res: Response;
	try {
		res = await bffFetch(
			`${API_BASE}/v1/tracked-items/${encodeURIComponent(id)}?${qs}`,
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

export const DELETE: RequestHandler = async ({ params, cookies }) => {
	const accessToken = cookies.get('access_token');
	if (!accessToken) {
		throw error(401, 'Unauthorized');
	}

	const userId = cookies.get('user_id');
	if (!userId) {
		throw error(401, 'Unauthorized');
	}

	const id = params.trackedItemID;
	const qs = new URLSearchParams({ user_id: userId }).toString();

	let res: Response;
	try {
		res = await bffFetch(
			`${API_BASE}/v1/tracked-items/${encodeURIComponent(id)}?${qs}`,
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
