import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { API_BASE } from '$lib/api/config.server';

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.text();

	let res: Response;
	try {
		res = await fetch(`${API_BASE}/v1/auth/verify-email`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body
		});
	} catch {
		return json({ error: { message: 'Cannot reach backend' } }, { status: 503 });
	}

	const data = await res.json().catch(() => ({}));
	return json(data, { status: res.status });
};
