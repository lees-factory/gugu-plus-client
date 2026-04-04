import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { API_BASE, COOKIE_OPTS } from '$lib/api/config.server';

export const POST: RequestHandler = async ({ request, cookies }) => {
	const body = await request.text();

	let res: Response;
	try {
		res = await fetch(`${API_BASE}/v1/auth/refresh`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body
		});
	} catch {
		return json({ error: { message: 'Cannot reach backend' } }, { status: 503 });
	}

	const data = await res.json().catch(() => ({}));

	if (res.ok && data.data) {
		const tokens = data.data;
		if (tokens?.access_token) cookies.set('access_token', tokens.access_token, COOKIE_OPTS);
		if (tokens?.refresh_token) cookies.set('refresh_token', tokens.refresh_token, COOKIE_OPTS);

		// 클라이언트에 토큰 노출 방지 -- httpOnly 쿠키로만 관리
		const { tokens: _t, access_token: _a, refresh_token: _r, ...safeData } = data.data;
		return json({ ...data, data: safeData }, { status: res.status });
	}

	return json(data, { status: res.status });
};
