import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { API_BASE } from '$lib/api/config';
import { bffFetch, BffNetworkError } from '$lib/api/bff-fetch';

export const GET: RequestHandler = async ({ url, cookies }) => {
	const accessToken = cookies.get('access_token');
	if (!accessToken) {
		throw error(401, 'Unauthorized');
	}

	const userId = cookies.get('user_id');
	if (!userId) {
		throw error(401, 'Unauthorized');
	}

	const params = new URLSearchParams(url.searchParams);
	params.set('user_id', userId);
	const qs = params.toString();
	const target = `${API_BASE}/v1/tracked-items/${qs ? `?${qs}` : ''}`;

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

export const POST: RequestHandler = async ({ request, cookies }) => {
	const accessToken = cookies.get('access_token');
	if (!accessToken) {
		throw error(401, 'Unauthorized');
	}

	const userId = cookies.get('user_id');
	if (!userId) {
		throw error(401, 'Unauthorized');
	}

	let parsed: Record<string, unknown>;
	try {
		parsed = JSON.parse(await request.text()) as Record<string, unknown>;
	} catch {
		throw error(400, 'Invalid JSON');
	}

	const body = JSON.stringify({ ...parsed, user_id: userId });

	let res: Response;
	try {
		res = await bffFetch(
			`${API_BASE}/v1/tracked-items/`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${accessToken}`
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
