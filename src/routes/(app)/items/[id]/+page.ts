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
					: 'item_lad_fail';
		return { trackedItem: null, alertState: null, error: msg };
	}

	const payload = json?.data;
	if (!payload || typeof payload !== 'object') {
		return { trackedItem: null, alertState: null, error: 'response_format_error' };
	}

	const trackedItem = payload as TrackedItemDetailData;

	// 알림 상태 조회 (실패해도 상세 페이지는 표시)
	// 신 스펙: skuID가 path 필수. 선택 SKU 없으면 호출 스킵.
	let alertState: PriceAlertStateData | null = null;
	const selectedSkuId = trackedItem.sku_id;
	if (selectedSkuId) {
		const alertRes = await fetch(ENDPOINTS.skus.priceAlert(selectedSkuId)).catch(() => null);
		if (alertRes?.ok) {
			const alertJson = (await alertRes.json().catch(() => ({}))) as Record<string, unknown>;
			alertState = (alertJson?.data ?? null) as PriceAlertStateData | null;
		}
	}

	return {
		trackedItem,
		alertState,
		error: null as string | null
	};
};
