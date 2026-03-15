<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { productDetailDummy, productDetailDummyEarpods } from '$lib/data/product-dummy';
	import type { ProductSku } from '$lib/data/product-dummy';

	type ParsedSku = {
		colorCode: string;
		size: string;
		price: number;
		originalPrice: number | null;
		image: string | null;
	};

	type ColorOption = { value: string; image: string | null };

	type PriceEntry = { date: string; price: number; change: number };

	type ItemDetail = {
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
		priceHistory: PriceEntry[];
	};

	// ── helpers ──────────────────────────────────────────────
	function parseKRW(str: string): number {
		return Number(str.replace(/[^0-9]/g, ''));
	}

	function sourceToSite(source: string): string {
		const map: Record<string, string> = {
			aliexpress: 'AliExpress',
			amazon: 'Amazon',
			ebay: 'eBay',
			taobao: 'Taobao'
		};
		return map[source.toLowerCase()] ?? source;
	}

	function formatKRW(n: number): string {
		return `₩${n.toLocaleString('ko-KR')}`;
	}

	function parseSkus(skus: ProductSku[]): ParsedSku[] {
		return skus.map((s) => {
			const parts = s.sku_name.split(' / ').map((p) => p.trim());
			return {
				colorCode: parts[0],
				size: parts[1] ?? '',
				price: parseKRW(s.price),
				originalPrice: s.original_price ? parseKRW(s.original_price) : null,
				image: s.image
			};
		});
	}

	// ── item map ─────────────────────────────────────────────
	const itemMap: Record<string, ItemDetail> = {};

	if (productDetailDummyEarpods.success && productDetailDummyEarpods.data) {
		const d = productDetailDummyEarpods.data;
		const base = parseKRW(d.skus[0].price);
		itemMap['earpods'] = {
			title: d.title,
			site: sourceToSite(d.source),
			imageUrl: d.main_image,
			url: d.url,
			currency: '₩',
			lastChecked: '5분 전',
			trackingFrequency: '6h',
			alertEnabled: true,
			alertThreshold: 340000,
			skus: parseSkus(d.skus),
			priceHistory: [
				{ date: '3월 7일', price: base, change: -8365 },
				{ date: '3월 6일', price: 365000, change: 0 },
				{ date: '3월 5일', price: 365000, change: 5000 },
				{ date: '3월 4일', price: 360000, change: -15000 },
				{ date: '3월 3일', price: 375000, change: 0 },
				{ date: '3월 2일', price: 375000, change: 10000 },
				{ date: '3월 1일', price: 365000, change: 0 },
				{ date: '2월 28일', price: 365000, change: -5000 }
			]
		};
	}

	if (productDetailDummy.success && productDetailDummy.data) {
		const d = productDetailDummy.data;
		const base = parseKRW(d.skus[0].price);
		itemMap['tshirt'] = {
			title: d.title,
			site: sourceToSite(d.source),
			imageUrl: d.main_image,
			url: d.url,
			currency: '₩',
			lastChecked: '1시간 전',
			trackingFrequency: '24h',
			alertEnabled: false,
			alertThreshold: 7000,
			skus: parseSkus(d.skus),
			priceHistory: [
				{ date: '3월 7일', price: base, change: -1551 },
				{ date: '3월 6일', price: 9886, change: 0 },
				{ date: '3월 5일', price: 9886, change: 500 },
				{ date: '3월 4일', price: 9386, change: -1000 },
				{ date: '3월 3일', price: 10386, change: 0 },
				{ date: '3월 2일', price: 10386, change: 1000 },
				{ date: '3월 1일', price: 9386, change: 0 },
				{ date: '2월 28일', price: 9386, change: -600 }
			]
		};
	}

	// ── reactive state ────────────────────────────────────────
	const id = $derived(page.params.id);
	const item = $derived(itemMap[id]);

	let selectedColor = $state('');
	let selectedSize = $state('');
	let alertEnabled = $state(false);
	let imgError = $state(false);

	const SIZE_ORDER = ['S', 'M', 'L', 'XL', 'XXL', '2XL', '3XL'];

	// Reset selections when item changes
	$effect(() => {
		if (!item) return;
		const first = item.skus[0];
		selectedColor = first?.colorCode ?? '';
		selectedSize = first?.size ?? '';
		alertEnabled = item.alertEnabled;
		imgError = false;
	});

	// Unique color options (preserving first-seen order)
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

	// Sizes available for the currently selected color
	const sizeOptions = $derived.by<string[]>(() => {
		if (!item || !selectedColor) return [];
		const sizes = item.skus
			.filter((s) => s.colorCode === selectedColor && s.size !== '')
			.map((s) => s.size);
		return [...new Set(sizes)].sort((a, b) => {
			const ai = SIZE_ORDER.indexOf(a);
			const bi = SIZE_ORDER.indexOf(b);
			return (ai < 0 ? 999 : ai) - (bi < 0 ? 999 : bi);
		});
	});

	const hasColors = $derived(colorOptions.length > 1);
	const hasSizes = $derived(sizeOptions.length > 0);

	// The exact SKU matching current selections
	const currentSku = $derived.by<ParsedSku | null>(() => {
		if (!item) return null;
		if (item.skus.length === 1) return item.skus[0];
		return (
			item.skus.find((s) => s.colorCode === selectedColor && s.size === selectedSize) ??
			item.skus[0]
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

	// Reset image error when displayed image changes
	$effect(() => {
		displayImage;
		imgError = false;
	});

	const siteColors: Record<string, { bg: string; text: string }> = {
		Amazon: { bg: '#fef3e8', text: '#c97d32' },
		Taobao: { bg: '#fef0e8', text: '#c96332' },
		eBay: { bg: '#fef9e8', text: '#c9a832' },
		AliExpress: { bg: '#fee8e8', text: '#c93232' },
		'1688': { bg: '#fef5e8', text: '#c99532' }
	};

	const siteBadgeStyle = $derived(siteColors[item?.site ?? ''] ?? { bg: '#f7f6f3', text: '#6b6b65' });

	function selectColor(color: string) {
		selectedColor = color;
		// Keep size if available for the new color, else pick first
		const sizes = item?.skus
			.filter((s) => s.colorCode === color && s.size !== '')
			.map((s) => s.size);
		if (sizes && sizes.length > 0 && !sizes.includes(selectedSize)) {
			selectedSize = sizes[0];
		}
	}

	function handleDelete() {
		if (confirm('이 상품 추적을 중단하시겠습니까?')) {
			goto('/');
		}
	}
</script>

{#if !item}
	<div class="flex flex-col items-center justify-center gap-4 p-12 text-center">
		<p class="text-sm" style="color: #6b6b65;">상품을 찾을 수 없습니다.</p>
		<a href="/" class="text-sm font-medium underline underline-offset-2" style="color: #1a1a17;">
			대시보드로 돌아가기
		</a>
	</div>
{:else}
	<!-- Sticky header -->
	<div class="sticky top-0 z-10 bg-white px-6 py-4 sm:px-8" style="border-bottom: 1px solid rgba(45, 45, 42, 0.06);">
		<a
			href="/"
			class="mb-3 inline-flex items-center gap-1.5 text-sm transition hover:opacity-70"
			style="color: #5aad9c;"
		>
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="size-4" aria-hidden="true">
				<path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
			</svg>
			<span>대시보드</span>
		</a>

		<div class="flex items-start justify-between gap-4">
			<div class="min-w-0 flex-1">
				<div class="flex flex-wrap items-center gap-2">
					<h1 class="line-clamp-2 text-base font-semibold sm:text-lg" style="color: #1a1a17;">{item.title}</h1>
					<span
						class="shrink-0 rounded-lg px-2.5 py-1 text-xs font-medium"
						style="background-color: {siteBadgeStyle.bg}; color: {siteBadgeStyle.text};"
					>
						{item.site}
					</span>
				</div>
				<a
					href={item.url}
					target="_blank"
					rel="noopener noreferrer"
					class="mt-1 inline-flex items-center gap-1 text-xs transition hover:opacity-70"
					style="color: #5aad9c;"
				>
					{item.site}에서 보기
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="size-3" aria-hidden="true">
						<path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
					</svg>
				</a>
			</div>

			<button
				type="button"
				onclick={handleDelete}
				class="flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium transition hover:bg-[#fee8e8]"
				style="color: #d4183d;"
			>
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="size-4" aria-hidden="true">
					<path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
				</svg>
				<span class="hidden sm:inline">삭제</span>
			</button>
		</div>
	</div>

	<!-- Content -->
	<div class="p-5 sm:p-7 lg:p-10">
		<div class="mx-auto max-w-5xl space-y-5 sm:space-y-6">

			<!-- Image + Price grid -->
			<div class="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2">
				<!-- Image -->
				<div
					class="flex items-center justify-center overflow-hidden rounded-2xl bg-white p-6"
					style="border: 1px solid rgba(45, 45, 42, 0.06);"
				>
					{#if !imgError && displayImage}
						<img
							src={displayImage}
							alt={item.title}
							class="max-h-72 w-full rounded-xl object-contain sm:max-h-96"
							onerror={() => (imgError = true)}
						/>
					{:else}
						<div class="flex h-48 w-full items-center justify-center rounded-xl sm:h-64" style="background-color: #f7f6f3;">
							<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="size-12" style="color: #6b6b65; opacity: 0.3;" aria-hidden="true">
								<path stroke-linecap="round" stroke-linejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
							</svg>
						</div>
					{/if}
				</div>

				<!-- Price + Tracking -->
				<div class="flex flex-col gap-5">
					<!-- Price card -->
					<div class="rounded-2xl bg-white p-6" style="border: 1px solid rgba(45, 45, 42, 0.06);">
						<p class="mb-1.5 text-xs font-medium" style="color: #6b6b65;">현재 가격</p>
						<div class="flex items-end gap-2.5">
							<p class="text-3xl font-semibold tabular-nums sm:text-4xl" style="color: #1a1a17;">
								{formatKRW(displayPrice)}
							</p>
							{#if discountPct}
								<span
									class="mb-1 rounded-lg px-2 py-0.5 text-sm font-semibold"
									style="background-color: #fee8e8; color: #d4183d;"
								>
									-{discountPct}%
								</span>
							{/if}
						</div>
						{#if originalPrice && originalPrice > displayPrice}
							<p class="mt-1 text-sm tabular-nums line-through" style="color: #6b6b65;">
								{formatKRW(originalPrice)}
							</p>
						{/if}
						{#if originalPrice && originalPrice > displayPrice}
							<div
								class="mt-4 inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-medium"
								style="background-color: #e8f2f0; color: #4a9384;"
							>
								<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="size-4" aria-hidden="true">
									<path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18 9 11.25l4.286-4.286a11.948 11.948 0 0 1 4.306 6.43l.776 2.898m0 0 3.182-5.511m-3.182 5.51-5.511-3.181" />
								</svg>
								{formatKRW(originalPrice - displayPrice)} 할인
							</div>
						{/if}
					</div>

					<!-- Tracking settings -->
					<div class="rounded-2xl bg-white p-5" style="border: 1px solid rgba(45, 45, 42, 0.06);">
						<div style="border-top: 0;">
							<div class="flex items-center justify-between py-3" style="border-bottom: 1px solid rgba(45, 45, 42, 0.06);">
								<div class="flex items-center gap-2 text-sm" style="color: #6b6b65;">
									<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="size-4 shrink-0" aria-hidden="true">
										<path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
									</svg>
									마지막 확인
								</div>
								<span class="text-sm font-medium" style="color: #1a1a17;">{item.lastChecked}</span>
							</div>
							<div class="flex items-center justify-between py-3" style="border-bottom: 1px solid rgba(45, 45, 42, 0.06);">
								<div class="flex items-center gap-2 text-sm" style="color: #6b6b65;">
									<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="size-4 shrink-0" aria-hidden="true">
										<path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
									</svg>
									확인 주기
								</div>
								<span class="text-sm font-medium" style="color: #1a1a17;">매 {item.trackingFrequency}마다</span>
							</div>
							<div class="flex items-center justify-between py-3">
								<div class="flex items-center gap-2 text-sm" style="color: #6b6b65;">
									<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="size-4 shrink-0" aria-hidden="true">
										<path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
									</svg>
									가격 알림
								</div>
								<button
									type="button"
									onclick={() => (alertEnabled = !alertEnabled)}
									class="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium transition"
									style="
										background-color: {alertEnabled ? '#e8f2f0' : 'transparent'};
										color: {alertEnabled ? '#1a1a17' : '#6b6b65'};
									"
								>
									{alertEnabled ? `${formatKRW(item.alertThreshold)} 이하` : '꺼짐'}
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- SKU selector -->
			{#if hasColors || hasSizes}
				<div class="rounded-2xl bg-white p-6 space-y-6" style="border: 1px solid rgba(45, 45, 42, 0.06);">
					<!-- Color/Design selector -->
					{#if hasColors}
						<div>
							<p class="mb-3 text-sm font-medium" style="color: #1a1a17;">
								디자인
								<span class="ml-1.5 text-xs font-normal" style="color: #6b6b65;">{colorOptions.length}가지</span>
							</p>
							<div class="flex flex-wrap gap-2.5">
								{#each colorOptions as opt}
									{#if opt.image}
										<button
											type="button"
											onclick={() => selectColor(opt.value)}
											title={opt.value}
											class="size-12 overflow-hidden rounded-xl border-2 transition sm:size-14"
											style="
												border-color: {selectedColor === opt.value ? '#2d2d2a' : 'transparent'};
												box-shadow: {selectedColor === opt.value ? '0 1px 4px rgba(0,0,0,0.12)' : 'none'};
											"
										>
											<img src={opt.image} alt={opt.value} class="size-full object-cover" />
										</button>
									{:else}
										<button
											type="button"
											onclick={() => selectColor(opt.value)}
											class="rounded-xl border px-3.5 py-2 text-sm font-medium transition"
											style="
												border-color: {selectedColor === opt.value ? '#2d2d2a' : 'rgba(45, 45, 42, 0.1)'};
												background-color: {selectedColor === opt.value ? '#2d2d2a' : 'transparent'};
												color: {selectedColor === opt.value ? '#ffffff' : '#1a1a17'};
											"
										>
											{opt.value}
										</button>
									{/if}
								{/each}
							</div>
						</div>
					{/if}

					<!-- Size selector -->
					{#if hasSizes}
						<div>
							<p class="mb-3 text-sm font-medium" style="color: #1a1a17;">사이즈</p>
							<div class="flex flex-wrap gap-2.5">
								{#each sizeOptions as size}
									{@const skuForSize = item.skus.find(
										(s) => s.colorCode === selectedColor && s.size === size
									)}
									<button
										type="button"
										onclick={() => (selectedSize = size)}
										class="min-w-[3rem] rounded-xl border px-3.5 py-2 text-sm font-medium transition"
										style="
											border-color: {selectedSize === size ? '#2d2d2a' : 'rgba(45, 45, 42, 0.1)'};
											background-color: {selectedSize === size ? '#2d2d2a' : 'transparent'};
											color: {selectedSize === size ? '#ffffff' : '#1a1a17'};
										"
									>
										{size}
										{#if skuForSize && skuForSize.price !== (item.skus.find((s) => s.colorCode === selectedColor && s.size === sizeOptions[0])?.price ?? 0)}
											<span class="block text-[10px] leading-tight opacity-70">
												{formatKRW(skuForSize.price)}
											</span>
										{/if}
									</button>
								{/each}
							</div>
						</div>
					{/if}

					<!-- Selected summary -->
					{#if currentSku}
						<div class="rounded-xl px-5 py-3.5 text-sm" style="background-color: #f7f6f3;">
							<span style="color: #6b6b65;">선택된 옵션:</span>
							<span class="ml-1.5 font-medium" style="color: #1a1a17;">
								{currentSku.colorCode}{currentSku.size ? ` / ${currentSku.size}` : ''}
							</span>
							<span class="ml-3 font-semibold tabular-nums" style="color: #1a1a17;">
								{formatKRW(currentSku.price)}
							</span>
						</div>
					{/if}
				</div>
			{/if}

			<!-- Price history -->
			<div class="rounded-2xl bg-white p-6" style="border: 1px solid rgba(45, 45, 42, 0.06);">
				<h2 class="mb-5 text-base font-semibold" style="color: #1a1a17;">가격 히스토리</h2>

				<!-- Chart placeholder -->
				<div
					class="mb-5 flex h-40 items-center justify-center rounded-xl sm:h-56"
					style="border: 1px solid rgba(45, 45, 42, 0.06); background-color: #f7f6f3;"
				>
					<div class="text-center">
						<div
							class="mx-auto mb-2.5 flex size-11 items-center justify-center rounded-xl"
							style="background-color: #e8e7e3;"
						>
							<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="size-5" style="color: #6b6b65;" aria-hidden="true">
								<path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18 9 11.25l4.286-4.286a11.948 11.948 0 0 1 4.306 6.43l.776 2.898m0 0 3.182-5.511m-3.182 5.51-5.511-3.181" />
							</svg>
						</div>
						<p class="text-xs" style="color: #6b6b65;">가격 차트가 곧 제공됩니다</p>
					</div>
				</div>

				<!-- History list -->
				<div>
					{#each item.priceHistory as entry, i}
						<div
							class="flex items-center justify-between py-3"
							style="{i < item.priceHistory.length - 1 ? 'border-bottom: 1px solid rgba(45, 45, 42, 0.06);' : ''}"
						>
							<span class="text-sm" style="color: #6b6b65;">{entry.date}</span>
							<div class="flex items-center gap-4">
								<span class="text-sm font-medium tabular-nums" style="color: #1a1a17;">{formatKRW(entry.price)}</span>
								{#if entry.change < 0}
									<span class="w-24 text-right text-sm font-medium tabular-nums" style="color: #5aad9c;">
										−{formatKRW(Math.abs(entry.change))}
									</span>
								{:else if entry.change > 0}
									<span class="w-24 text-right text-sm font-medium tabular-nums" style="color: #d4183d;">
										+{formatKRW(entry.change)}
									</span>
								{:else}
									<span class="w-24 text-right text-sm" style="color: #6b6b65; opacity: 0.5;">변동 없음</span>
								{/if}
							</div>
						</div>
					{/each}
				</div>
			</div>

		</div>
	</div>
{/if}
