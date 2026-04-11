import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { API_BASE } from '$lib/api/config.server';
import { bffFetch, BffNetworkError } from '$lib/api/bff-fetch';

/**
 * GET /api/v1/auth/sessions
 * 현재 로그인 사용자의 활성 세션 목록을 조회한다.
 * access_token이 만료되면 bffFetch가 refresh → 재시도까지 처리한다.
 */
export const GET: RequestHandler = async ({ cookies }) => {
	const accessToken = cookies.get('access_token');
	if (!accessToken) {
		return json({ error: { message: 'Unauthorized' } }, { status: 401 });
	}

	let res: Response;
	try {
		res = await bffFetch(
			`${API_BASE}/v1/auth/sessions`,
			{ headers: { Authorization: `Bearer ${accessToken}` } },
			cookies
		);
	} catch (e) {
		if (e instanceof BffNetworkError)
			return json({ error: { message: e.message } }, { status: 503 });
		throw e;
	}

	const data = await res.json().catch(() => ({}));
	return json(data, {
		status: res.status,
		headers: { 'Cache-Control': 'no-store' }
	});
};
