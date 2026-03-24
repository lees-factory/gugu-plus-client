<script lang="ts">
	import { getContext, untrack, onMount } from 'svelte';
	import { t } from '$lib/i18n/t';

	const toggleSidebar = getContext<() => void>('toggleSidebar');

	// ── Types ───────────────────────────────────────────────────
	type Site = 'AliExpress' | 'eBay' | 'Coupang';
	type SiteFilter = 'all' | Site;

	type AspectRatio = 'square' | 'portrait' | 'landscape';

	interface HotProduct {
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

	const ASPECT_CLASSES: Record<AspectRatio, string> = {
		square:    'aspect-square',
		portrait:  'aspect-[3/4]',
		landscape: 'aspect-[4/3]'
	};

	// ── Site config ─────────────────────────────────────────────
	const siteConfig: Record<
		SiteFilter,
		{ label: string; badge: { bg: string; text: string }; activeColor: string }
	> = {
		all:        { label: '전체',       badge: { bg: '#f7f6f3', text: '#6b6b65' }, activeColor: '#2d2d2a' },
		AliExpress: { label: 'AliExpress', badge: { bg: '#fee8e8', text: '#c93232' }, activeColor: '#c93232' },
		eBay:       { label: 'eBay',       badge: { bg: '#e8effe', text: '#2563eb' }, activeColor: '#2563eb' },
		Coupang:    { label: '쿠팡',        badge: { bg: '#fff0e8', text: '#c96a32' }, activeColor: '#c96a32' }
	};

	const siteFilters: SiteFilter[] = ['all', 'AliExpress', 'eBay', 'Coupang'];

	// ── Mock data (36개 — 사이트당 12개) ────────────────────────
	const ALL_PRODUCTS: HotProduct[] = [
		// ── AliExpress ──────────────────────────────────────────
		{ id: 'a01', aspect: 'portrait',   site: 'AliExpress', isHot: true,  discountPct: 57, currency: '$', currentPrice: 12.99,  originalPrice: 29.99,  title: 'TWS 블루투스 이어폰 노이즈캔슬링 ANC 인이어',          imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&fit=crop&auto=format', url: 'https://www.aliexpress.com/wholesale?SearchText=tws+bluetooth+earphone' },
		{ id: 'a02', aspect: 'landscape',  site: 'AliExpress', isHot: false, discountPct: 42, currency: '$', currentPrice: 34.99,  originalPrice: 59.99,  title: '메카니컬 키보드 RGB 백라이트 게이밍 적축 클릭',          imageUrl: 'https://images.unsplash.com/photo-1595044426077-d36d9236d54a?w=400&fit=crop&auto=format', url: 'https://www.aliexpress.com/wholesale?SearchText=mechanical+keyboard+rgb' },
		{ id: 'a03', aspect: 'square',     site: 'AliExpress', isHot: true,  discountPct: 56, currency: '$', currentPrice: 19.99,  originalPrice: 45.00,  title: '스마트 워치 피트니스 트래커 혈중산소 심박수 모니터',        imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&fit=crop&auto=format', url: 'https://www.aliexpress.com/wholesale?SearchText=smart+watch+fitness+tracker' },
		{ id: 'a04', aspect: 'portrait',   site: 'AliExpress', isHot: false, discountPct: 41, currency: '$', currentPrice: 22.50,  originalPrice: 38.00,  title: 'LED 링 라이트 18인치 3색 밝기 조절 삼각대 포함',          imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&fit=crop&auto=format', url: 'https://www.aliexpress.com/wholesale?SearchText=led+ring+light+18inch' },
		{ id: 'a05', aspect: 'square',     site: 'AliExpress', isHot: false, discountPct: 47, currency: '$', currentPrice: 16.99,  originalPrice: 32.00,  title: '포터블 블루투스 스피커 방수 IPX7 울트라 베이스',           imageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&fit=crop&auto=format', url: 'https://www.aliexpress.com/wholesale?SearchText=portable+bluetooth+speaker+ipx7' },
		{ id: 'a06', aspect: 'landscape',  site: 'AliExpress', isHot: false, discountPct: 55, currency: '$', currentPrice:  8.99,  originalPrice: 19.99,  title: '미니 드라이버 세트 정밀 핸드폰 수리 공구',               imageUrl: 'https://images.unsplash.com/photo-1581147036324-c1c893cac3b4?w=400&fit=crop&auto=format', url: 'https://www.aliexpress.com/wholesale?SearchText=precision+screwdriver+set' },
		{ id: 'a07', aspect: 'portrait',   site: 'AliExpress', isHot: true,  discountPct: 38, currency: '$', currentPrice: 24.99,  originalPrice: 39.99,  title: '게이밍 마우스 RGB 유선 12800DPI 7버튼 인체공학',          imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&fit=crop&auto=format', url: 'https://www.aliexpress.com/wholesale?SearchText=gaming+mouse+rgb' },
		{ id: 'a08', aspect: 'square',     site: 'AliExpress', isHot: false, discountPct: 62, currency: '$', currentPrice:  9.99,  originalPrice: 25.99,  title: 'USB C타입 7in1 허브 HDMI 4K PD 충전 SD 카드',             imageUrl: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=400&fit=crop&auto=format', url: 'https://www.aliexpress.com/wholesale?SearchText=usb+c+hub+7in1' },
		{ id: 'a09', aspect: 'landscape',  site: 'AliExpress', isHot: false, discountPct: 45, currency: '$', currentPrice: 49.99,  originalPrice: 89.99,  title: '미니 빔 프로젝터 1080P WiFi 휴대용 야외 영화',            imageUrl: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&fit=crop&auto=format', url: 'https://www.aliexpress.com/wholesale?SearchText=mini+projector+1080p' },
		{ id: 'a10', aspect: 'portrait',   site: 'AliExpress', isHot: false, discountPct: 33, currency: '$', currentPrice: 18.99,  originalPrice: 27.99,  title: '노트북 쿨링 패드 6팬 LED 높이 조절 USB 파워',             imageUrl: 'https://images.unsplash.com/photo-1588702547919-26089e690ecc?w=400&fit=crop&auto=format', url: 'https://www.aliexpress.com/wholesale?SearchText=laptop+cooling+pad' },
		{ id: 'a11', aspect: 'square',     site: 'AliExpress', isHot: true,  discountPct: 50, currency: '$', currentPrice:  7.99,  originalPrice: 15.99,  title: '스마트 플러그 와이파이 앱 제어 타이머 에너지 모니터',       imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&fit=crop&auto=format', url: 'https://www.aliexpress.com/wholesale?SearchText=smart+plug+wifi' },
		{ id: 'a12', aspect: 'landscape',  site: 'AliExpress', isHot: false, discountPct: 44, currency: '$', currentPrice: 13.99,  originalPrice: 24.99,  title: '차량용 무선 충전 거치대 15W 고속충전 대시보드',            imageUrl: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=400&fit=crop&auto=format', url: 'https://www.aliexpress.com/wholesale?SearchText=car+wireless+charger+holder' },

		// ── eBay ────────────────────────────────────────────────
		{ id: 'e01', aspect: 'square',     site: 'eBay', isHot: true,  discountPct: 25, currency: '$', currentPrice: 299.00, originalPrice: 399.99, title: 'GoPro HERO 11 Black 액션 카메라 방수 케이스 번들',      imageUrl: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&fit=crop&auto=format', url: 'https://www.ebay.com/sch/i.html?_nkw=gopro+hero+11+black' },
		{ id: 'e02', aspect: 'portrait',   site: 'eBay', isHot: true,  discountPct: 26, currency: '$', currentPrice: 279.99, originalPrice: 379.99, title: 'Sony WH-1000XM5 무선 노이즈캔슬링 헤드폰',              imageUrl: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400&fit=crop&auto=format', url: 'https://www.ebay.com/sch/i.html?_nkw=sony+wh1000xm5' },
		{ id: 'e03', aspect: 'landscape',  site: 'eBay', isHot: false, discountPct: 29, currency: '$', currentPrice:  99.95, originalPrice: 139.99, title: 'LEGO Technic 42154 Ford GT 1:12 레플리카 세트',          imageUrl: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400&fit=crop&auto=format', url: 'https://www.ebay.com/sch/i.html?_nkw=lego+technic+ford+gt' },
		{ id: 'e04', aspect: 'portrait',   site: 'eBay', isHot: false, discountPct: 49, currency: '$', currentPrice:  45.00, originalPrice:  89.00, title: "Vintage Levi's 501 데님 재킷 클래식 와이드 핏",          imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&fit=crop&auto=format', url: 'https://www.ebay.com/sch/i.html?_nkw=vintage+levis+501+denim+jacket' },
		{ id: 'e05', aspect: 'square',     site: 'eBay', isHot: false, discountPct: 14, currency: '$', currentPrice: 319.99, originalPrice: 369.99, title: 'Nintendo Switch OLED 본체 화이트 + 게임 패키지',          imageUrl: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=400&fit=crop&auto=format', url: 'https://www.ebay.com/sch/i.html?_nkw=nintendo+switch+oled+white' },
		{ id: 'e06', aspect: 'landscape',  site: 'eBay', isHot: false, discountPct: 24, currency: '$', currentPrice: 189.99, originalPrice: 249.00, title: 'Apple AirPods Pro (2세대) MagSafe USB-C 케이스',         imageUrl: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=400&fit=crop&auto=format', url: 'https://www.ebay.com/sch/i.html?_nkw=airpods+pro+2nd+generation' },
		{ id: 'e07', aspect: 'portrait',   site: 'eBay', isHot: true,  discountPct: 31, currency: '$', currentPrice: 249.00, originalPrice: 359.00, title: 'Beats Studio Pro 무선 노이즈캔슬링 헤드폰 블랙',         imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&fit=crop&auto=format', url: 'https://www.ebay.com/sch/i.html?_nkw=beats+studio+pro' },
		{ id: 'e08', aspect: 'square',     site: 'eBay', isHot: false, discountPct: 18, currency: '$', currentPrice: 389.00, originalPrice: 474.99, title: 'iPad Air 5세대 64GB Wi-Fi 스페이스 그레이',              imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&fit=crop&auto=format', url: 'https://www.ebay.com/sch/i.html?_nkw=ipad+air+5th+generation' },
		{ id: 'e09', aspect: 'landscape',  site: 'eBay', isHot: false, discountPct: 22, currency: '$', currentPrice: 219.00, originalPrice: 279.99, title: 'Canon EF 50mm f/1.8 STM 단렌즈 풀프레임',               imageUrl: 'https://images.unsplash.com/photo-1520390138845-fd2d229dd553?w=400&fit=crop&auto=format', url: 'https://www.ebay.com/sch/i.html?_nkw=canon+ef+50mm+f1.8' },
		{ id: 'e10', aspect: 'portrait',   site: 'eBay', isHot: false, discountPct: 35, currency: '$', currentPrice: 179.00, originalPrice: 274.99, title: '게이밍 체어 레이싱 스타일 요추 지지대 리클라이닝',        imageUrl: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&fit=crop&auto=format', url: 'https://www.ebay.com/sch/i.html?_nkw=gaming+chair+racing' },
		{ id: 'e11', aspect: 'square',     site: 'eBay', isHot: false, discountPct: 20, currency: '$', currentPrice: 111.99, originalPrice: 139.99, title: 'Kindle Paperwhite 11세대 8GB 광고 없음',                 imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&fit=crop&auto=format', url: 'https://www.ebay.com/sch/i.html?_nkw=kindle+paperwhite+11th' },
		{ id: 'e12', aspect: 'landscape',  site: 'eBay', isHot: true,  discountPct: 40, currency: '$', currentPrice: 359.00, originalPrice: 599.00, title: 'Dyson V8 Animal 무선 청소기 리퍼 + 액세서리',           imageUrl: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=400&fit=crop&auto=format', url: 'https://www.ebay.com/sch/i.html?_nkw=dyson+v8+animal' },

		// ── Coupang ─────────────────────────────────────────────
		{ id: 'c01', aspect: 'portrait',   site: 'Coupang', isHot: true,  discountPct: 40, currency: '₩', currentPrice:  89000, originalPrice: 149000, title: '필립스 에어프라이어 XXL HD9762 6.2L 1700W 디지털',   imageUrl: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=400&fit=crop&auto=format', url: 'https://www.coupang.com/np/search?q=에어프라이어' },
		{ id: 'c02', aspect: 'square',     site: 'Coupang', isHot: false, discountPct: 35, currency: '₩', currentPrice: 129000, originalPrice: 199000, title: '네스프레소 버츄오 플러스 D 캡슐 커피머신 블랙',       imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&fit=crop&auto=format', url: 'https://www.coupang.com/np/search?q=네스프레소+버츄오' },
		{ id: 'c03', aspect: 'landscape',  site: 'Coupang', isHot: true,  discountPct: 22, currency: '₩', currentPrice: 699000, originalPrice: 899000, title: '다이슨 V15 디텍트 앱솔루트 무선 청소기 퍼플',        imageUrl: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=400&fit=crop&auto=format', url: 'https://www.coupang.com/np/search?q=다이슨+v15' },
		{ id: 'c04', aspect: 'portrait',   site: 'Coupang', isHot: false, discountPct: 31, currency: '₩', currentPrice:  89000, originalPrice: 129000, title: '설화수 자음생 에센스 60ml 2024 한정 기획세트',       imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&fit=crop&auto=format', url: 'https://www.coupang.com/np/search?q=설화수+자음생+에센스' },
		{ id: 'c05', aspect: 'square',     site: 'Coupang', isHot: false, discountPct: 40, currency: '₩', currentPrice:  29900, originalPrice:  49900, title: '요가매트 TPE 6mm 미끄럼방지 홈트레이닝 운동',       imageUrl: 'https://images.unsplash.com/photo-1601925228008-d5a0b23da1e9?w=400&fit=crop&auto=format', url: 'https://www.coupang.com/np/search?q=요가매트' },
		{ id: 'c06', aspect: 'landscape',  site: 'Coupang', isHot: true,  discountPct: 33, currency: '₩', currentPrice: 199000, originalPrice: 299000, title: '삼성 갤럭시 버즈3 프로 이어폰 노이즈캔슬링',        imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&fit=crop&auto=format', url: 'https://www.coupang.com/np/search?q=갤럭시+버즈3+프로' },
		{ id: 'c07', aspect: 'portrait',   site: 'Coupang', isHot: false, discountPct: 28, currency: '₩', currentPrice: 289000, originalPrice: 399000, title: 'LG 퓨리케어 360 공기청정기 AS281DWA 33평',          imageUrl: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&fit=crop&auto=format', url: 'https://www.coupang.com/np/search?q=LG+공기청정기' },
		{ id: 'c08', aspect: 'square',     site: 'Coupang', isHot: false, discountPct: 25, currency: '₩', currentPrice: 149000, originalPrice: 199000, title: '쿠쿠 전기밥솥 10인용 IH 압력 CRP-LHTS1010FG',       imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&fit=crop&auto=format', url: 'https://www.coupang.com/np/search?q=쿠쿠+전기밥솥' },
		{ id: 'c09', aspect: 'landscape',  site: 'Coupang', isHot: true,  discountPct: 37, currency: '₩', currentPrice: 109000, originalPrice: 172000, title: '나이키 에어포스 1 07 화이트 남성 운동화',            imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&fit=crop&auto=format', url: 'https://www.coupang.com/np/search?q=나이키+에어포스1' },
		{ id: 'c10', aspect: 'portrait',   site: 'Coupang', isHot: false, discountPct: 20, currency: '₩', currentPrice:  47900, originalPrice:  59900, title: '레고 클래식 10698 대형 창작 박스 1500피스',         imageUrl: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400&fit=crop&auto=format', url: 'https://www.coupang.com/np/search?q=레고+클래식' },
		{ id: 'c11', aspect: 'square',     site: 'Coupang', isHot: false, discountPct: 29, currency: '₩', currentPrice: 319000, originalPrice: 449000, title: '시디즈 T50 사무용 의자 기본형 블랙',                imageUrl: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&fit=crop&auto=format', url: 'https://www.coupang.com/np/search?q=시디즈+T50' },
		{ id: 'c12', aspect: 'landscape',  site: 'Coupang', isHot: false, discountPct: 32, currency: '₩', currentPrice:  89000, originalPrice: 130000, title: '삼성 포터블 SSD T7 1TB USB 3.2 외장하드',           imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&fit=crop&auto=format', url: 'https://www.coupang.com/np/search?q=삼성+포터블+SSD+T7' },
	];

	// ── Responsive column count ──────────────────────────────────
	function getColCount(): number {
		if (typeof window === 'undefined') return 4;
		if (window.innerWidth >= 1536) return 5; // 2xl
		if (window.innerWidth >= 1024) return 4; // lg
		if (window.innerWidth >= 640)  return 3; // sm
		return 2;
	}

	let colCount = $state(4);

	onMount(() => {
		colCount = getColCount();
		const onResize = () => { colCount = getColCount(); };
		window.addEventListener('resize', onResize);
		return () => window.removeEventListener('resize', onResize);
	});

	// ── Infinite scroll state ────────────────────────────────────
	const PAGE_SIZE = 20;

	let selectedSite = $state<SiteFilter>('all');
	let displayed = $state<HotProduct[]>([]);
	let isLoadingMore = $state(false);
	let hasMore = $state(true);
	let sentinel = $state<HTMLElement | undefined>();

	// 필터된 전체 목록
	const source = $derived(
		selectedSite === 'all' ? ALL_PRODUCTS : ALL_PRODUCTS.filter((p) => p.site === selectedSite)
	);

	// 컬럼 N에 속하는 아이템: index % colCount === N
	// → 새 아이템이 추가돼도 기존 아이템의 컬럼이 절대 바뀌지 않음
	function getColumnItems(colIdx: number): HotProduct[] {
		return displayed.filter((_, i) => i % colCount === colIdx);
	}

	// 탭 변경 시 초기화 — isLoadingMore/hasMore 읽기를 untrack으로 차단해 무한루프 방지
	$effect(() => {
		const _ = source; // selectedSite 변경만 추적
		untrack(() => {
			displayed = [];
			hasMore = true;
			isLoadingMore = false;
			loadMore();
		});
	});

	// Intersection Observer
	$effect(() => {
		if (!sentinel) return;
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && !isLoadingMore && hasMore) {
					loadMore();
				}
			},
			{ rootMargin: '300px' }
		);
		observer.observe(sentinel);
		return () => observer.disconnect();
	});

	async function loadMore() {
		if (isLoadingMore || !hasMore) return;
		isLoadingMore = true;

		// 실제 API 연동 전 딜레이 시뮬레이션
		await new Promise((r) => setTimeout(r, 500));

		const next = source.slice(displayed.length, displayed.length + PAGE_SIZE);
		displayed = [...displayed, ...next];
		hasMore = displayed.length < source.length;
		isLoadingMore = false;
	}

	// ── Helpers ──────────────────────────────────────────────────
	function formatPrice(price: number, currency: string): string {
		if (currency === '₩') return `${price.toLocaleString('ko-KR')}${currency}`;
		return `${currency}${price.toFixed(2)}`;
	}
</script>

<!-- ── Sticky header ──────────────────────────────────────────── -->
<div
	class="sticky top-0 z-10 bg-white px-6 py-5 sm:px-8 sm:py-6"
	style="border-bottom: 1px solid rgba(45, 45, 42, 0.06);"
>
	<div class="flex items-center gap-3">
		<button
			type="button"
			onclick={toggleSidebar}
			aria-label="사이드바 열기"
			class="flex size-9 shrink-0 items-center justify-center rounded-xl transition hover:bg-[#f7f6f3]"
			style="color: #6b6b65;"
		>
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="size-4" aria-hidden="true">
				<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
			</svg>
		</button>
		<div>
			<h1 class="text-2xl font-semibold sm:text-3xl" style="color: #1a1a17; letter-spacing: -0.02em;">
				{t('nav_home')}
			</h1>
			<p class="mt-0.5 hidden text-sm sm:block" style="color: #6b6b65;">
				{t('home_hot_subtitle')}
			</p>
		</div>
	</div>
</div>

<!-- ── Content ───────────────────────────────────────────────── -->
<div class="p-6 sm:p-8 lg:p-10" style="max-width: 1600px;">

	<!-- Site filter tabs -->
	<div class="mb-8 flex flex-wrap gap-2">
		{#each siteFilters as site}
			{@const cfg = siteConfig[site]}
			{@const isActive = selectedSite === site}
			<button
				type="button"
				onclick={() => (selectedSite = site)}
				class="rounded-xl px-4 py-2 text-sm font-medium transition-all"
				style="
					background-color: {isActive ? cfg.activeColor : 'transparent'};
					color: {isActive ? '#ffffff' : '#6b6b65'};
					border: 1.5px solid {isActive ? cfg.activeColor : 'rgba(45,45,42,0.1)'};
					box-shadow: {isActive ? `0 2px 8px ${cfg.activeColor}33` : 'none'};
				"
			>
				{cfg.label}
			</button>
		{/each}
	</div>

	<!-- Masonry grid: 컬럼별 독립 배열 → 새 아이템 추가 시 기존 배치 불변 -->
	<div class="flex items-start gap-4">
		{#each { length: colCount } as _, colIdx}
			<div class="flex flex-1 flex-col gap-4">
				{#each getColumnItems(colIdx) as product (product.id)}
					{@const siteCfg = siteConfig[product.site]}
					<a
						href={product.url}
						target="_blank"
						rel="noopener noreferrer"
						class="group block rounded-2xl bg-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl"
						style="border: 1px solid rgba(45, 45, 42, 0.07);"
					>
						<!-- Image -->
						<div
							class="relative overflow-hidden rounded-t-2xl {ASPECT_CLASSES[product.aspect]}"
							style="background-color: #f7f6f3;"
						>
							<img
								src={product.imageUrl}
								alt={product.title}
								class="size-full object-cover transition-transform duration-300 group-hover:scale-105"
								loading="lazy"
							/>
								{#if product.discountPct > 0}
								<div class="absolute right-3 top-3 rounded-lg px-2 py-1" style="background-color: #5aad9c;">
									<span class="text-xs font-bold text-white">-{product.discountPct}%</span>
								</div>
							{/if}
						</div>

						<!-- Body -->
						<div class="p-4">
							<div class="mb-2.5">
								<span
									class="inline-block rounded-lg px-2 py-0.5 text-xs font-medium"
									style="background-color: {siteCfg.badge.bg}; color: {siteCfg.badge.text};"
								>
									{siteCfg.label}
								</span>
							</div>
							<h3 class="mb-3 line-clamp-2 text-sm font-medium leading-snug" style="color: #1a1a17;">
								{product.title}
							</h3>
							<div>
								<span class="text-lg font-bold" style="color: #1a1a17;">
									{formatPrice(product.currentPrice, product.currency)}
								</span>
								<div class="mt-0.5 flex items-center gap-1.5">
									<span class="text-xs line-through" style="color: #b0b0a8;">
										{formatPrice(product.originalPrice, product.currency)}
									</span>
									<span class="text-xs font-semibold" style="color: #5aad9c;">
										{product.discountPct}% 할인
									</span>
								</div>
							</div>
						</div>
					</a>
				{/each}
			</div>
		{/each}
	</div>

	<!-- Sentinel + 로딩 / 완료 -->
	<div bind:this={sentinel} class="mt-10 flex justify-center pb-8">
		{#if isLoadingMore}
			<div class="flex items-center gap-2.5" style="color: #6b6b65;">
				<svg class="size-5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
					<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
					<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
				</svg>
				<span class="text-sm">상품 불러오는 중…</span>
			</div>
		{:else if !hasMore && displayed.length > 0}
			<p class="text-sm" style="color: #b0b0a8;">모든 상품을 확인했습니다</p>
		{/if}
	</div>

</div>
