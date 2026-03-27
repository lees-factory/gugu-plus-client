import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { API_BASE } from '$lib/api/config';

export const DELETE: RequestHandler = async ({ params, cookies }) => {
	const accessToken = cookies.get('access_token');
	if (!accessToken) {
		throw error(401, 'Unauthorized');
	}

	const userId = cookies.get('user_id');
	if (!userId) {
		throw error(401, 'Unauthorized');
	}

	const id = params.trackedItemID;
	/** OpenAPI: `user_id` 쿼리 필수. 쿠키 값으로 넣어 클라이언트 위조 방지 */
	const qs = new URLSearchParams({ user_id: userId }).toString();
	const res = await fetch(`${API_BASE}/v1/tracked-items/${encodeURIComponent(id)}?${qs}`, {
		method: 'DELETE',
		headers: { Authorization: `Bearer ${accessToken}` }
	});

	const data = await res.json().catch(() => ({}));
	return json(data, { status: res.status });
};
