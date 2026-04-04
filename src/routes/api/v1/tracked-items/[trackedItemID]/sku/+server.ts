import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { API_BASE } from '$lib/api/config.server';
import { bffFetch, BffNetworkError } from '$lib/api/bff-fetch';

export const PATCH: RequestHandler = async ({ params, request, cookies }) => {
	const accessToken = cookies.get('access_token');
	if (!accessToken) {
		return json({ error: { message: 'Unauthorized' } }, { status: 401 });
	}

	const userId = cookies.get('user_id');
	if (!userId) {
		return json({ error: { message: 'Unauthorized' } }, { status: 401 });
	}

	const id = params.trackedItemID;

	let body: string;
	try {
		const parsed = JSON.parse(await request.text()) as Record<string, unknown>;
		body = JSON.stringify({ ...parsed, user_id: userId });
	} catch {
		return json({ error: { message: 'Invalid JSON' } }, { status: 400 });
	}

	let res: Response;
	try {
		res = await bffFetch(
			`${API_BASE}/v1/tracked-items/${encodeURIComponent(id)}/sku`,
			{
				method: 'PATCH',
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
