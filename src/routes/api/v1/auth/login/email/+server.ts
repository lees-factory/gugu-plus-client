import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { API_BASE, COOKIE_OPTS } from '$lib/api/config.server';

export const POST: RequestHandler = async ({ request, cookies }) => {
	const body = await request.text();

	let res: Response;
	try {
		res = await fetch(`${API_BASE}/v1/auth/login/email`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body
		});
	} catch {
		return json({ error: { message: 'Cannot reach backend' } }, { status: 503 });
	}

	const data = await res.json().catch(() => ({}));

	if (res.ok && data.data) {
		const { tokens, user } = data.data;
		if (tokens?.access_token) cookies.set('access_token', tokens.access_token, COOKIE_OPTS);
		if (tokens?.refresh_token) cookies.set('refresh_token', tokens.refresh_token, COOKIE_OPTS);
		if (user?.email) cookies.set('session', encodeURIComponent(user.email), COOKIE_OPTS);
		if (user?.id) cookies.set('user_id', user.id, COOKIE_OPTS);

		// 클라이언트에 토큰 노출 방지 — httpOnly 쿠키로만 관리
		const safeData = { ...data.data };
		delete safeData.tokens;
		return json({ ...data, data: safeData }, { status: res.status });
	}

	return json(data, { status: res.status });
};
