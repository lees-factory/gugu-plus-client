import { apiGet } from './client';
import { ENDPOINTS } from './endpoints';
import type { PriceAlertStateData } from './tracked-items';

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
	/** legacy 원본 가격 */
	price: string;
	/** 현재 표시 가격 (sku_price_snapshot 기준) */
	current_price: string;
	original_price: string;
	currency: string;
	image_url: string;
	sku_properties?: string;
	origin_sku_id?: string;
	price_alert?: PriceAlertStateData;
};

export type ProductDetailData = {
	product_id: string;
	market: string;
	external_product_id: string;
	original_url: string;
	title: string;
	main_image_url: string;
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

export const productsApi = {
	get: (productId: string) =>
		apiGet<ProductDetailSuccessResponse>(ENDPOINTS.products.detail(productId)),

	listSkus: (productId: string) =>
		apiGet<ProductSkusListSuccessResponse>(ENDPOINTS.products.skus(productId))
};
