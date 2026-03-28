import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import type { TrackedItemDetailData } from '$lib/api/tracked-items';
import type { ProductSku } from '$lib/api/products';

export const load: PageLoad = async ({ fetch, params, parent }) => {
	const { userEmail } = await parent();
	if (!userEmail) {
		redirect(303, '/auth/login');
	}

	const id = params.id;
	if (!id) {
		return {
			trackedItem: null as TrackedItemDetailData | null,
			skus: null as ProductSku[] | null,
			error: '상품 ID가 없습니다.'
		};
	}

	// 1. tracked item 상세 조회
	const res = await fetch(`/api/v1/tracked-items/${encodeURIComponent(id)}`);
	const json = (await res.json().catch(() => ({}))) as Record<string, unknown>;
	console.log('🚀 ~ load ~ json:', json);

	if (!res.ok) {
		const err = json?.error as { message?: string } | string | undefined;
		const msg =
			typeof err === 'object' && err?.message != null
				? String(err.message)
				: typeof err === 'string'
					? err
					: '상품을 불러오지 못했습니다.';
		return { trackedItem: null, skus: null, error: msg };
	}

	const payload = json?.data;
	if (!payload || typeof payload !== 'object') {
		return { trackedItem: null, skus: null, error: '응답 형식이 올바르지 않습니다.' };
	}

	const trackedItem = payload as TrackedItemDetailData;

	// 2. SKU 별도 조회 (tracked_item_id = 내부 상품 ID)
	let skus: ProductSku[] | null = null;
	if (trackedItem.tracked_item_id) {
		const skuRes = await fetch(
			`/api/v1/products/${encodeURIComponent(trackedItem.tracked_item_id)}/skus`
		);
		if (skuRes.ok) {
			const skuJson = (await skuRes.json().catch(() => ({}))) as Record<string, unknown>;
			console.log('🚀 ~ load ~ skuJson:', skuJson);
			if (Array.isArray(skuJson?.data)) {
				skus = skuJson.data as ProductSku[];
			}
		}
	}

	return {
		trackedItem,
		skus,
		error: null as string | null
	};
};
