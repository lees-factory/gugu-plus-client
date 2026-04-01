import { apiGet, apiPost, apiDelete } from './client';
import { ENDPOINTS } from './endpoints';

export type ProductPriceHistory = {
	price: string;
	currency: string;
	recorded_at: string;
	change_value: string;
};

export type ProductSku = {
	id: string;
	external_sku_id: string;
	sku_name: string;
	color: string;
	size: string;
	price: string;
	original_price: string;
	currency: string;
	image_url: string;
	sku_properties?: string;
	origin_sku_id?: string;
};

export type ProductDetailData = {
	product_id: string;
	market: string;
	external_product_id: string;
	original_url: string;
	title: string;
	main_image_url: string;
	current_price: string;
	currency: string;
	product_url: string;
	promotion_link?: string | null;
	is_tracked_by_user: boolean;
	tracked_item_id?: string | null;
	price_histories: ProductPriceHistory[];
	skus: ProductSku[];
};

export type ProductDetailSuccessResponse = {
	result: string;
	data: ProductDetailData;
};

export type ProductSkusListSuccessResponse = {
	result: string;
	data: ProductSku[];
};

export type PriceAlertData = {
	id: string;
	product_id: string;
	channel: string;
	enabled: boolean;
	created_at: string;
};

export type PriceAlertResponse = {
	result: string;
	data: PriceAlertData;
};

export type SuccessResponse = {
	result: string;
};

export type ListPriceAlertsResponse = {
	result: string;
	data: PriceAlertData[];
};

export const alertsApi = {
	list: () => apiGet<ListPriceAlertsResponse>(ENDPOINTS.alerts.list)
};

export const productsApi = {
	get: (productId: string) =>
		apiGet<ProductDetailSuccessResponse>(ENDPOINTS.products.detail(productId)),

	listSkus: (productId: string) =>
		apiGet<ProductSkusListSuccessResponse>(ENDPOINTS.products.skus(productId)),

	registerAlert: (productId: string) =>
		apiPost<PriceAlertResponse>(ENDPOINTS.products.alert(productId), { channel: 'EMAIL' }),

	unregisterAlert: (productId: string) =>
		apiDelete<SuccessResponse>(ENDPOINTS.products.alert(productId))
};
