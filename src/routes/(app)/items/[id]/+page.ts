import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import type { TrackedItemDetailData, PriceAlertStateData } from '$lib/api/tracked-items';
import { ENDPOINTS } from '$lib/api/endpoints';

export const load: PageLoad = async ({ fetch, params, parent }) => {
	const { userEmail } = await parent();
	if (!userEmail) {
		redirect(303, '/auth/login');
	}

	const id = params.id;
	if (!id) {
		return {
			trackedItem: null as TrackedItemDetailData | null,
			alertState: null as PriceAlertStateData | null,
			error: 'item_id_missing'
		};
	}

	const res = await fetch(ENDPOINTS.trackedItems.detail(id));
	const json = (await res.json().catch(() => ({}))) as Record<string, unknown>;

	if (!res.ok) {
		const err = json?.error as { message?: string } | string | undefined;
		const msg =
			typeof err === 'object' && err?.message != null
				? String(err.message)
				: typeof err === 'string'
					? err
					: 'item_load_fail';
		return { trackedItem: null, alertState: null, error: msg };
	}

	const payload = json?.data;
	if (!payload || typeof payload !== 'object') {
		return { trackedItem: null, alertState: null, error: 'response_format_error' };
	}

	// 알림 상태 조회 (실패해도 상세 페이지는 표시)
	const alertRes = await fetch(ENDPOINTS.trackedItems.priceAlert(id)).catch(() => null);
	const alertJson = alertRes ? await alertRes.json().catch(() => ({})) : {};
	const alertState = (alertRes?.ok ? alertJson?.data ?? null : null) as PriceAlertStateData | null;

	return {
		trackedItem: payload as TrackedItemDetailData,
		alertState,
		error: null as string | null
	};
};
