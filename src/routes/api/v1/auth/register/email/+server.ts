import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { API_BASE } from '$lib/api/config.server';

export const POST: RequestHandler = async ({ request }) => {
	let parsed: Record<string, unknown>;
	try {
		parsed = JSON.parse(await request.text()) as Record<string, unknown>;
	} catch {
		return json({ error: { message: 'Invalid JSON' } }, { status: 400 });
	}

	if (
		typeof parsed.email !== 'string' ||
		!parsed.email.trim() ||
		typeof parsed.password !== 'string' ||
		!parsed.password.trim()
	) {
		return json({ error: { message: 'email and password are required' } }, { status: 400 });
	}

	let res: Response;
	try {
		res = await fetch(`${API_BASE}/v1/auth/register/email`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(parsed)
		});
	} catch {
		return json({ error: { message: 'Cannot reach backend' } }, { status: 503 });
	}

	const data = await res.json().catch(() => ({}));
	return json(data, { status: res.status });
};
