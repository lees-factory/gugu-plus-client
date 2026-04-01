import { goto } from '$app/navigation';
import { resolve } from '$app/paths';
import { t } from '$lib/i18n/t';
import {
	mapTrackedItemDetail,
	formatDisplayPrice,
	type ParsedSku
} from '$lib/product-detail/map-product';
import type { TrackedItemDetailData } from '$lib/api/tracked-items';
import { trackedItemsApi } from '$lib/api/tracked-items';
import { invalidateTrackedItemsCache } from '$lib/api/tracked-items-cache';
import { productsApi } from '$lib/api/products';

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
		alertEnabled: false,
		alertLoading: false,
		imgError: false,
		deleting: false
	});

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
		const uniqueColors = new Set(item.skus.map((s) => s.propColor).filter(Boolean));
		if (uniqueColors.size > 1) return false;
		const uniqueImages = new Set(item.skus.map((s) => s.image).filter(Boolean));
		return uniqueImages.size > 1;
	});

	const matrixColorOptions = $derived.by<MatrixColorOption[]>(() => {
		if (!item?.variantMatrix) return [];

		if (groupByImage) {
			const seen = new Set<string>();
			const opts: MatrixColorOption[] = [];
			for (const s of item.skus) {
				const img = s.image;
				if (!img || seen.has(img)) continue;
				seen.add(img);
				opts.push({ value: img, image: img });
			}
			return opts;
		}

		const seen = new Set<string>();
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
		const uniq = [...new Set(sizes)];
		uniq.sort((a, b) => {
			const ra = getSizeRank(a);
			const rb = getSizeRank(b);
			if (ra !== rb) return ra - rb;
			return a.localeCompare(b, 'ko', { numeric: true });
		});
		return uniq;
	});

	const availableSizesForColor = $derived.by(() => {
		if (!item?.variantMatrix || !needSize) return new Set<string>();
		if (!needColor && !groupByImage) return new Set(matrixSizeOptions);

		const filtered = groupByImage
			? item.skus.filter((s) => s.image === effectivePropColor)
			: item.skus.filter((s) => s.propColor === effectivePropColor);

		return new Set(
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
		ui.alertEnabled = item.alertEnabled;
		ui.imgError = false;
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

	$effect(() => {
		void displayImage;
		ui.imgError = false;
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
		if (!item || item.priceHistory.length <= 1) return null;

		const prices = item.priceHistory.map((e) => e.price).filter((p) => p > 0);
		if (prices.length <= 1) return null;

		const minPrice = Math.min(...prices);
		const maxPrice = Math.max(...prices);
		const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;

		const allSame = minPrice === maxPrice;

		const current = displayPrice > 0 ? displayPrice : prices[0];
		const range = maxPrice - minPrice;
		const percentile = allSame ? 50 : Math.round(((current - minPrice) / range) * 100);
		const vsAvg = avgPrice > 0 ? Math.round(((current - avgPrice) / avgPrice) * 100) : 0;
		const vsMin = minPrice > 0 ? Math.round(((current - minPrice) / minPrice) * 100) : 0;

		let level: 'good' | 'normal' | 'high';
		if (percentile <= 30) level = 'good';
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
		if (!item?.productId || ui.alertLoading) return;
		ui.alertLoading = true;
		try {
			if (ui.alertEnabled) {
				const res = await productsApi.unregisterAlert(item.productId);
				if (res.error) {
					alert(t('alert_toggle_fail'));
				} else {
					ui.alertEnabled = false;
				}
			} else {
				const res = await productsApi.registerAlert(item.productId);
				if (res.error) {
					alert(t('alert_toggle_fail'));
				} else {
					ui.alertEnabled = true;
				}
			}
		} finally {
			ui.alertLoading = false;
		}
	}

	function onImageError() {
		ui.imgError = true;
	}

	async function handleDelete() {
		if (!confirm(t('confirm_delete_track'))) return;
		if (!item?.trackedItemId) return;
		ui.deleting = true;
		try {
			const res = await trackedItemsApi.deleteItem(item.trackedItemId);
			if (res.error) {
				alert(res.error);
				return;
			}
			invalidateTrackedItemsCache();
			await goto(resolve('/items'));
		} finally {
			ui.deleting = false;
		}
	}

	function fmt(n: number) {
		return item ? formatDisplayPrice(n, item.currency) : String(n);
	}

	return {
		get item() {
			return item;
		},
		ui,
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
		selectSku,
		selectMatrixColor,
		selectMatrixSize,
		toggleAlert,
		onImageError,
		handleDelete,
		fmt
	};
}
