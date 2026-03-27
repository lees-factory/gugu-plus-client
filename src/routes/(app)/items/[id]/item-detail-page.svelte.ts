import { goto } from '$app/navigation';
import { resolve } from '$app/paths';
import { SvelteSet } from 'svelte/reactivity';
import { t } from '$lib/i18n/t';
import {
	mapProductDetail,
	formatDisplayPrice,
	type ParsedSku
} from '$lib/product-detail/map-product';
import type { ProductDetailData, ProductSku } from '$lib/api/products';
import { trackedItemsApi } from '$lib/api/tracked-items';

const SIZE_ORDER = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'XXXXL', '4XL', '5XL'];

function getSizeRank(size: string): number {
	const parts = size.toUpperCase().trim().split(/\s+/);
	const last = parts[parts.length - 1];
	const idx = SIZE_ORDER.indexOf(last);
	return idx >= 0 ? idx : 999;
}

const SITE_COLORS: Record<string, { bg: string; text: string }> = {
	Amazon: { bg: '#fef3e8', text: '#c97d32' },
	Taobao: { bg: '#fef0e8', text: '#c96332' },
	eBay: { bg: '#fef9e8', text: '#c9a832' },
	AliExpress: { bg: '#fee8e8', text: '#c93232' },
	'1688': { bg: '#fef5e8', text: '#c99532' }
};

export type MatrixColorOption = { value: string; image: string | null };

export function createItemDetailPage(
	getProduct: () => ProductDetailData | null | undefined,
	getSkus: () => ProductSku[] | null | undefined
) {
	const item = $derived(
		getProduct()
			? mapProductDetail(getProduct() as ProductDetailData, getSkus() ?? null)
			: null
	);

	const ui = $state({
		selectedSkuId: '',
		propColor: '',
		propSize: '',
		alertEnabled: false,
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

	const matrixColorOptions = $derived.by<MatrixColorOption[]>(() => {
		if (!item?.variantMatrix) return [];
		const seen = new SvelteSet<string>();
		const opts: MatrixColorOption[] = [];
		for (const s of item.skus) {
			const v = s.propColor;
			if (!v || seen.has(v)) continue;
			seen.add(v);
			const img =
				s.image ??
				item.skus.find((x) => x.propColor === v && x.image)?.image ??
				null;
			opts.push({ value: v, image: img });
		}
		return opts;
	});

	/** $effect 전 첫 프레임에 ui.propColor가 ''이면 필터가 비어 크기 줄이 통째로 사라짐 → 첫 SKU 색상으로 폴백 */
	const effectivePropColor = $derived(
		ui.propColor || item?.skus[0]?.propColor || ''
	);

	const matrixSizeOptions = $derived.by(() => {
		if (!item?.variantMatrix || !needSize) return [] as string[];
		const sizes = item.skus
			.map((s) => s.propSize)
			.filter((x): x is string => !!x && x !== '');
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
		if (!needColor) return new SvelteSet(matrixSizeOptions);
		return new SvelteSet(
			item.skus
				.filter((s) => s.propColor === effectivePropColor)
				.map((s) => s.propSize)
				.filter((x): x is string => !!x && x !== '')
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
		!!item?.variantMatrix && needColor && matrixColorOptions.length > 1
	);
	const showSizeRow = $derived(
		!!item?.variantMatrix && needSize && matrixSizeOptions.length > 1
	);

	const showMatrixPanel = $derived(
		!!item?.variantMatrix && item.skus.length > 1 && (showColorRow || showSizeRow)
	);

	const showFlatPanel = $derived(
		!!item && !item.variantMatrix && item.skus.length > 1
	);

	const showFlatMatrixFallback = $derived(
		!!item?.variantMatrix && item.skus.length > 1 && !showColorRow && !showSizeRow
	);

	$effect(() => {
		if (!item) return;
		if (item.productId !== prevProductId) {
			prevProductId = item.productId;
			const first = item.skus[0];
			if (item.variantMatrix) {
				ui.propColor = first.propColor ?? '';
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
				if (needColor) {
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

	function toggleAlert() {
		ui.alertEnabled = !ui.alertEnabled;
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
			await goto(resolve('/items'));
		} finally {
			ui.deleting = false;
		}
	}

	function fmt(n: number) {
		return item ? formatDisplayPrice(n, item.currency) : String(n);
	}

	return {
		item,
		ui,
		effectivePropColor,
		effectivePropSize,
		needColor,
		needSize,
		matrixColorOptions,
		matrixSizeOptions,
		availableSizesForColor,
		showColorRow,
		showSizeRow,
		showMatrixPanel,
		showFlatPanel,
		showFlatMatrixFallback,
		hasSkuList,
		currentSku,
		displayImage,
		displayPrice,
		originalPrice,
		discountPct,
		siteBadgeStyle,
		selectSku,
		selectMatrixColor,
		selectMatrixSize,
		toggleAlert,
		onImageError,
		handleDelete,
		fmt
	};
}
