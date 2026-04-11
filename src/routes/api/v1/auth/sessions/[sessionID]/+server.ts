import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { API_BASE } from '$lib/api/config.server';
import { bffFetch, BffNetworkError } from '$lib/api/bff-fetch';

/**
 * DELETE /api/v1/auth/sessions/[sessionID]
 * 현재 로그인 사용자의 특정 세션을 종료(revoke)한다.
 */
export const DELETE: RequestHandler = async ({ params, cookies }) => {
	const accessToken = cookies.get('access_token');
	if (!accessToken) {
		return json({ error: { message: 'Unauthorized' } }, { status: 401 });
	}

	const sessionID = params.sessionID;
	if (!sessionID) {
		return json({ error: { message: 'sessionID is required' } }, { status: 400 });
	}

	const target = `${API_BASE}/v1/auth/sessions/${encodeURIComponent(sessionID)}`;

	let res: Response;
	try {
		res = await bffFetch(
			target,
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
