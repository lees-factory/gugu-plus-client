import { tick, untrack } from 'svelte';

export type Site = 'AliExpress';
export type SiteFilter = 'all' | Site;
type AspectRatio = 'square' | 'portrait' | 'landscape';

export interface HotProduct {
	id: string;
	site: Site;
	title: string;
	imageUrl: string;
	url: string;
	currentPrice: number;
	originalPrice: number;
	currency: string;
	discountPct: number;
	isHot: boolean;
	aspect: AspectRatio;
}

export const siteFilters: SiteFilter[] = ['all', 'AliExpress'];

export const siteLabels: Record<SiteFilter, string> = {
	all: 'All',
	AliExpress: 'AliExpress'
};

export const ALL_PRODUCTS: HotProduct[] = [
	{
		id: 'a01',
		aspect: 'portrait',
		site: 'AliExpress',
		isHot: true,
		discountPct: 57,
		currency: '$',
		currentPrice: 12.99,
		originalPrice: 29.99,
		title: 'TWS 블루투스 이어폰 노이즈캔슬링 ANC 인이어',
		imageUrl:
			'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&fit=crop&auto=format',
		url: 'https://www.aliexpress.com/wholesale?SearchText=tws+bluetooth+earphone'
	},
	{
		id: 'a02',
		aspect: 'landscape',
		site: 'AliExpress',
		isHot: false,
		discountPct: 42,
		currency: '$',
		currentPrice: 34.99,
		originalPrice: 59.99,
		title: '메카니컬 키보드 RGB 백라이트 게이밍 적축',
		imageUrl:
			'https://images.unsplash.com/photo-1595044426077-d36d9236d54a?w=400&fit=crop&auto=format',
		url: 'https://www.aliexpress.com/wholesale?SearchText=mechanical+keyboard+rgb'
	},
	{
		id: 'a03',
		aspect: 'square',
		site: 'AliExpress',
		isHot: true,
		discountPct: 56,
		currency: '$',
		currentPrice: 19.99,
		originalPrice: 45.0,
		title: '스마트 워치 피트니스 트래커 혈중산소 심박수 모니터',
		imageUrl:
			'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&fit=crop&auto=format',
		url: 'https://www.aliexpress.com/wholesale?SearchText=smart+watch+fitness'
	},
	{
		id: 'a04',
		aspect: 'portrait',
		site: 'AliExpress',
		isHot: false,
		discountPct: 41,
		currency: '$',
		currentPrice: 22.5,
		originalPrice: 38.0,
		title: 'LED 링 라이트 18인치 3색 밝기 조절 삼각대',
		imageUrl:
			'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&fit=crop&auto=format',
		url: 'https://www.aliexpress.com/wholesale?SearchText=led+ring+light'
	},
	{
		id: 'a05',
		aspect: 'square',
		site: 'AliExpress',
		isHot: false,
		discountPct: 47,
		currency: '$',
		currentPrice: 16.99,
		originalPrice: 32.0,
		title: '포터블 블루투스 스피커 방수 IPX7 울트라 베이스',
		imageUrl:
			'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&fit=crop&auto=format',
		url: 'https://www.aliexpress.com/wholesale?SearchText=bluetooth+speaker'
	},
	{
		id: 'a06',
		aspect: 'landscape',
		site: 'AliExpress',
		isHot: false,
		discountPct: 55,
		currency: '$',
		currentPrice: 8.99,
		originalPrice: 19.99,
		title: '미니 드라이버 세트 정밀 핸드폰 수리 공구',
		imageUrl:
			'https://images.unsplash.com/photo-1581147036324-c1c893cac3b4?w=400&fit=crop&auto=format',
		url: 'https://www.aliexpress.com/wholesale?SearchText=precision+screwdriver'
	},
];

const PAGE_SIZE = 8;

export function createDiscoverPage() {
	const model = $state({
		selectedSite: 'all' as SiteFilter,
		displayed: [] as HotProduct[],
		isLoadingMore: false,
		hasMore: true,
		sentinel: undefined as HTMLElement | undefined
	});

	let observerCooldown = false;

	const source = $derived(
		model.selectedSite === 'all'
			? ALL_PRODUCTS
			: ALL_PRODUCTS.filter((p) => p.site === model.selectedSite)
	);

	const biggestDrops = $derived(
		[...ALL_PRODUCTS].sort((a, b) => b.discountPct - a.discountPct).slice(0, 5)
	);

	const avgDiscount = $derived(
		Math.round(ALL_PRODUCTS.reduce((s, p) => s + p.discountPct, 0) / ALL_PRODUCTS.length)
	);

	const hotCount = $derived(ALL_PRODUCTS.filter((p) => p.isHot).length);

	$effect(() => {
		const s = source;
		untrack(() => {
			model.displayed = s.slice(0, PAGE_SIZE);
			model.hasMore = model.displayed.length < s.length;
			model.isLoadingMore = false;
		});
	});

	$effect(() => {
		if (!model.sentinel) return;
		const observer = new IntersectionObserver(
			(entries) => {
				if (!entries[0].isIntersecting || observerCooldown || model.isLoadingMore || !model.hasMore)
					return;
				observerCooldown = true;
				void loadMore().finally(() => {
					setTimeout(() => {
						observerCooldown = false;
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
		await tick();
		const next = source.slice(model.displayed.length, model.displayed.length + PAGE_SIZE);
		if (next.length === 0) {
			model.hasMore = false;
			model.isLoadingMore = false;
			return;
		}
		model.displayed = [...model.displayed, ...next];
		model.hasMore = model.displayed.length < source.length;
		model.isLoadingMore = false;
	}

	function fmt(price: number, currency: string): string {
		if (currency === '₩') return `${price.toLocaleString('ko-KR')}${currency}`;
		return `${currency}${price.toFixed(2)}`;
	}

	return {
		model,
		get biggestDrops() {
			return biggestDrops;
		},
		get avgDiscount() {
			return avgDiscount;
		},
		get hotCount() {
			return hotCount;
		},
		fmt
	};
}
