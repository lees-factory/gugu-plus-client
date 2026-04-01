import { apiGet } from './client';
import { ENDPOINTS } from './endpoints';

export type HotProductData = {
	product_id: string;
	market: string;
	title: string;
	main_image_url: string;
	current_price: string;
	currency: string;
	product_url: string;
};

export type HotProductsResponse = {
	result: string;
	data: HotProductData[];
};

export const discoverApi = {
	hotProducts: (page = 1, size = 20) =>
		apiGet<HotProductsResponse>(
			`${ENDPOINTS.discover.hotProducts}?page=${page}&size=${size}`
		)
};
