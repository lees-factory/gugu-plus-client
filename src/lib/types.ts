export type TrackedItem = {
	/** tracked_item_id (삭제 등) */
	id: string
	/** 내부 product_id — 상세 경로 `/items/{productId}` */
	productId: string
	title: string
	site: string
	imageUrl: string
}

import type { ParsedCommerceUrl } from '$lib/commerce/parse-product-url';

export type AddItemData = {
	url: string;
	frequency: string;
	commerce: ParsedCommerceUrl;
};
