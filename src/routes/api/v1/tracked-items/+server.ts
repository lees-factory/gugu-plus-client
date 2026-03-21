import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { API_BASE } from '$lib/api/config';

export const GET: RequestHandler = async ({ url, cookies }) => {
	const accessToken = cookies.get('access_token');
	if (!accessToken) {
		throw error(401, 'Unauthorized');
	}

	const userId = cookies.get('user_id');
	if (!userId) {
		throw error(401, 'Unauthorized');
	}

	/** OpenAPI: `user_id` 쿼리 필수. 쿠키 값으로 넣어 클라이언트 위조 방지 */
	const params = new URLSearchParams(url.searchParams);
	params.set('user_id', userId);
	const qs = params.toString();
	const target = `${API_BASE}/v1/tracked-items/${qs ? `?${qs}` : ''}`;

	const res = await fetch(target, {
		headers: { Authorization: `Bearer ${accessToken}` }
	});

	const data = await res.json().catch(() => ({}));
	return json(data, { status: res.status });
};

export const POST: RequestHandler = async ({ request, cookies }) => {
	const accessToken = cookies.get('access_token');
	if (!accessToken) {
		throw error(401, 'Unauthorized');
	}

	const userId = cookies.get('user_id');
	if (!userId) {
		throw error(401, 'Unauthorized');
	}

	let parsed: Record<string, unknown>;
	try {
		parsed = JSON.parse(await request.text()) as Record<string, unknown>;
	} catch {
		throw error(400, 'Invalid JSON');
	}

	/** OpenAPI: 본문에 `user_id` 포함. 클라이언트가 보내더라도 서버 쿠키 값으로 덮어써 위조 방지 */
	const body = JSON.stringify({ ...parsed, user_id: userId });

	const res = await fetch(`${API_BASE}/v1/tracked-items/`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${accessToken}`
		},
		body
	});

	const data = await res.json().catch(() => ({}));
	return json(data, { status: res.status });
};
