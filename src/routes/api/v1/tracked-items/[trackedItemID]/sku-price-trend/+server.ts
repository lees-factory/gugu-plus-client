import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { API_BASE } from '$lib/api/config.server';
import { bffFetch, BffNetworkError } from '$lib/api/bff-fetch';

/**
 * GET /api/v1/tracked-items/[trackedItemID]/sku-price-trend
 *
 * tracked item의 특정 SKU에 대한 일별 가격 추세를 조회한다.
 * source: sku_price_snapshot (매일 1포인트, 변동 없는 날도 포함)
 * 차트 X축이 일정한 라인 그래프를 그리기 위한 데이터 소스.
 *
 * Query
 *   - sku_id   (required)
 *   - from     (required, YYYY-MM-DD)
 *   - to       (required, YYYY-MM-DD)
 *   - currency (optional, tracked item 기본 통화 override)
 */
export const GET: RequestHandler = async ({ params, url, cookies }) => {
	const accessToken = cookies.get('access_token');
	if (!accessToken) {
		return json({ error: { message: 'Unauthorized' } }, { status: 401 });
	}

	const userId = cookies.get('user_id');
	if (!userId) {
		return json({ error: { message: 'Unauthorized' } }, { status: 401 });
	}

	const id = params.trackedItemID;

	const qs = new URLSearchParams(url.searchParams);
	qs.set('user_id', userId);
	const target = `${API_BASE}/v1/tracked-items/${encodeURIComponent(id)}/sku-price-trend?${qs}`;

	let res: Response;
	try {
		res = await bffFetch(target, { headers: { Authorization: `Bearer ${accessToken}` } }, cookies);
	} catch (e) {
		if (e instanceof BffNetworkError)
			return json({ error: { message: e.message } }, { status: 503 });
		throw e;
	}

	const data = await res.json().catch(() => ({}));
	return json(data, {
		status: res.status,
		headers: res.ok ? { 'Cache-Control': 'private, max-age=60' } : undefined
	});
};
