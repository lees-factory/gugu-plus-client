import { goto } from '$app/navigation';
import {
	mapProductDetail,
	formatDisplayPrice,
	type ParsedSku
} from '$lib/product-detail/map-product';
import type { ProductDetailData, ProductSku } from '$lib/api/products';
import { trackedItemsApi } from '$lib/api/tracked-items';

const SIZE_ORDER = ['S', 'M', 'L', 'XL', 'XXL', '2XL', '3XL'];

const SITE_COLORS: Record<string, { bg: string; text: string }> = {
	Amazon: { bg: '#fef3e8', text: '#c97d32' },
	Taobao: { bg: '#fef0e8', text: '#c96332' },
	eBay: { bg: '#fef9e8', text: '#c9a832' },
	AliExpress: { bg: '#fee8e8', text: '#c93232' },
	'1688': { bg: '#fef5e8', text: '#c99532' }
};

export type ColorOption = { value: string; image: string | null };

export function createItemDetailPageModel(
	getProduct: () => ProductDetailData | null | undefined,
	getSkus: () => ProductSku[] | null | undefined
) {
	const item = $derived(
		getProduct()
			? mapProductDetail(getProduct() as ProductDetailData, getSkus() ?? null)
			: null
	);

	const ui = $state({
		selectedColor: '',
		selectedSize: '',
		alertEnabled: false,
		imgError: false,
		deleting: false
	});

	$effect(() => {
		if (!item) return;
		const first = item.skus[0];
		ui.selectedColor = first?.colorCode ?? '';
		ui.selectedSize = first?.size ?? '';
		ui.alertEnabled = item.alertEnabled;
		ui.imgError = false;
	});

	const colorOptions = $derived.by<ColorOption[]>(() => {
		if (!item) return [];
		const seen = new Set<string>();
		const opts: ColorOption[] = [];
		for (const s of item.skus) {
			if (!seen.has(s.colorCode)) {
				seen.add(s.colorCode);
				opts.push({ value: s.colorCode, image: s.image });
			}
		}
		return opts;
	});

	const sizeOptions = $derived.by<string[]>(() => {
		if (!item || !ui.selectedColor) return [];
		const sizes = item.skus
			.filter((s: ParsedSku) => s.colorCode === ui.selectedColor && s.size !== '')
			.map((s: ParsedSku) => s.size);
		return [...new Set(sizes)].sort((a, b) => {
			const ai = SIZE_ORDER.indexOf(a);
			const bi = SIZE_ORDER.indexOf(b);
			return (ai < 0 ? 999 : ai) - (bi < 0 ? 999 : bi);
		});
	});

	const hasColors = $derived(colorOptions.length > 1);
	const hasSizes = $derived(sizeOptions.length > 0);

	const currentSku = $derived.by<ParsedSku | null>(() => {
		if (!item) return null;
		if (item.skus.length === 1) return item.skus[0];
		return (
			item.skus.find(
				(s) => s.colorCode === ui.selectedColor && s.size === ui.selectedSize
			) ?? item.skus[0]
		);
	});

	const displayImage = $derived(currentSku?.image ?? item?.imageUrl ?? '');
	const displayPrice = $derived(currentSku?.price ?? 0);
	const originalPrice = $derived(currentSku?.originalPrice ?? null);
	const discountPct = $derived(
		originalPrice && originalPrice > displayPrice
			? Math.round((1 - displayPrice / originalPrice) * 100)
			: null
	);

	$effect(() => {
		displayImage;
		ui.imgError = false;
	});

	const siteBadgeStyle = $derived(
		SITE_COLORS[item?.site ?? ''] ?? { bg: '#f7f6f3', text: '#6b6b65' }
	);

	function selectColor(color: string) {
		ui.selectedColor = color;
		const sizes = item?.skus
			.filter((s) => s.colorCode === color && s.size !== '')
			.map((s) => s.size);
		if (sizes && sizes.length > 0 && !sizes.includes(ui.selectedSize)) {
			ui.selectedSize = sizes[0];
		}
	}

	function selectSize(size: string) {
		ui.selectedSize = size;
	}

	function toggleAlert() {
		ui.alertEnabled = !ui.alertEnabled;
	}

	function onImageError() {
		ui.imgError = true;
	}

	async function handleDelete() {
		if (!confirm('이 상품 추적을 중단하시겠습니까?')) return;
		if (!item?.trackedItemId) return;
		ui.deleting = true;
		try {
			const res = await trackedItemsApi.deleteItem(item.trackedItemId);
			if (res.error) {
				alert(res.error);
				return;
			}
			await goto('/');
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
		colorOptions,
		sizeOptions,
		hasColors,
		hasSizes,
		currentSku,
		displayImage,
		displayPrice,
		originalPrice,
		discountPct,
		siteBadgeStyle,
		selectColor,
		selectSize,
		toggleAlert,
		onImageError,
		handleDelete,
		fmt
	};
}
