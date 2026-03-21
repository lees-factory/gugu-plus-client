import type { ProductDetailData, ProductSku } from '$lib/api/products';

export type ParsedSku = {
	colorCode: string;
	size: string;
	price: number;
	originalPrice: number | null;
	image: string | null;
};

export type PriceEntry = { date: string; price: number; change: number };

export type ItemDetail = {
	trackedItemId: string;
	productId: string;
	title: string;
	site: string;
	imageUrl: string;
	url: string;
	currency: string;
	lastChecked: string;
	trackingFrequency: string;
	alertEnabled: boolean;
	alertThreshold: number;
	skus: ParsedSku[];
	priceHistory: PriceEntry[];
};

function marketToSite(market: string): string {
	const map: Record<string, string> = {
		ALIEXPRESS: 'AliExpress',
		AMAZON: 'Amazon',
		EBAY: 'eBay',
		TAOBAO: 'Taobao'
	};
	return map[market] ?? market;
}

export function parsePriceAmount(s: string): number {
	const n = Number(String(s).replace(/[^0-9.]/g, ''));
	return Number.isFinite(n) ? n : 0;
}

function parseSkusFromApi(skus: ProductSku[]): ParsedSku[] {
	return skus.map((s) => {
		const parts = s.sku_name.split(' / ').map((p) => p.trim());
		const colorFromName = parts[0] || 'Default';
		return {
			colorCode: (s.color && s.color.trim()) || colorFromName,
			size: (s.size && s.size.trim()) || parts[1] || '',
			price: parsePriceAmount(s.price),
			originalPrice: s.original_price ? parsePriceAmount(s.original_price) : null,
			image: s.image_url || null
		};
	});
}

/** 최신순 priceHistory (차트·표 공용) */
function mapPriceHistories(
	hist: ProductDetailData['price_histories'],
	fallbackPrice: string
): PriceEntry[] {
	if (!hist?.length) {
		const p = parsePriceAmount(fallbackPrice);
		if (p <= 0) return [];
		return [{ date: '—', price: p, change: 0 }];
	}
	const sorted = [...hist].sort(
		(a, b) => new Date(b.recorded_at).getTime() - new Date(a.recorded_at).getTime()
	);
	return sorted.map((row, i) => {
		const price = parsePriceAmount(row.price);
		const older = sorted[i + 1];
		const change =
			older != null
				? price - parsePriceAmount(older.price)
				: Number(String(row.change_value).replace(/[^0-9.-]/g, '')) || 0;
		return {
			date: new Date(row.recorded_at).toLocaleDateString('ko-KR', {
				month: 'short',
				day: 'numeric'
			}),
			price,
			change
		};
	});
}

export function formatDisplayPrice(n: number, currency: string): string {
	const code = currency?.length === 3 ? currency.toUpperCase() : 'KRW';
	try {
		return new Intl.NumberFormat('ko-KR', {
			style: 'currency',
			currency: code,
			maximumFractionDigits: 0
		}).format(n);
	} catch {
		return `${n.toLocaleString('ko-KR')} ${currency}`;
	}
}

/**
 * `skusFromDedicatedApi` — GET /v1/products/{id}/skus 결과가 있으면 우선 사용,
 * 없으면 상세 응답의 `d.skus`, 그것도 없으면 현재가 기준 단일 옵션.
 */
export function mapProductDetail(
	d: ProductDetailData,
	skusFromDedicatedApi?: ProductSku[] | null
): ItemDetail {
	const rawSkus =
		skusFromDedicatedApi && skusFromDedicatedApi.length > 0
			? skusFromDedicatedApi
			: d.skus && d.skus.length > 0
				? d.skus
				: null;

	const skusParsed = rawSkus
		? parseSkusFromApi(rawSkus)
		: [
				{
					colorCode: 'Default',
					size: '',
					price: parsePriceAmount(d.current_price),
					originalPrice: null,
					image: d.main_image_url || null
				}
			];

	return {
		trackedItemId: d.tracked_item_id,
		productId: d.product_id,
		title: d.title,
		site: marketToSite(d.market),
		imageUrl: d.main_image_url,
		url: d.product_url || d.original_url,
		currency: d.currency,
		lastChecked: '—',
		trackingFrequency: '24h',
		alertEnabled: d.is_tracked_by_user,
		alertThreshold: parsePriceAmount(d.current_price),
		skus: skusParsed,
		priceHistory: mapPriceHistories(d.price_histories ?? [], d.current_price)
	};
}
