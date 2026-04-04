import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { API_BASE } from '$lib/api/config.server';

/** 백엔드 GET /health 프록시 */
export const GET: RequestHandler = async () => {
	try {
		const res = await fetch(`${API_BASE}/health`);
		const data = await res.json().catch(() => ({}));
		return json(data, { status: res.status });
	} catch {
		return json({ ok: false, error: 'unreachable' }, { status: 503 });
	}
};
