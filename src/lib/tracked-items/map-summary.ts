import type { TrackedItemData } from '$lib/api/tracked-items';
import type { TrackedItem } from '$lib/types';
import { marketToSite } from '$lib/commerce';
import { parsePriceAmount } from '$lib/product-detail/map-product';

function numFromMaybeString(v: string | undefined | null): number | null {
	if (v == null || !String(v).trim()) return null;
	const n = parsePriceAmount(String(v));
	return Number.isFinite(n) && n >= 0 ? n : null;
}

export function summaryToCard(s: TrackedItemData): TrackedItem {
	const currentPrice = numFromMaybeString(s.current_price);
	const currency = s.currency?.trim() || '₩';

	return {
		id: s.tracked_item_id,
		productId: s.product_id,
		title: s.title,
		site: marketToSite(s.market),
		imageUrl: s.main_image_url,
		currentPrice,
		currency
	};
}
