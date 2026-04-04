import { invalidate } from '$app/navigation';
import { discoverApi, type HotProductData } from '$lib/api/discover';
import { trackedItemsApi, type TrackedItemData } from '$lib/api/tracked-items';
import { summaryToCard } from '$lib/tracked-items/map-summary';
import { parseCommerceProductUrl } from '$lib/commerce/parse-product-url';
import { marketToSite } from '$lib/commerce';
import { formatPrice } from '$lib/utils/format-price';
import { getLocale } from '$lib/paraglide/runtime.js';

export type Site = string;
export type SiteFilter = 'all' | Site;

export interface HotProduct {
	id: string;
	market: string;
	site: Site;
	title: string;
	imageUrl: string;
	url: string;
	currentPrice: number;
	originalPrice: number;
	currency: string;
	discountPct: number;
	isHot: boolean;
}

export const siteFilters: SiteFilter[] = ['all', 'AliExpress'];

export const siteLabels: Record<string, string> = {
	all: 'All',
	AliExpress: 'AliExpress'
};

export function mapProduct(raw: HotProductData): HotProduct {
	const currentPrice = Number(raw.current_price) || 0;
	const site = marketToSite(raw.market);
	return {
		id: raw.product_id,
		market: raw.market,
		site,
		title: raw.title,
		imageUrl: raw.main_image_url,
		url: raw.product_url,
		currentPrice,
		originalPrice: 0,
		currency: raw.currency,
		discountPct: 0,
		isHot: false
	};
}

const PAGE_SIZE = 20;

export function createDiscoverPage(
	getData: () => {
		hotProducts: HotProductData[];
		trackedItems: TrackedItemData[];
		error: string | null;
	}
) {
	let extraProducts = $state<HotProduct[]>([]);
	let currentPage = 1;
	let fetchedAll = false;

	// load에서 받은 첫 페이지 + 추가 로드된 페이지
	const allProducts = $derived([...getData().hotProducts.map(mapProduct), ...extraProducts]);

	const loadError = $derived(getData().error);

	let addingId = $state('');
	let addedIds = $state<string[]>([]);

	const model = $state({
		selectedSite: 'all' as SiteFilter,
		isLoadingMore: false,
		hasMore: true,
		sentinel: undefined as HTMLElement | undefined
	});

	// 첫 페이지 사이즈 미만이면 더 이상 없음
	$effect(() => {
		const initial = getData().hotProducts;
		if (initial.length < PAGE_SIZE) {
			fetchedAll = true;
			model.hasMore = false;
		}
	});

	const source = $derived(
		model.selectedSite === 'all'
			? allProducts
			: allProducts.filter((p) => p.site === model.selectedSite)
	);

	const displayed = $derived(source);

	const trackedItems = $derived(getData().trackedItems.slice(0, 5).map(summaryToCard));

	// infinite scroll observer
	$effect(() => {
		if (!model.sentinel) return;
		let cooldown = false;
		const observer = new IntersectionObserver(
			(entries) => {
				if (!entries[0].isIntersecting || cooldown || model.isLoadingMore || !model.hasMore) return;
				cooldown = true;
				void loadMore().finally(() => {
					setTimeout(() => {
						cooldown = false;
					}, 80);
				});
			},
			{ root: null, rootMargin: '280px', threshold: 0 }
		);
		observer.observe(model.sentinel);
		return () => observer.disconnect();
	});

	async function loadMore() {
		if (model.isLoadingMore || !model.hasMore) return;
		model.isLoadingMore = true;
		const nextPage = currentPage + 1;
		const language = getLocale().toUpperCase() as 'KO' | 'EN';
		const res = await discoverApi.hotProducts(nextPage, PAGE_SIZE, language);
		if (res.error || !res.data?.data || res.data.data.length === 0) {
			model.hasMore = false;
			model.isLoadingMore = false;
			return;
		}
		const items = res.data.data;
		if (items.length < PAGE_SIZE) {
			fetchedAll = true;
		}
		currentPage = nextPage;
		extraProducts = [...extraProducts, ...items.map(mapProduct)];
		model.hasMore = !fetchedAll;
		model.isLoadingMore = false;
	}

	async function addItem(product: HotProduct) {
		if (addingId || addedIds.includes(product.id)) return;
		const parsed = parseCommerceProductUrl(product.url);
		if (!parsed.ok) return;
		addingId = product.id;
		try {
			const res = await trackedItemsApi.create([
				{
					original_url: parsed.original_url,
					provider_commerce: parsed.provider_commerce,
					external_product_id: parsed.external_product_id
				}
			]);
			if (!res.error && res.data) {
				addedIds = [...addedIds, product.id];
				await invalidate('app:tracked-items');
			}
		} finally {
			addingId = '';
		}
	}

	function fmt(price: number, currency: string): string {
		return formatPrice(price, currency);
	}

	return {
		model,
		get displayed() {
			return displayed;
		},
		get trackedItems() {
			return trackedItems;
		},
		get loadError() {
			return loadError;
		},
		get addingId() {
			return addingId;
		},
		get addedIds() {
			return addedIds;
		},
		addItem,
		fmt
	};
}
