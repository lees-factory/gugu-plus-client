import type { ParsedCommerceUrl } from '$lib/commerce/parse-product-url';

export type TrackedItem = {
	/** tracked_item_id (삭제 등) */
	id: string;
	/** 내부 product_id — 상세 경로 `/items/{productId}` */
	productId: string;
	title: string;
	site: string;
	imageUrl: string;
	/** 목록 API `current_price` — 없으면 null */
	currentPrice: number | null;
	currency: string;
};

export type AddItemEntry = {
	url: string;
	commerce: ParsedCommerceUrl;
};
