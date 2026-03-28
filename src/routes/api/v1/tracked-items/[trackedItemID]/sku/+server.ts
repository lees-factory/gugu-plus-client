import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { API_BASE } from '$lib/api/config';

export const PATCH: RequestHandler = async ({ params, request, cookies }) => {
	const accessToken = cookies.get('access_token');
	if (!accessToken) {
		throw error(401, 'Unauthorized');
	}

	const id = params.trackedItemID;

	let body: string;
	try {
		const parsed = JSON.parse(await request.text());
		body = JSON.stringify(parsed);
	} catch {
		throw error(400, 'Invalid JSON');
	}

	let res: Response;
	try {
		res = await fetch(`${API_BASE}/v1/tracked-items/${encodeURIComponent(id)}/sku`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${accessToken}`
			},
			body
		});
	} catch {
		return json({ error: { message: 'Cannot reach backend' } }, { status: 503 });
	}

	const data = await res.json().catch(() => ({}));
	return json(data, { status: res.status });
};
