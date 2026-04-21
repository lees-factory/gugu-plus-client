import { goto, invalidate } from '$app/navigation';
import { resolve } from '$app/paths';
import { SvelteSet, SvelteMap, SvelteDate } from 'svelte/reactivity';
import { t } from '$lib/i18n/t';
import {
	mapTrackedItemDetail,
	mapPriceTrend,
	type ParsedSku,
	type PriceEntry
} from '$lib/product-detail/map-product';
import { formatPrice } from '$lib/utils/format-price';
import type { TrackedItemDetailData } from '$lib/api/tracked-items';
import { trackedItemsApi } from '$lib/api/tracked-items';

const SIZE_ORDER = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'XXXXL', '4XL', '5XL'];

function getSizeRank(size: string): number {
	const parts = size.toUpperCase().trim().split(/\s+/);
	const last = parts[parts.length - 1];
	const idx = SIZE_ORDER.indexOf(last);
	return idx >= 0 ? idx : 999;
}

const SITE_COLORS: Record<string, { bg: string; text: string }> = {
	AliExpress: { bg: '#fee8e8', text: '#c93232' }
};

export type MatrixColorOption = { value: string; image: string | null };

export function createItemDetailPage(
	getTrackedItem: () => TrackedItemDetailData | null | undefined
) {
	const item = $derived.by(() => {
		const raw = getTrackedItem();
		return raw ? mapTrackedItemDetail(raw) : null;
	});

	const ui = $state({
		selectedSkuId: '',
		propColor: '',
		propSize: '',
		alertLoading: false,
		alertError: '',
		imgError: false,
		deleting: false
	});

	let skuPriceHistory = $state<PriceEntry[]>([]);
	let historyLoading = $state(false);
	const historyCache = new SvelteMap<string, PriceEntry[]>();

	// 사용자가 이번 세션에서 토글한 SKU의 최신 상태만 담는 override 캐시.
	// 초기값은 ParsedSku.alertEnabled(서버 응답)에서 동기적으로 읽는다.
	// map을 seed에 쓰지 않는 이유: $effect는 첫 렌더 이후 실행되므로 OFF→ON 플리커가 생긴다.
	const alertStateBySku = new SvelteMap<string, boolean>();
	let lastTrackedItemIdForAlertCache = '';

	let prevProductId = $state('');

	const needColor = $derived(
		!!item && item.skus.some((s) => s.propColor != null && s.propColor !== '')
	);
	const needSize = $derived(
		!!item && item.skus.some((s) => s.propSize != null && s.propSize !== '')
	);

	/** 컬러가 1종인데 이미지가 여러 종 → 이미지(디자인)로 그룹핑 */
	const groupByImage = $derived.by(() => {
		if (!item?.variantMatrix) return false;
		const uniqueColors = new SvelteSet(item.skus.map((s) => s.propColor).filter(Boolean));
		if (uniqueColors.size > 1) return false;
		const uniqueImages = new SvelteSet(item.skus.map((s) => s.image).filter(Boolean));
		return uniqueImages.size > 1;
	});

	const matrixColorOptions = $derived.by<MatrixColorOption[]>(() => {
		if (!item?.variantMatrix) return [];

		if (groupByImage) {
			const seen = new SvelteSet<string>();
			const opts: MatrixColorOption[] = [];
			for (const s of item.skus) {
				const img = s.image;
				if (!img || seen.has(img)) continue;
				seen.add(img);
				opts.push({ value: img, image: img });
			}
			return opts;
		}

		const seen = new SvelteSet<string>();
		const opts: MatrixColorOption[] = [];
		for (const s of item.skus) {
			const v = s.propColor;
			if (!v || seen.has(v)) continue;
			seen.add(v);
			const img = s.image ?? item.skus.find((x) => x.propColor === v && x.image)?.image ?? null;
			opts.push({ value: v, image: img });
		}
		return opts;
	});

	const effectivePropColor = $derived.by(() => {
		if (groupByImage) return ui.propColor || item?.skus[0]?.image || '';
		return ui.propColor || item?.skus[0]?.propColor || '';
	});

	const matrixSizeOptions = $derived.by(() => {
		if (!item?.variantMatrix || !needSize) return [] as string[];
		const sizes = item.skus.map((s) => s.propSize).filter((x): x is string => !!x && x !== '');
		const uniq = [...new SvelteSet(sizes)];
		uniq.sort((a, b) => {
			const ra = getSizeRank(a);
			const rb = getSizeRank(b);
			if (ra !== rb) return ra - rb;
			return a.localeCompare(b, 'ko', { numeric: true });
		});
		return uniq;
	});

	const availableSizesForColor = $derived.by(() => {
		if (!item?.variantMatrix || !needSize) return new SvelteSet<string>();
		if (!needColor && !groupByImage) return new SvelteSet(matrixSizeOptions);

		const filtered = groupByImage
			? item.skus.filter((s) => s.image === effectivePropColor)
			: item.skus.filter((s) => s.propColor === effectivePropColor);

		return new SvelteSet(
			filtered.map((s) => s.propSize).filter((x): x is string => !!x && x !== '')
		);
	});

	const effectivePropSize = $derived.by(() => {
		if (!item?.variantMatrix || !needSize) return ui.propSize;
		const available = [...availableSizesForColor];
		if (available.length === 0) return matrixSizeOptions[0] ?? ui.propSize;
		if (available.includes(ui.propSize)) return ui.propSize;
		return available[0];
	});

	const showColorRow = $derived(
		!!item?.variantMatrix && (needColor || groupByImage) && matrixColorOptions.length > 1
	);
	const showSizeRow = $derived(!!item?.variantMatrix && needSize && matrixSizeOptions.length > 1);

	const showMatrixPanel = $derived(
		!!item?.variantMatrix && item.skus.length > 1 && (showColorRow || showSizeRow)
	);

	const showFlatPanel = $derived(!!item && !item.variantMatrix && item.skus.length > 1);

	const showFlatMatrixFallback = $derived(
		!!item?.variantMatrix && item.skus.length > 1 && !showColorRow && !showSizeRow
	);

	$effect(() => {
		if (!item) return;
		if (item.productId !== prevProductId) {
			prevProductId = item.productId;
			const first = item.skus[0];
			if (item.variantMatrix) {
				ui.propColor = groupByImage ? (first.image ?? '') : (first.propColor ?? '');
				ui.propSize = first.propSize ?? '';
			}
			ui.selectedSkuId = first?.skuId ?? '';
		}
	});

	// trackedItem이 교체되면 override 캐시를 버리고 새 서버 상태에 맡긴다.
	$effect(() => {
		if (!item) return;
		if (lastTrackedItemIdForAlertCache === item.trackedItemId) return;
		lastTrackedItemIdForAlertCache = item.trackedItemId;
		alertStateBySku.clear();
	});

	$effect(() => {
		if (!item?.skus.length) return;
		if (item.variantMatrix && !showFlatMatrixFallback) return;
		const valid = item.skus.some((s) => s.skuId === ui.selectedSkuId);
		if (!valid) {
			ui.selectedSkuId = item.skus[0]?.skuId ?? '';
		}
	});

	const currentSku = $derived.by<ParsedSku | null>(() => {
		if (!item) return null;
		if (item.skus.length === 1) return item.skus[0];

		if (item.variantMatrix && showFlatMatrixFallback) {
			const byId = item.skus.find((s) => s.skuId === ui.selectedSkuId);
			return byId ?? item.skus[0];
		}

		if (item.variantMatrix) {
			const match = item.skus.find((s) => {
				if (groupByImage) {
					if (!s.image || s.image !== effectivePropColor) return false;
				} else if (needColor) {
					if (s.propColor == null || s.propColor === '') return false;
					if (s.propColor !== effectivePropColor) return false;
				}
				if (needSize) {
					if (s.propSize == null || s.propSize === '') return false;
					if (s.propSize !== effectivePropSize) return false;
				}
				return true;
			});
			return match ?? item.skus[0];
		}

		const byId = item.skus.find((s) => s.skuId === ui.selectedSkuId);
		return byId ?? item.skus[0];
	});

	// override 캐시에 값이 있으면 그 값을, 없으면 서버가 내려준 ParsedSku.alertEnabled를 쓴다.
	// 이렇게 해야 첫 렌더부터 동기적으로 올바른 값이 찍혀 SKU 전환 시 OFF→ON 플리커가 없다.
	const alertEnabled = $derived.by(() => {
		const sku = currentSku;
		if (!sku?.skuId) return false;
		const override = alertStateBySku.get(sku.skuId);
		return override ?? sku.alertEnabled;
	});

	const displayImage = $derived.by(() => {
		if (!item) return '';
		const sku = currentSku;
		if (sku?.image) return sku.image;
		return item.imageUrl ?? '';
	});

	const displayPrice = $derived(currentSku?.price ?? 0);
	const originalPrice = $derived(currentSku?.originalPrice ?? null);
	const discountPct = $derived(
		originalPrice && originalPrice > displayPrice
			? Math.round((1 - displayPrice / originalPrice) * 100)
			: null
	);

	let prevDisplayImage = '';
	$effect(() => {
		const img = displayImage;
		if (img !== prevDisplayImage) {
			prevDisplayImage = img;
			ui.imgError = false;
		}
	});

	// SKU 변경 시 일별 가격 추세(snapshot) fetch — B안: 최장 구간(180일)을 한 번에 받아놓고
	// 차트 모델의 기간 탭은 로컬 slice로 처리한다. 캐시 우선.
	$effect(() => {
		const sku = currentSku;
		const trackedItemId = item?.trackedItemId;
		const currency = item?.currency;
		if (!sku || !trackedItemId || sku.skuId === 'default') {
			skuPriceHistory = item?.priceHistory ?? [];
			return;
		}

		const cacheKey = `${trackedItemId}:${sku.skuId}`;
		const cached = historyCache.get(cacheKey);
		if (cached) {
			skuPriceHistory = cached;
			return;
		}

		const to = new SvelteDate();
		const from = new SvelteDate();
		from.setDate(from.getDate() - 179); // 오늘 포함 180일
		const toYmd = to.toISOString().slice(0, 10);
		const fromYmd = from.toISOString().slice(0, 10);

		historyLoading = true;
		trackedItemsApi
			.getSkuPriceTrend(trackedItemId, {
				sku_id: sku.skuId,
				from: fromYmd,
				to: toYmd,
				currency
			})
			.then((res) => {
				if (res.error || !res.data) {
					skuPriceHistory = item?.priceHistory ?? [];
					return;
				}
				const points = res.data.data?.points ?? [];
				const mapped = mapPriceTrend(points, String(sku.price));
				const result = mapped.length > 0 ? mapped : (item?.priceHistory ?? []);
				historyCache.set(cacheKey, result);
				skuPriceHistory = result;
			})
			.catch(() => {
				skuPriceHistory = item?.priceHistory ?? [];
			})
			.finally(() => {
				historyLoading = false;
			});
	});

	type PriceInsight = {
		level: 'good' | 'normal' | 'high';
		percentile: number;
		vsAvg: number;
		vsMin: number;
		minPrice: number;
		maxPrice: number;
		avgPrice: number;
		allSame: boolean;
	};

	const priceInsight = $derived.by<PriceInsight | null>(() => {
		if (!item || skuPriceHistory.length <= 1) return null;

		const prices = skuPriceHistory.map((e) => e.price).filter((p) => p > 0);
		if (prices.length <= 1) return null;

		const minPrice = Math.min(...prices);
		const maxPrice = Math.max(...prices);
		const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;

		const range = maxPrice - minPrice;
		// 변동 폭이 평균의 2% 미만이면 사실상 변화 없음으로 취급한다.
		// percentile이 극단에 치우쳐도 vsAvg는 0에 수렴해 두 문구가 충돌하는 문제 방지.
		const allSame = minPrice === maxPrice || (avgPrice > 0 && range / avgPrice < 0.02);

		const current = displayPrice > 0 ? displayPrice : prices[0];
		const percentile = allSame ? 50 : Math.round(((current - minPrice) / range) * 100);
		const vsAvg = avgPrice > 0 ? Math.round(((current - avgPrice) / avgPrice) * 100) : 0;
		const vsMin = minPrice > 0 ? Math.round(((current - minPrice) / minPrice) * 100) : 0;

		let level: 'good' | 'normal' | 'high';
		if (allSame) level = 'normal';
		else if (percentile <= 30) level = 'good';
		else if (percentile >= 70) level = 'high';
		else level = 'normal';

		return { level, percentile, vsAvg, vsMin, minPrice, maxPrice, avgPrice, allSame };
	});

	const siteBadgeStyle = $derived(
		SITE_COLORS[item?.site ?? ''] ?? { bg: '#f7f6f3', text: '#6b6b65' }
	);

	const hasSkuList = $derived(showFlatPanel || showFlatMatrixFallback);

	function selectSku(skuId: string) {
		ui.selectedSkuId = skuId;
	}

	function selectMatrixColor(value: string) {
		ui.propColor = value;
	}

	function selectMatrixSize(value: string) {
		ui.propSize = value;
	}

	async function toggleAlert() {
		const sku = currentSku;
		const skuId = sku?.skuId;
		if (!skuId || ui.alertLoading) return;
		const current = alertStateBySku.get(skuId) ?? sku?.alertEnabled ?? false;
		ui.alertLoading = true;
		ui.alertError = '';
		try {
			if (current) {
				const res = await trackedItemsApi.unregisterPriceAlert(skuId);
				if (res.error) {
					ui.alertError = t('alert_toggle_fail');
				} else {
					alertStateBySku.set(skuId, false);
				}
			} else {
				const res = await trackedItemsApi.registerPriceAlert(skuId);
				if (res.error) {
					ui.alertError = t('alert_toggle_fail');
				} else {
					alertStateBySku.set(skuId, true);
				}
			}
		} finally {
			ui.alertLoading = false;
		}
	}

	function onImageError() {
		ui.imgError = true;
	}

	let confirmDeleteOpen = $state(false);

	function handleDelete() {
		confirmDeleteOpen = true;
	}

	function cancelDelete() {
		confirmDeleteOpen = false;
	}

	async function confirmDelete() {
		confirmDeleteOpen = false;
		if (!item?.trackedItemId) return;
		ui.deleting = true;
		try {
			const res = await trackedItemsApi.deleteItem(item.trackedItemId);
			if (res.error) return;
			await invalidate('app:tracked-items');
			await goto(resolve('/items'));
		} finally {
			ui.deleting = false;
		}
	}

	function fmt(n: number) {
		return item ? formatPrice(n, item.currency) : String(n);
	}

	return {
		get item() {
			return item;
		},
		ui,
		get alertEnabled() {
			return alertEnabled;
		},
		get effectivePropColor() {
			return effectivePropColor;
		},
		get effectivePropSize() {
			return effectivePropSize;
		},
		get needColor() {
			return needColor;
		},
		get groupByImage() {
			return groupByImage;
		},
		get needSize() {
			return needSize;
		},
		get matrixColorOptions() {
			return matrixColorOptions;
		},
		get matrixSizeOptions() {
			return matrixSizeOptions;
		},
		get availableSizesForColor() {
			return availableSizesForColor;
		},
		get showColorRow() {
			return showColorRow;
		},
		get showSizeRow() {
			return showSizeRow;
		},
		get showMatrixPanel() {
			return showMatrixPanel;
		},
		get showFlatPanel() {
			return showFlatPanel;
		},
		get showFlatMatrixFallback() {
			return showFlatMatrixFallback;
		},
		get hasSkuList() {
			return hasSkuList;
		},
		get currentSku() {
			return currentSku;
		},
		get displayImage() {
			return displayImage;
		},
		get displayPrice() {
			return displayPrice;
		},
		get originalPrice() {
			return originalPrice;
		},
		get discountPct() {
			return discountPct;
		},
		get priceInsight() {
			return priceInsight;
		},
		get siteBadgeStyle() {
			return siteBadgeStyle;
		},
		get skuPriceHistory() {
			return skuPriceHistory;
		},
		get historyLoading() {
			return historyLoading;
		},
		selectSku,
		selectMatrixColor,
		selectMatrixSize,
		get confirmDeleteOpen() {
			return confirmDeleteOpen;
		},
		toggleAlert,
		onImageError,
		handleDelete,
		cancelDelete,
		confirmDelete,
		fmt
	};
}
