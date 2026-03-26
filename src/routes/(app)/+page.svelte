<script lang="ts">
	import { untrack, tick } from 'svelte';
	import { t } from '$lib/i18n/t';

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

	const siteFilters: SiteFilter[] = ['all', 'AliExpress', 'eBay', 'Coupang'];
	const siteLabels: Record<SiteFilter, string> = {
		all: 'All',
		AliExpress: 'AliExpress',
		eBay: 'eBay',
		Coupang: '쿠팡'
	};

	const ALL_PRODUCTS: HotProduct[] = [
		{ id: 'a01', aspect: 'portrait',  site: 'AliExpress', isHot: true,  discountPct: 57, currency: '$', currentPrice: 12.99,  originalPrice: 29.99,  title: 'TWS 블루투스 이어폰 노이즈캔슬링 ANC 인이어',       imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&fit=crop&auto=format', url: 'https://www.aliexpress.com/wholesale?SearchText=tws+bluetooth+earphone' },
		{ id: 'a02', aspect: 'landscape', site: 'AliExpress', isHot: false, discountPct: 42, currency: '$', currentPrice: 34.99,  originalPrice: 59.99,  title: '메카니컬 키보드 RGB 백라이트 게이밍 적축',           imageUrl: 'https://images.unsplash.com/photo-1595044426077-d36d9236d54a?w=400&fit=crop&auto=format', url: 'https://www.aliexpress.com/wholesale?SearchText=mechanical+keyboard+rgb' },
		{ id: 'a03', aspect: 'square',    site: 'AliExpress', isHot: true,  discountPct: 56, currency: '$', currentPrice: 19.99,  originalPrice: 45.00,  title: '스마트 워치 피트니스 트래커 혈중산소 심박수 모니터',   imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&fit=crop&auto=format', url: 'https://www.aliexpress.com/wholesale?SearchText=smart+watch+fitness' },
		{ id: 'a04', aspect: 'portrait',  site: 'AliExpress', isHot: false, discountPct: 41, currency: '$', currentPrice: 22.50,  originalPrice: 38.00,  title: 'LED 링 라이트 18인치 3색 밝기 조절 삼각대',           imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&fit=crop&auto=format', url: 'https://www.aliexpress.com/wholesale?SearchText=led+ring+light' },
		{ id: 'a05', aspect: 'square',    site: 'AliExpress', isHot: false, discountPct: 47, currency: '$', currentPrice: 16.99,  originalPrice: 32.00,  title: '포터블 블루투스 스피커 방수 IPX7 울트라 베이스',       imageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&fit=crop&auto=format', url: 'https://www.aliexpress.com/wholesale?SearchText=bluetooth+speaker' },
		{ id: 'a06', aspect: 'landscape', site: 'AliExpress', isHot: false, discountPct: 55, currency: '$', currentPrice:  8.99,  originalPrice: 19.99,  title: '미니 드라이버 세트 정밀 핸드폰 수리 공구',             imageUrl: 'https://images.unsplash.com/photo-1581147036324-c1c893cac3b4?w=400&fit=crop&auto=format', url: 'https://www.aliexpress.com/wholesale?SearchText=precision+screwdriver' },
		{ id: 'e01', aspect: 'square',    site: 'eBay',       isHot: true,  discountPct: 25, currency: '$', currentPrice: 299.00, originalPrice: 399.99, title: 'GoPro HERO 11 Black 액션 카메라 방수 케이스 번들',    imageUrl: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&fit=crop&auto=format', url: 'https://www.ebay.com/sch/i.html?_nkw=gopro+hero+11' },
		{ id: 'e02', aspect: 'portrait',  site: 'eBay',       isHot: true,  discountPct: 26, currency: '$', currentPrice: 279.99, originalPrice: 379.99, title: 'Sony WH-1000XM5 무선 노이즈캔슬링 헤드폰',           imageUrl: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400&fit=crop&auto=format', url: 'https://www.ebay.com/sch/i.html?_nkw=sony+wh1000xm5' },
		{ id: 'e03', aspect: 'landscape', site: 'eBay',       isHot: false, discountPct: 29, currency: '$', currentPrice:  99.95, originalPrice: 139.99, title: 'LEGO Technic 42154 Ford GT 1:12 레플리카 세트',       imageUrl: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400&fit=crop&auto=format', url: 'https://www.ebay.com/sch/i.html?_nkw=lego+technic' },
		{ id: 'e04', aspect: 'portrait',  site: 'eBay',       isHot: false, discountPct: 49, currency: '$', currentPrice:  45.00, originalPrice:  89.00, title: "Vintage Levi's 501 데님 재킷 클래식 와이드 핏",       imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&fit=crop&auto=format', url: 'https://www.ebay.com/sch/i.html?_nkw=vintage+levis+501' },
		{ id: 'e07', aspect: 'portrait',  site: 'eBay',       isHot: true,  discountPct: 31, currency: '$', currentPrice: 249.00, originalPrice: 359.00, title: 'Beats Studio Pro 무선 노이즈캔슬링 헤드폰 블랙',      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&fit=crop&auto=format', url: 'https://www.ebay.com/sch/i.html?_nkw=beats+studio+pro' },
		{ id: 'e12', aspect: 'landscape', site: 'eBay',       isHot: true,  discountPct: 40, currency: '$', currentPrice: 359.00, originalPrice: 599.00, title: 'Dyson V8 Animal 무선 청소기 리퍼 + 액세서리',        imageUrl: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=400&fit=crop&auto=format', url: 'https://www.ebay.com/sch/i.html?_nkw=dyson+v8+animal' },
		{ id: 'c01', aspect: 'portrait',  site: 'Coupang',    isHot: true,  discountPct: 40, currency: '₩', currentPrice:  89000, originalPrice: 149000, title: '필립스 에어프라이어 XXL HD9762 6.2L 1700W 디지털',  imageUrl: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=400&fit=crop&auto=format', url: 'https://www.coupang.com/np/search?q=에어프라이어' },
		{ id: 'c02', aspect: 'square',    site: 'Coupang',    isHot: false, discountPct: 35, currency: '₩', currentPrice: 129000, originalPrice: 199000, title: '네스프레소 버츄오 플러스 D 캡슐 커피머신 블랙',     imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&fit=crop&auto=format', url: 'https://www.coupang.com/np/search?q=네스프레소' },
		{ id: 'c03', aspect: 'landscape', site: 'Coupang',    isHot: true,  discountPct: 22, currency: '₩', currentPrice: 699000, originalPrice: 899000, title: '다이슨 V15 디텍트 앱솔루트 무선 청소기 퍼플',      imageUrl: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=400&fit=crop&auto=format', url: 'https://www.coupang.com/np/search?q=다이슨+v15' },
		{ id: 'c06', aspect: 'landscape', site: 'Coupang',    isHot: true,  discountPct: 33, currency: '₩', currentPrice: 199000, originalPrice: 299000, title: '삼성 갤럭시 버즈3 프로 이어폰 노이즈캔슬링',       imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&fit=crop&auto=format', url: 'https://www.coupang.com/np/search?q=갤럭시+버즈3' },
		{ id: 'c09', aspect: 'landscape', site: 'Coupang',    isHot: true,  discountPct: 37, currency: '₩', currentPrice: 109000, originalPrice: 172000, title: '나이키 에어포스 1 07 화이트 남성 운동화',          imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&fit=crop&auto=format', url: 'https://www.coupang.com/np/search?q=나이키+에어포스1' },
	];

	const PAGE_SIZE = 8;
	let selectedSite = $state<SiteFilter>('all');
	let displayed = $state<HotProduct[]>([]);
	let isLoadingMore = $state(false);
	let hasMore = $state(true);
	let sentinel = $state<HTMLElement | undefined>();
	let observerCooldown = false;

	const source = $derived(
		selectedSite === 'all' ? ALL_PRODUCTS : ALL_PRODUCTS.filter((p) => p.site === selectedSite)
	);

	const biggestDrops = $derived(
		[...ALL_PRODUCTS].sort((a, b) => b.discountPct - a.discountPct).slice(0, 5)
	);

	const avgDiscount = $derived(
		Math.round(ALL_PRODUCTS.reduce((s, p) => s + p.discountPct, 0) / ALL_PRODUCTS.length)
	);

	$effect(() => {
		const s = source;
		untrack(() => {
			displayed = s.slice(0, PAGE_SIZE);
			hasMore = displayed.length < s.length;
			isLoadingMore = false;
		});
	});

	$effect(() => {
		if (!sentinel) return;
		const observer = new IntersectionObserver(
			(entries) => {
				if (!entries[0].isIntersecting || observerCooldown || isLoadingMore || !hasMore) return;
				observerCooldown = true;
				void loadMore().finally(() => {
					setTimeout(() => {
						observerCooldown = false;
					}, 80);
				});
			},
			{ root: null, rootMargin: '280px', threshold: 0 }
		);
		observer.observe(sentinel);
		return () => observer.disconnect();
	});

	async function loadMore() {
		if (isLoadingMore || !hasMore) return;
		isLoadingMore = true;
		await tick();
		const next = source.slice(displayed.length, displayed.length + PAGE_SIZE);
		if (next.length === 0) {
			hasMore = false;
			isLoadingMore = false;
			return;
		}
		displayed = [...displayed, ...next];
		hasMore = displayed.length < source.length;
		isLoadingMore = false;
	}

	function fmt(price: number, currency: string): string {
		if (currency === '₩') return `${price.toLocaleString('ko-KR')}${currency}`;
		return `${currency}${price.toFixed(2)}`;
	}
</script>

<div class="space-y-6 px-4 py-6 sm:space-y-8 sm:px-6 sm:py-8 lg:px-10 lg:py-10">

	<!-- ── Hero ─────────────────────────────────────────────────── -->
	<div class="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
		<div class="max-w-2xl">
			<div class="mb-6 inline-flex items-center gap-2 rounded-full border border-zinc-200/50 bg-zinc-100/80 px-3 py-1.5">
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="size-3.5 text-stone-600" aria-hidden="true">
					<polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
					<polyline points="16 7 22 7 22 13" />
				</svg>
				<span class="text-xs font-semibold text-stone-800">Live Price Tracking</span>
			</div>
			<h1 class="text-4xl font-semibold tracking-tight text-zinc-900 md:text-5xl lg:text-6xl leading-tight">
				Discover Your Next<br />
				<span class="text-zinc-700">Smart Purchase</span>
			</h1>
			<p class="mt-6 text-base leading-relaxed text-zinc-600">
				{t('discover_hero_desc_line1')}<br class="hidden sm:block" />
				{t('discover_hero_desc_line2')}
			</p>
		</div>
		<div class="shrink-0">
			<a
				href="/items"
				class="inline-flex items-center gap-2 rounded-2xl px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-zinc-900/10 transition-all duration-300 hover:shadow-xl hover:shadow-zinc-900/15 hover:-translate-y-0.5"
				style="background: linear-gradient(to right, #292524, #3f3f46);"
			>
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="size-4" aria-hidden="true">
					<path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
				</svg>
				{t('home_add_item')}
			</a>
		</div>
	</div>

	<!-- ── Filter + Stats bar ────────────────────────────────────── -->
	<div class="flex flex-col gap-4 rounded-3xl border border-zinc-200/60 bg-white/60 p-3 shadow-sm backdrop-blur-sm lg:flex-row lg:items-center lg:justify-between">
		<!-- Marketplace tabs -->
		<div class="overflow-x-auto pb-1 lg:pb-0" style="-ms-overflow-style: none; scrollbar-width: none;">
			<div class="flex gap-1.5 rounded-2xl bg-zinc-50/80 p-1.5">
				{#each siteFilters as site}
					<button
						type="button"
						onclick={() => (selectedSite = site)}
						class="whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200
							{selectedSite === site
								? 'bg-white text-stone-800 shadow-sm ring-1 ring-zinc-200/80'
								: 'text-zinc-600 hover:bg-zinc-100/60 hover:text-zinc-900'}"
					>
						{siteLabels[site]}
					</button>
				{/each}
			</div>
		</div>

		<!-- Stats -->
		<div class="flex gap-3 px-2 pb-2 lg:px-0 lg:pb-0">
			<div class="flex flex-col rounded-2xl border border-emerald-100/50 bg-gradient-to-br from-emerald-50 to-teal-50 px-5 py-3">
				<span class="text-[9px] font-semibold uppercase tracking-wider text-emerald-700/70">Avg Savings</span>
				<span class="mt-1 text-xl font-semibold text-emerald-700">{avgDiscount}%</span>
			</div>
			<div class="flex flex-col rounded-2xl border border-zinc-200/50 bg-gradient-to-br from-stone-100 to-zinc-100 px-5 py-3">
				<span class="text-[9px] font-semibold uppercase tracking-wider text-stone-600">Hot Deals</span>
				<span class="mt-1 text-xl font-semibold text-stone-800">{ALL_PRODUCTS.filter(p => p.isHot).length}</span>
			</div>
		</div>
	</div>

	<!-- ── Main: two columns (flex + items-start — grid stretch로 인한 열 높이 동기화 방지) -->
	<div class="flex flex-col gap-8 xl:flex-row xl:items-start xl:gap-10">

		<div class="min-w-0 flex-1 space-y-8">

			<!-- Section header -->
			<div class="flex items-center justify-between">
				<div class="flex items-center gap-4">
					<div class="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-100 to-amber-100 text-orange-600 shadow-sm">
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-5" aria-hidden="true">
							<polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
						</svg>
					</div>
					<div>
						<h2 class="text-2xl font-semibold tracking-tight text-zinc-900">Trending Now</h2>
						<p class="mt-1 text-sm text-zinc-500">실시간으로 가장 많이 조회되는 상품</p>
					</div>
				</div>
			</div>

			<div class="flex flex-col gap-3">
				{#each displayed as product (product.id)}
					<a
						href={product.url}
						target="_blank"
						rel="noopener noreferrer"
						class="group flex flex-col gap-3 rounded-3xl border border-zinc-200/60 bg-white/60 p-4 backdrop-blur-sm transition-all duration-300 hover:border-stone-300/60 hover:shadow-lg hover:shadow-stone-500/5 sm:gap-4 sm:p-5 md:flex-row md:items-center md:rounded-2xl md:p-4 md:gap-5"
					>
						<!-- Row 1 (mobile): image left + HOT badge right -->
						<div class="flex items-start justify-between md:block">
							<div class="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-zinc-200/60 bg-zinc-100 shadow-sm sm:h-24 sm:w-24 sm:rounded-2xl md:h-16 md:w-16 md:rounded-xl">
								<img
									src={product.imageUrl}
									alt={product.title}
									class="size-full object-cover transition-transform duration-500 group-hover:scale-105"
									loading="lazy"
								/>
							</div>
							{#if product.isHot}
								<span class="md:hidden rounded-lg px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-white shadow-sm" style="background: linear-gradient(135deg, #292524, #3f3f46);">
									HOT
								</span>
							{/if}
						</div>

						<!-- Row 2: title + marketplace badge -->
						<div class="min-w-0 flex-1 flex flex-col justify-center">
							<h3 class="line-clamp-2 text-sm font-semibold text-zinc-900 transition-colors group-hover:text-stone-800 md:line-clamp-1">
								{product.title}
							</h3>
							<div class="mt-2 flex items-center gap-2 md:mt-1.5">
								<span class="rounded-lg border border-zinc-200/60 bg-zinc-50/80 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-600">
									{siteLabels[product.site]}
								</span>
								{#if product.isHot}
									<span class="hidden md:inline-flex rounded-lg px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white" style="background: linear-gradient(135deg, #292524, #3f3f46);">
										HOT
									</span>
								{/if}
							</div>
						</div>

						<!-- Row 3 (mobile): price left + discount right / desktop: separate columns via md:contents -->
						<div class="flex items-center justify-between border-t border-zinc-100 pt-3 md:contents md:border-0 md:pt-0">
							<div class="flex flex-col md:w-28 md:items-end">
								<span class="text-lg font-semibold tracking-tight text-zinc-900 sm:text-xl md:text-base">
									{fmt(product.currentPrice, product.currency)}
								</span>
								<span class="text-xs font-medium text-zinc-400 line-through">
									{fmt(product.originalPrice, product.currency)}
								</span>
							</div>
							<div class="shrink-0 md:w-20 md:flex md:justify-end">
								<span class="inline-flex items-center gap-1 rounded-full border border-emerald-100/50 bg-gradient-to-r from-emerald-50 to-teal-50 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-emerald-700 shadow-sm">
									<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="size-3" aria-hidden="true">
										<path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18 9 11.25l4.286-4.286a11.948 11.948 0 0 1 4.306 6.43l.776 2.898m0 0 3.182-5.511m-3.182 5.51-5.511-3.181" />
									</svg>
									-{product.discountPct}%
								</span>
							</div>
						</div>
					</a>
				{/each}
			</div>

			<div
				bind:this={sentinel}
				class="flex min-h-[52px] items-center justify-center py-4 [overflow-anchor:none]"
				aria-busy={isLoadingMore}
			>
				<div class="flex min-h-6 items-center justify-center text-sm text-zinc-400">
					{#if isLoadingMore}
						<span class="inline-flex items-center gap-2">
							<svg class="size-4 shrink-0 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
								<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
								<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
							</svg>
							불러오는 중…
						</span>
					{:else if !hasMore && displayed.length > 0}
						<span>모든 상품을 확인했습니다</span>
					{/if}
				</div>
			</div>
		</div>

		<aside class="w-full shrink-0 [contain:layout] xl:w-[340px] xl:sticky xl:top-[80px] xl:self-start">
			<div class="rounded-3xl border border-zinc-200/60 bg-white/60 p-7 shadow-sm backdrop-blur-sm">
				<div class="mb-7 flex items-center justify-between">
					<h3 class="text-lg font-semibold tracking-tight text-zinc-900">Biggest Drops</h3>
					<span class="rounded-full border border-zinc-200/60 bg-gradient-to-r from-zinc-100 to-zinc-50 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-wider text-zinc-600">
						Today
					</span>
				</div>

				<div class="flex flex-col gap-4">
					{#each biggestDrops as item (item.id)}
						<a
							href={item.url}
							target="_blank"
							rel="noopener noreferrer"
							class="group -mx-3 flex items-center gap-4 rounded-2xl p-3 transition-all duration-200 hover:bg-zinc-50/80"
						>
							<div class="size-16 shrink-0 overflow-hidden rounded-xl border border-zinc-200/60 bg-zinc-100 shadow-sm">
								<img
									src={item.imageUrl}
									alt={item.title}
									class="size-full object-cover transition-transform duration-500 group-hover:scale-105"
									loading="lazy"
								/>
							</div>
							<div class="min-w-0 flex-1">
								<h4 class="truncate text-sm font-semibold text-zinc-900 transition-colors group-hover:text-stone-800">
									{item.title}
								</h4>
								<p class="mt-0.5 text-xs font-medium text-zinc-400">{siteLabels[item.site]}</p>
							</div>
							<div class="shrink-0 text-right">
								<div class="text-sm font-semibold text-emerald-600">-{item.discountPct}%</div>
								<div class="text-xs text-zinc-400">{fmt(item.currentPrice, item.currency)}</div>
							</div>
						</a>
					{/each}
				</div>

				<a
					href="/items"
					class="mt-7 block w-full rounded-2xl border border-zinc-200/60 bg-zinc-50/80 py-3.5 text-center text-sm font-medium text-zinc-700 transition-all duration-200 hover:bg-zinc-100 hover:text-zinc-900"
				>
					{t('home_add_item')} →
				</a>
			</div>
		</aside>
	</div>

</div>
