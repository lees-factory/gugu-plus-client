import { tick, untrack } from 'svelte';

export type Site = 'AliExpress' | 'eBay' | 'Coupang';
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

export const siteFilters: SiteFilter[] = ['all', 'AliExpress', 'eBay', 'Coupang'];

export const siteLabels: Record<SiteFilter, string> = {
	all: 'All',
	AliExpress: 'AliExpress',
	eBay: 'eBay',
	Coupang: '쿠팡'
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
		imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&fit=crop&auto=format',
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
		imageUrl: 'https://images.unsplash.com/photo-1595044426077-d36d9236d54a?w=400&fit=crop&auto=format',
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
		imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&fit=crop&auto=format',
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
		imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&fit=crop&auto=format',
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
		imageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&fit=crop&auto=format',
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
		imageUrl: 'https://images.unsplash.com/photo-1581147036324-c1c893cac3b4?w=400&fit=crop&auto=format',
		url: 'https://www.aliexpress.com/wholesale?SearchText=precision+screwdriver'
	},
	{
		id: 'e01',
		aspect: 'square',
		site: 'eBay',
		isHot: true,
		discountPct: 25,
		currency: '$',
		currentPrice: 299.0,
		originalPrice: 399.99,
		title: 'GoPro HERO 11 Black 액션 카메라 방수 케이스 번들',
		imageUrl: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&fit=crop&auto=format',
		url: 'https://www.ebay.com/sch/i.html?_nkw=gopro+hero+11'
	},
	{
		id: 'e02',
		aspect: 'portrait',
		site: 'eBay',
		isHot: true,
		discountPct: 26,
		currency: '$',
		currentPrice: 279.99,
		originalPrice: 379.99,
		title: 'Sony WH-1000XM5 무선 노이즈캔슬링 헤드폰',
		imageUrl: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400&fit=crop&auto=format',
		url: 'https://www.ebay.com/sch/i.html?_nkw=sony+wh1000xm5'
	},
	{
		id: 'e03',
		aspect: 'landscape',
		site: 'eBay',
		isHot: false,
		discountPct: 29,
		currency: '$',
		currentPrice: 99.95,
		originalPrice: 139.99,
		title: 'LEGO Technic 42154 Ford GT 1:12 레플리카 세트',
		imageUrl: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400&fit=crop&auto=format',
		url: 'https://www.ebay.com/sch/i.html?_nkw=lego+technic'
	},
	{
		id: 'e04',
		aspect: 'portrait',
		site: 'eBay',
		isHot: false,
		discountPct: 49,
		currency: '$',
		currentPrice: 45.0,
		originalPrice: 89.0,
		title: "Vintage Levi's 501 데님 재킷 클래식 와이드 핏",
		imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&fit=crop&auto=format',
		url: 'https://www.ebay.com/sch/i.html?_nkw=vintage+levis+501'
	},
	{
		id: 'e07',
		aspect: 'portrait',
		site: 'eBay',
		isHot: true,
		discountPct: 31,
		currency: '$',
		currentPrice: 249.0,
		originalPrice: 359.0,
		title: 'Beats Studio Pro 무선 노이즈캔슬링 헤드폰 블랙',
		imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&fit=crop&auto=format',
		url: 'https://www.ebay.com/sch/i.html?_nkw=beats+studio+pro'
	},
	{
		id: 'e12',
		aspect: 'landscape',
		site: 'eBay',
		isHot: true,
		discountPct: 40,
		currency: '$',
		currentPrice: 359.0,
		originalPrice: 599.0,
		title: 'Dyson V8 Animal 무선 청소기 리퍼 + 액세서리',
		imageUrl: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=400&fit=crop&auto=format',
		url: 'https://www.ebay.com/sch/i.html?_nkw=dyson+v8+animal'
	},
	{
		id: 'c01',
		aspect: 'portrait',
		site: 'Coupang',
		isHot: true,
		discountPct: 40,
		currency: '₩',
		currentPrice: 89000,
		originalPrice: 149000,
		title: '필립스 에어프라이어 XXL HD9762 6.2L 1700W 디지털',
		imageUrl: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=400&fit=crop&auto=format',
		url: 'https://www.coupang.com/np/search?q=에어프라이어'
	},
	{
		id: 'c02',
		aspect: 'square',
		site: 'Coupang',
		isHot: false,
		discountPct: 35,
		currency: '₩',
		currentPrice: 129000,
		originalPrice: 199000,
		title: '네스프레소 버츄오 플러스 D 캡슐 커피머신 블랙',
		imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&fit=crop&auto=format',
		url: 'https://www.coupang.com/np/search?q=네스프레소'
	},
	{
		id: 'c03',
		aspect: 'landscape',
		site: 'Coupang',
		isHot: true,
		discountPct: 22,
		currency: '₩',
		currentPrice: 699000,
		originalPrice: 899000,
		title: '다이슨 V15 디텍트 앱솔루트 무선 청소기 퍼플',
		imageUrl: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=400&fit=crop&auto=format',
		url: 'https://www.coupang.com/np/search?q=다이슨+v15'
	},
	{
		id: 'c06',
		aspect: 'landscape',
		site: 'Coupang',
		isHot: true,
		discountPct: 33,
		currency: '₩',
		currentPrice: 199000,
		originalPrice: 299000,
		title: '삼성 갤럭시 버즈3 프로 이어폰 노이즈캔슬링',
		imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&fit=crop&auto=format',
		url: 'https://www.coupang.com/np/search?q=갤럭시+버즈3'
	},
	{
		id: 'c09',
		aspect: 'landscape',
		site: 'Coupang',
		isHot: true,
		discountPct: 37,
		currency: '₩',
		currentPrice: 109000,
		originalPrice: 172000,
		title: '나이키 에어포스 1 07 화이트 남성 운동화',
		imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&fit=crop&auto=format',
		url: 'https://www.coupang.com/np/search?q=나이키+에어포스1'
	}
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
				if (
					!entries[0].isIntersecting ||
					observerCooldown ||
					model.isLoadingMore ||
					!model.hasMore
				)
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
