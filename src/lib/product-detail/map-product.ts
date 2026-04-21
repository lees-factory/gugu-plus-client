import type { ProductDetailData, ProductSku } from '$lib/api/products';
import type { TrackedItemDetailData, ProductSKUData } from '$lib/api/tracked-items';
import { marketToSite } from '$lib/commerce';

/** `sku_properties` JSON 객체에서 사용하는 키 (그 외 키는 무시) */
const PROP_COLOR = '색상';
const PROP_SIZE = '크기';

export type ParsedSku = {
	skuId: string;
	skuName: string;
	colorCode: string;
	size: string;
	price: number;
	originalPrice: number | null;
	image: string | null;
	/** 옵션 매칭용 (sku_properties 우선, 없으면 API color/size) */
	propColor: string | null;
	propSize: string | null;
	/** 해당 행에 `sku_properties` JSON이 있고 파싱됨 */
	propertiesFromJson: boolean;
	/** 초기 로드 시점의 가격 알림 활성 여부 (price_alert 없으면 false) */
	alertEnabled: boolean;
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
	/** sku_properties 기반 색상×크기 매트릭스 UI */
	variantMatrix: boolean;
	priceHistory: PriceEntry[];
};

export function parsePriceAmount(s: string): number {
	const n = Number(String(s).replace(/[^0-9.]/g, ''));
	return Number.isFinite(n) ? n : 0;
}

function skuImageFromApi(s: ProductSku): string | null {
	const u = (s.image_url && s.image_url.trim()) || '';
	return u.length > 0 ? u : null;
}

/**
 * `sku_properties` 파싱. 두 가지 형식 지원:
 * 1) JSON: `[{ "색상": "…", "크기": "…" }]`
 * 2) 세미콜론 구분: `"색상:Black;크기:XL"`
 */
function parseSkuProperties(raw: string | undefined | null): {
	color: string | null;
	size: string | null;
	ok: boolean;
} {
	if (raw == null || !String(raw).trim()) {
		return { color: null, size: null, ok: false };
	}
	const str = String(raw).trim();

	// JSON 형식 시도
	if (str.startsWith('[') || str.startsWith('{')) {
		try {
			const arr = JSON.parse(str) as unknown;
			if (!Array.isArray(arr) || arr.length === 0) return { color: null, size: null, ok: false };
			const obj = arr[0];
			if (!obj || typeof obj !== 'object') return { color: null, size: null, ok: false };
			const rec = obj as Record<string, unknown>;
			const c = rec[PROP_COLOR];
			const z = rec[PROP_SIZE];
			const color = typeof c === 'string' && c.trim() ? c.trim() : null;
			const size = typeof z === 'string' && z.trim() ? z.trim() : null;
			return { color, size, ok: true };
		} catch {
			return { color: null, size: null, ok: false };
		}
	}

	// 세미콜론 구분 형식: "색상:Black;크기:XL"
	const pairs = str.split(';');
	let color: string | null = null;
	let size: string | null = null;
	for (const pair of pairs) {
		const sep = pair.indexOf(':');
		if (sep < 0) continue;
		const key = pair.slice(0, sep).trim();
		const val = pair.slice(sep + 1).trim();
		if (!val) continue;
		if (key === PROP_COLOR) color = val;
		else if (key === PROP_SIZE) size = val;
	}
	if (color != null || size != null) return { color, size, ok: true };
	return { color: null, size: null, ok: false };
}

function parseSkusFromApi(skus: ProductSku[]): ParsedSku[] {
	return skus.map((s, i) => {
		const parts = s.sku_name.split(' / ').map((p) => p.trim());
		const colorFromName = parts[0] || 'Default';
		const colorCode = (s.color && s.color.trim()) || colorFromName;
		const size = (s.size && s.size.trim()) || parts[1] || '';
		const skuId = (s.id && String(s.id).trim()) || `__idx_${i}`;
		const skuName =
			(s.sku_name && s.sku_name.trim()) || `${colorCode}${size ? ' / ' + size : ''}` || skuId;

		// color/size 필드 우선, 없으면 sku_properties 파싱으로 폴백
		const apiColor = s.color?.trim() || null;
		const apiSize = s.size?.trim() || null;

		let propColor: string | null = apiColor;
		let propSize: string | null = apiSize;

		if (!propColor || !propSize) {
			const parsed = parseSkuProperties(s.sku_properties);
			if (parsed.ok) {
				propColor = propColor ?? parsed.color;
				propSize = propSize ?? parsed.size;
			}
		}

		// 표시 가격은 current_price (sku_price_snapshot 기반). 스펙상 required.
		return {
			skuId,
			skuName,
			colorCode,
			size,
			price: parsePriceAmount(s.current_price),
			originalPrice: s.original_price ? parsePriceAmount(s.original_price) : null,
			image: skuImageFromApi(s),
			propColor,
			propSize,
			propertiesFromJson: !!propColor || !!propSize,
			alertEnabled: s.price_alert?.enabled ?? false
		};
	});
}

/**
 * 일별 가격 추세(snapshot) → 차트용 PriceEntry[].
 * 입력은 매일 1포인트(가격 변동 없는 날도 포함). newest-first로 정렬해 반환한다.
 * change는 하루 전 포인트 대비 delta로 계산한다.
 */
export function mapPriceTrend(
	points: { date: string; price: string }[],
	fallbackPrice: string
): PriceEntry[] {
	if (!points?.length) {
		const p = parsePriceAmount(fallbackPrice);
		if (p <= 0) return [];
		return [{ date: '—', price: p, change: 0 }];
	}
	// 날짜 기준 내림차순 (newest-first) — PriceChart가 data.slice(0, n).reverse() 로 쓰기 때문
	const sorted = [...points].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
	return sorted.map((row, i) => {
		const price = parsePriceAmount(row.price);
		const older = sorted[i + 1];
		const change = older != null ? price - parsePriceAmount(older.price) : 0;
		const d = new Date(row.date);
		const label = Number.isNaN(d.getTime())
			? row.date
			: d.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
		return { date: label, price, change };
	});
}

/** 최신순 priceHistory (차트·표 공용) */
export function mapPriceHistories(
	hist: { price: string; recorded_at: string; change_value: string }[],
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

/**
 * SKU가 색상 또는 크기 옵션을 가지고 있으면 옵션 조합 UI를 사용한다.
 * sku_properties JSON 뿐 아니라 API의 color/size 필드도 인식한다.
 */
function hasVariantOptions(skus: ParsedSku[]): boolean {
	if (skus.length <= 1) return false;
	const hasColor = skus.some((s) => s.propColor != null && s.propColor !== '');
	const hasSize = skus.some((s) => s.propSize != null && s.propSize !== '');
	return hasColor || hasSize;
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

	// ProductDetailData에는 top-level current_price가 없다. skus[0].current_price에서 파생.
	const fallbackPriceStr = rawSkus?.[0]?.current_price ?? '';

	const skusParsed = rawSkus
		? parseSkusFromApi(rawSkus)
		: [
				{
					skuId: 'default',
					skuName: d.title?.trim() || 'Default',
					colorCode: 'Default',
					size: '',
					price: 0,
					originalPrice: null,
					image: d.main_image_url || null,
					propColor: null,
					propSize: null,
					propertiesFromJson: false,
					alertEnabled: false
				}
			];

	const variantMatrix = hasVariantOptions(skusParsed);
	const representativePrice = skusParsed[0]?.price ?? 0;

	return {
		trackedItemId: d.tracked_item_id ?? '',
		productId: d.product_id,
		title: d.title,
		site: marketToSite(d.market),
		imageUrl: d.main_image_url,
		url: d.promotion_link || d.product_url || d.original_url,
		currency: d.currency,
		lastChecked: '—',
		trackingFrequency: '24h',
		alertEnabled: d.is_tracked_by_user,
		alertThreshold: representativePrice,
		skus: skusParsed,
		variantMatrix,
		priceHistory: mapPriceHistories(d.price_histories ?? [], fallbackPriceStr)
	};
}

/** TrackedItemDetailData의 ProductSKUData → ProductSku 변환 */
function trackedSkuToProductSku(s: ProductSKUData): ProductSku {
	return {
		id: s.id,
		external_sku_id: s.external_sku_id,
		sku_name: s.sku_name,
		color: s.color,
		size: s.size,
		price: s.price,
		current_price: s.current_price,
		original_price: s.original_price,
		currency: s.currency,
		image_url: s.image_url,
		sku_properties: s.sku_properties,
		origin_sku_id: s.origin_sku_id,
		price_alert: s.price_alert
	};
}

/**
 * GET /v1/tracked-items/{id} 응답을 ItemDetail로 변환.
 * TrackedItemDetailData에는 price_histories가 없으므로 current_price 기반 단일 엔트리를 만든다.
 */
export function mapTrackedItemDetail(d: TrackedItemDetailData): ItemDetail {
	const rawSkus = d.skus && d.skus.length > 0 ? d.skus.map(trackedSkuToProductSku) : null;

	const topCurrentPrice = parsePriceAmount(d.current_price);

	const skusParsed = rawSkus
		? parseSkusFromApi(rawSkus)
		: [
				{
					skuId: 'default',
					skuName: d.title?.trim() || 'Default',
					colorCode: 'Default',
					size: '',
					price: topCurrentPrice,
					originalPrice: null,
					image: d.main_image_url || null,
					propColor: null,
					propSize: null,
					propertiesFromJson: false,
					alertEnabled: false
				}
			];

	const variantMatrix = hasVariantOptions(skusParsed);

	// 선택 SKU 우선, 없으면 첫 SKU, 그것도 없으면 top-level current_price
	const selectedSku = d.sku_id ? skusParsed.find((s) => s.skuId === d.sku_id) : undefined;
	const representativePrice = selectedSku?.price ?? skusParsed[0]?.price ?? topCurrentPrice;

	return {
		trackedItemId: d.tracked_item_id,
		productId: d.product_id,
		title: d.title,
		site: marketToSite(d.market),
		imageUrl: d.main_image_url,
		url: d.promotion_link || d.product_url || d.original_url,
		currency: d.currency,
		lastChecked: '—',
		trackingFrequency: '24h',
		alertEnabled: false,
		alertThreshold: representativePrice,
		skus: skusParsed,
		variantMatrix,
		priceHistory: [
			{
				date: new Date().toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' }),
				price: representativePrice,
				change: 0
			}
		]
	};
}
