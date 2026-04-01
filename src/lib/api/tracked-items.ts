import { apiDelete, apiGet, apiPatch, apiPost } from './client';
import { ENDPOINTS } from './endpoints';
import type { ProductMarket } from './market';

/**
 * POST `/api/v1/tracked-items` 로 보내는 본문 (브라우저 → BFF).
 * 백엔드 OpenAPI는 `user_id`까지 요구하며, BFF가 `user_id` 쿠키로 채워 전달한다.
 */
export type CreateTrackedItemBody = {
	original_url: string;
	provider_commerce: ProductMarket;
	external_product_id: string;
};

/** 201 응답 `data` — AddTrackedItemData */
export type AddTrackedItemData = {
	tracked_item_id: string;
	already_tracked: boolean;
};

export type CreateTrackedItemSuccessResponse = {
	result: 'SUCCESS';
	data: AddTrackedItemData;
};

export type TrackedItemErrorResponse = {
	result: string;
	error: {
		code: string;
		message: string;
		data?: string;
	};
};

/** DELETE / PATCH sku 등 — `data` 없는 성공 (200) */
export type TrackedItemEmptySuccessResponse = {
	result: 'SUCCESS';
};

/** GET /v1/tracked-items/ — 목록 항목 (TrackedItemData) */
export type TrackedItemData = {
	tracked_item_id: string;
	product_id: string;
	market: ProductMarket;
	external_product_id: string;
	original_url: string;
	title: string;
	main_image_url: string;
	current_price: string;
	currency: string;
	product_url: string;
	promotion_link?: string | null;
};

/** GET /v1/tracked-items/{trackedItemID} — 상세 데이터 */
export type TrackedItemDetailData = {
	tracked_item_id: string;
	product_id: string;
	sku_id?: string;
	market: ProductMarket;
	external_product_id: string;
	original_url: string;
	title: string;
	main_image_url: string;
	current_price: string;
	currency: string;
	product_url: string;
	promotion_link?: string | null;
	skus: ProductSKUData[];
};

export type ProductSKUData = {
	id: string;
	external_sku_id: string;
	sku_name: string;
	color: string;
	size: string;
	price: string;
	original_price: string;
	currency: string;
	image_url: string;
	origin_sku_id?: string;
	sku_properties?: string;
};

export type TrackedItemDetailSuccessResponse = {
	result: 'SUCCESS';
	data: TrackedItemDetailData;
};

/** PATCH /v1/tracked-items/{trackedItemID}/sku 요청 본문 (BFF가 user_id 주입) */
export type SelectTrackedItemSkuBody = {
	sku_id: string;
};

export type ListTrackedItemsSuccessResponse = {
	result: string;
	data: TrackedItemData[];
};

export const trackedItemsApi = {
	create: (body: CreateTrackedItemBody) =>
		apiPost<CreateTrackedItemSuccessResponse>(ENDPOINTS.trackedItems.create, body),

	/** GET — BFF가 `user_id` 쿼리를 쿠키로 채움 */
	list: () => apiGet<ListTrackedItemsSuccessResponse>(ENDPOINTS.trackedItems.list),

	/** GET /{trackedItemID} — BFF가 `user_id` 쿼리를 쿠키로 채움 */
	getDetail: (trackedItemId: string) =>
		apiGet<TrackedItemDetailSuccessResponse>(ENDPOINTS.trackedItems.detail(trackedItemId)),

	/** DELETE — BFF가 `user_id` 쿼리를 쿠키로 채움 */
	deleteItem: (trackedItemId: string) =>
		apiDelete<TrackedItemEmptySuccessResponse>(ENDPOINTS.trackedItems.delete(trackedItemId)),

	selectSku: (trackedItemId: string, body: SelectTrackedItemSkuBody) =>
		apiPatch<TrackedItemEmptySuccessResponse>(ENDPOINTS.trackedItems.selectSku(trackedItemId), body)
};
