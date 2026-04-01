import { apiDelete, apiGet, apiPatch, apiPost } from './client';
import { ENDPOINTS } from './endpoints';
import type { ProductMarket } from './market';

/** POST 요청의 items 배열 요소 (브라우저 → BFF) */
export type CreateTrackedItemEntry = {
	original_url: string;
	provider_commerce: ProductMarket;
	external_product_id: string;
	currency?: string;
};

/**
 * POST `/api/v1/tracked-items` 로 보내는 본문.
 * 한 번에 최대 5개까지 추가 가능. BFF가 `user_id` 쿠키로 채워 전달한다.
 */
export type CreateTrackedItemBody = {
	items: CreateTrackedItemEntry[];
};

/** 201 응답 개별 결과 */
export type AddTrackedItemResult = {
	tracked_item_id: string;
	already_tracked: boolean;
};

/** 201 응답 `data` */
export type AddTrackedItemData = {
	results: AddTrackedItemResult[];
	total: number;
	added: number;
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

/** 커서 기반 페이지네이션 목록 데이터 */
export type ListTrackedItemsPageData = {
	items: TrackedItemData[];
	next_cursor?: string;
	has_more: boolean;
};

export type ListTrackedItemsSuccessResponse = {
	result: string;
	data: ListTrackedItemsPageData;
};

export const trackedItemsApi = {
	/** 1~5개 상품을 한 번에 추가 */
	create: (items: CreateTrackedItemEntry[]) =>
		apiPost<CreateTrackedItemSuccessResponse>(ENDPOINTS.trackedItems.create, { items }),

	/** GET — 커서 기반 페이지네이션. BFF가 `user_id` 쿼리를 쿠키로 채움 */
	list: (params?: { cursor?: string; size?: number }) => {
		const base = ENDPOINTS.trackedItems.list;
		const qs = new URLSearchParams();
		if (params?.cursor) qs.set('cursor', params.cursor);
		if (params?.size) qs.set('size', String(params.size));
		const query = qs.toString();
		return apiGet<ListTrackedItemsSuccessResponse>(query ? `${base}?${query}` : base);
	},

	/** GET /{trackedItemID} — BFF가 `user_id` 쿼리를 쿠키로 채움 */
	getDetail: (trackedItemId: string) =>
		apiGet<TrackedItemDetailSuccessResponse>(ENDPOINTS.trackedItems.detail(trackedItemId)),

	/** DELETE — BFF가 `user_id` 쿼리를 쿠키로 채움 */
	deleteItem: (trackedItemId: string) =>
		apiDelete<TrackedItemEmptySuccessResponse>(ENDPOINTS.trackedItems.delete(trackedItemId)),

	selectSku: (trackedItemId: string, body: SelectTrackedItemSkuBody) =>
		apiPatch<TrackedItemEmptySuccessResponse>(ENDPOINTS.trackedItems.selectSku(trackedItemId), body)
};
