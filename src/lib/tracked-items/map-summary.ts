import type { TrackedItemSummary } from '$lib/api/tracked-items';
import type { TrackedItem } from '$lib/types';
import { marketToSite } from '$lib/commerce';
import { parsePriceAmount } from '$lib/product-detail/map-product';

function numFromMaybeString(v: string | undefined | null): number | null {
	if (v == null || !String(v).trim()) return null;
	const n = parsePriceAmount(String(v));
	return Number.isFinite(n) && n >= 0 ? n : null;
}

function trendPercentFromSummary(s: TrackedItemSummary): number | null {
	const raw = s.price_change_percent ?? s.change_percent ?? s.last_change_percent;
	if (raw == null || !String(raw).trim()) return null;
	const n = Number(String(raw).replace(/[^0-9.-]/g, ''));
	return Number.isFinite(n) ? n : null;
}

export function summaryToCard(s: TrackedItemSummary): TrackedItem {
	const currentPrice = numFromMaybeString(s.current_price);
	const currency = s.currency?.trim() || '₩';

	let targetPrice: number | null = null;
	if (s.target_price != null) targetPrice = numFromMaybeString(s.target_price);
	if (targetPrice == null && s.alert_threshold != null)
		targetPrice = numFromMaybeString(s.alert_threshold);
	if (targetPrice == null && s.alert_price != null) targetPrice = numFromMaybeString(s.alert_price);

	let progressPct: number | null = null;
	if (currentPrice != null && targetPrice != null && currentPrice > 0 && targetPrice > 0) {
		if (currentPrice <= targetPrice) progressPct = 100;
		else progressPct = Math.min(100, Math.round((targetPrice / currentPrice) * 100));
	}

	const trendPct = trendPercentFromSummary(s);

	return {
		id: s.tracked_item_id,
		productId: s.product_id ?? s.tracked_item_id,
		title: s.title,
		site: marketToSite(s.market),
		imageUrl: s.main_image_url,
		currentPrice,
		currency,
		targetPrice,
		progressPct,
		trendPct
	};
}
