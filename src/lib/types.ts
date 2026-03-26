export type TrackedItem = {
	/** tracked_item_id (삭제 등) */
	id: string
	/** 내부 product_id — 상세 경로 `/items/{productId}` */
	productId: string
	title: string
	site: string
	imageUrl: string
	/** 목록 API `current_price` 등 — 없으면 null */
	currentPrice: number | null
	currency: string
	targetPrice: number | null
	/** 목표가 대비 근접도(추정). current·target 모두 있을 때만 */
	progressPct: number | null
	/** 최근 가격 변동률(%) — 없으면 null */
	trendPct: number | null
}

import type { ParsedCommerceUrl } from '$lib/commerce/parse-product-url';

export type AddItemData = {
	url: string;
	frequency: string;
	commerce: ParsedCommerceUrl;
};
