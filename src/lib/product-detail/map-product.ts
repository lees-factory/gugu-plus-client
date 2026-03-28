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
 * `[{ "색상": "…", "크기": "…" }]` 형태 문자열 파싱.
 * 키는 `색상` / `크기` 만 사용.
 */
function parseSkuPropertiesJson(raw: string | undefined | null): {
	color: string | null;
	size: string | null;
	ok: boolean;
} {
	if (raw == null || !String(raw).trim()) {
		return { color: null, size: null, ok: false };
	}
	try {
		const arr = JSON.parse(String(raw)) as unknown;
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

function parseSkusFromApi(skus: ProductSku[]): ParsedSku[] {
	return skus.map((s, i) => {
		const parts = s.sku_name.split(' / ').map((p) => p.trim());
		const colorFromName = parts[0] || 'Default';
		const colorCode = (s.color && s.color.trim()) || colorFromName;
		const size = (s.size && s.size.trim()) || parts[1] || '';
		const skuId = (s.id && String(s.id).trim()) || `__idx_${i}`;
		const skuName =
			(s.sku_name && s.sku_name.trim()) || `${colorCode}${size ? ' / ' + size : ''}` || skuId;

		const rawProps = s.sku_properties;
		const hasRaw = typeof rawProps === 'string' && rawProps.trim().length > 0;
		const parsed = hasRaw
			? parseSkuPropertiesJson(rawProps)
			: { color: null, size: null, ok: false };

		let propColor: string | null;
		let propSize: string | null;
		let propertiesFromJson: boolean;

		if (hasRaw && parsed.ok) {
			propertiesFromJson = true;
			propColor = parsed.color ?? (s.color?.trim() || null);
			propSize = parsed.size ?? (s.size?.trim() || null);
		} else {
			propertiesFromJson = false;
			propColor = s.color?.trim() || null;
			propSize = s.size?.trim() || null;
		}

		return {
			skuId,
			skuName,
			colorCode,
			size,
			price: parsePriceAmount(s.price),
			originalPrice: s.original_price ? parsePriceAmount(s.original_price) : null,
			image: skuImageFromApi(s),
			propColor,
			propSize,
			propertiesFromJson
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

	const skusParsed = rawSkus
		? parseSkusFromApi(rawSkus)
		: [
				{
					skuId: 'default',
					skuName: d.title?.trim() || 'Default',
					colorCode: 'Default',
					size: '',
					price: parsePriceAmount(d.current_price),
					originalPrice: null,
					image: d.main_image_url || null,
					propColor: null,
					propSize: null,
					propertiesFromJson: false
				}
			];

	const variantMatrix = hasVariantOptions(skusParsed);

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
		variantMatrix,
		priceHistory: mapPriceHistories(d.price_histories ?? [], d.current_price)
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
		original_price: s.original_price,
		currency: s.currency,
		image_url: s.image_url,
		sku_properties: s.sku_properties,
		origin_sku_id: s.origin_sku_id
	};
}

/**
 * GET /v1/tracked-items/{id} 응답을 ItemDetail로 변환.
 * TrackedItemDetailData에는 price_histories가 없으므로 current_price 기반 단일 엔트리를 만든다.
 */
export function mapTrackedItemDetail(
	d: TrackedItemDetailData,
	skusFromApi?: ProductSku[]
): ItemDetail {
	const rawSkus =
		skusFromApi && skusFromApi.length > 0
			? skusFromApi
			: d.skus && d.skus.length > 0
				? d.skus.map(trackedSkuToProductSku)
				: null;

	const skusParsed = rawSkus
		? parseSkusFromApi(rawSkus)
		: [
				{
					skuId: 'default',
					skuName: d.title?.trim() || 'Default',
					colorCode: 'Default',
					size: '',
					price: parsePriceAmount(d.current_price),
					originalPrice: null,
					image: d.main_image_url || null,
					propColor: null,
					propSize: null,
					propertiesFromJson: false
				}
			];

	const variantMatrix = hasVariantOptions(skusParsed);

	return {
		trackedItemId: d.tracked_item_id,
		productId: d.tracked_item_id,
		title: d.title,
		site: marketToSite(d.market),
		imageUrl: d.main_image_url,
		url: d.product_url || d.original_url,
		currency: d.currency,
		lastChecked: '—',
		trackingFrequency: '24h',
		alertEnabled: true,
		alertThreshold: parsePriceAmount(d.current_price),
		skus: skusParsed,
		variantMatrix,
		priceHistory: [{ date: '—', price: parsePriceAmount(d.current_price), change: 0 }]
	};
}
