export type TrackedItem = {
	id: string
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
