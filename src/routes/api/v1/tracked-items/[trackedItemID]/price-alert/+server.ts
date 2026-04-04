import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { API_BASE } from '$lib/api/config.server';
import { bffFetch, BffNetworkError } from '$lib/api/bff-fetch';

const buildTarget = (trackedItemID: string, extra?: URLSearchParams) => {
	const qs = new URLSearchParams(extra);
	return `${API_BASE}/v1/tracked-items/${encodeURIComponent(trackedItemID)}/price-alert?${qs}`;
};

export const GET: RequestHandler = async ({ params, url, cookies }) => {
	const accessToken = cookies.get('access_token');
	if (!accessToken) return json({ error: { message: 'Unauthorized' } }, { status: 401 });

	const userId = cookies.get('user_id');
	if (!userId) return json({ error: { message: 'Unauthorized' } }, { status: 401 });

	const qs = new URLSearchParams(url.searchParams);
	qs.set('user_id', userId);

	let res: Response;
	try {
		res = await bffFetch(
			buildTarget(params.trackedItemID, qs),
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

export const POST: RequestHandler = async ({ params, request, url, cookies }) => {
	const accessToken = cookies.get('access_token');
	if (!accessToken) return json({ error: { message: 'Unauthorized' } }, { status: 401 });

	const userId = cookies.get('user_id');
	if (!userId) return json({ error: { message: 'Unauthorized' } }, { status: 401 });

	let parsed: Record<string, unknown>;
	try {
		parsed = JSON.parse(await request.text()) as Record<string, unknown>;
	} catch {
		return json({ error: { message: 'Invalid JSON' } }, { status: 400 });
	}

	const qs = new URLSearchParams(url.searchParams);
	qs.set('user_id', userId);

	const body = JSON.stringify({ ...parsed, user_id: userId });

	let res: Response;
	try {
		res = await bffFetch(
			buildTarget(params.trackedItemID, qs),
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

export const DELETE: RequestHandler = async ({ params, url, cookies }) => {
	const accessToken = cookies.get('access_token');
	if (!accessToken) return json({ error: { message: 'Unauthorized' } }, { status: 401 });

	const userId = cookies.get('user_id');
	if (!userId) return json({ error: { message: 'Unauthorized' } }, { status: 401 });

	const qs = new URLSearchParams(url.searchParams);
	qs.set('user_id', userId);

	let res: Response;
	try {
		res = await bffFetch(
			buildTarget(params.trackedItemID, qs),
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
