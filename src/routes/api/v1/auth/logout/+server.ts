import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { API_BASE } from '$lib/api/config.server';

export const POST: RequestHandler = async ({ request, cookies }) => {
	const body = await request.text();

	let res: Response;
	try {
		res = await fetch(`${API_BASE}/v1/auth/logout`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body
		});
	} catch {
		// 백엔드 통신 실패해도 로컬 쿠키는 삭제
		cookies.delete('session', { path: '/' });
		cookies.delete('access_token', { path: '/' });
		cookies.delete('refresh_token', { path: '/' });
		cookies.delete('user_id', { path: '/' });
		return json({ error: { message: 'Cannot reach backend' } }, { status: 503 });
	}

	const data = await res.json().catch(() => ({}));

	if (res.ok) {
		cookies.delete('session', { path: '/' });
		cookies.delete('access_token', { path: '/' });
		cookies.delete('refresh_token', { path: '/' });
		cookies.delete('user_id', { path: '/' });
	}

	return json(data, { status: res.status });
};
