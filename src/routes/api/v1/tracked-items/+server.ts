import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { API_BASE } from '$lib/api/config.server';
import { bffFetch, BffNetworkError } from '$lib/api/bff-fetch';

export const GET: RequestHandler = async ({ url, cookies }) => {
	const accessToken = cookies.get('access_token');
	if (!accessToken) {
		return json({ error: { message: 'Unauthorized' } }, { status: 401 });
	}

	const userId = cookies.get('user_id');
	if (!userId) {
		return json({ error: { message: 'Unauthorized' } }, { status: 401 });
	}

	const params = new URLSearchParams(url.searchParams);
	params.set('user_id', userId);
	const qs = params.toString();
	const target = `${API_BASE}/v1/tracked-items/${qs ? `?${qs}` : ''}`;

	let res: Response;
	try {
		res = await bffFetch(target, { headers: { Authorization: `Bearer ${accessToken}` } }, cookies);
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
		return json({ error: { message: 'Unauthorized' } }, { status: 401 });
	}

	const userId = cookies.get('user_id');
	if (!userId) {
		return json({ error: { message: 'Unauthorized' } }, { status: 401 });
	}

	let parsed: Record<string, unknown>;
	try {
		parsed = JSON.parse(await request.text()) as Record<string, unknown>;
	} catch {
		return json({ error: { message: 'Invalid JSON' } }, { status: 400 });
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
