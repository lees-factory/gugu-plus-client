<script lang="ts">
	import type { PageProps } from './$types';
	import { localizeHref } from '$lib/paraglide/runtime.js';
	import { t } from '$lib/i18n/t';
	import { createItemDetailPageModel } from './item-detail-page.svelte';
	import PriceChart from '$lib/components/PriceChart.svelte';

	let { data }: PageProps = $props();

	const page = createItemDetailPageModel(() => data.product, () => data.skus);

	// item / 정적 파생값 - 초기 렌더 이후 변하지 않음
	const item = $derived(page.item);
	const siteBadgeStyle = $derived(page.siteBadgeStyle);
	const showMatrixPanel = $derived(page.showMatrixPanel);
	const showColorRow = $derived(page.showColorRow);
	const matrixColorOptions = $derived(page.matrixColorOptions);
	const showSizeRow = $derived(page.showSizeRow);
	const matrixSizeOptions = $derived(page.matrixSizeOptions);
	const hasSkuList = $derived(page.hasSkuList);

	// 인터랙션 반응형 값 — page.ui($state 프록시)를 직접 읽어서 컴포넌트 컨텍스트에서 계산
	const effectivePropColor = $derived(
		page.ui.propColor || item?.skus[0]?.propColor || ''
	);
	const availableSizesForColor = $derived(
		new Set(
			item?.skus
				.filter((s) => s.propColor === effectivePropColor)
				.map((s) => s.propSize)
				.filter((x): x is string => !!x && x !== '') ?? []
		)
	);
	const effectivePropSize = $derived.by(() => {
		const ordered = matrixSizeOptions.filter((sz) => availableSizesForColor.has(sz));
		if (!ordered.length) return page.ui.propSize;
		if (ordered.includes(page.ui.propSize)) return page.ui.propSize;
		return ordered[0];
	});
	const currentSku = $derived.by(() => {
		if (!item) return null;
		if (item.skus.length === 1) return item.skus[0];
		if (item.variantMatrix) {
			const match = item.skus.find(
				(s) => s.propColor === effectivePropColor && s.propSize === effectivePropSize
			);
			return match ?? item.skus.find((s) => s.propColor === effectivePropColor) ?? item.skus[0];
		}
		return item.skus.find((s) => s.skuId === page.ui.selectedSkuId) ?? item.skus[0];
	});
	const displayImage = $derived(currentSku?.image ?? item?.imageUrl ?? '');
	const displayPrice = $derived(currentSku?.price ?? 0);
	const originalPrice = $derived(currentSku?.originalPrice ?? null);
	const discountPct = $derived(
		originalPrice && originalPrice > displayPrice
			? Math.round((1 - displayPrice / originalPrice) * 100)
			: null
	);
</script>

{#if data.error}
	<div class="flex flex-col items-center justify-center gap-4 p-12 text-center">
		<p class="text-sm text-rose-600">{data.error}</p>
		<a href={localizeHref('/items')} class="text-sm font-medium underline underline-offset-2 text-zinc-900">
			{t('back_to_dashboard')}
		</a>
	</div>
{:else if !item}
	<div class="flex flex-col items-center justify-center gap-4 p-12 text-center">
		<p class="text-sm text-zinc-500">{t('not_found')}</p>
		<a href={localizeHref('/items')} class="text-sm font-medium underline underline-offset-2 text-zinc-900">
			{t('back_to_dashboard')}
		</a>
	</div>
{:else}
	<!-- Sticky header -->
	<div class="sticky top-0 z-10 border-b border-zinc-200/50 bg-white/70 backdrop-blur-2xl px-6 py-4 sm:px-8">
		<a
			href={localizeHref('/items')}
			class="mb-3 inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 transition-all duration-200 hover:text-zinc-900"
		>
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="size-4" aria-hidden="true">
				<path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
			</svg>
			<span>{t('detail_back_dashboard')}</span>
		</a>

		<div class="flex items-start justify-between gap-4">
			<div class="min-w-0 flex-1">
				<div class="flex flex-wrap items-center gap-2">
					<h1 class="line-clamp-2 text-base font-semibold tracking-tight text-zinc-900 sm:text-lg">{item.title}</h1>
					<span class="shrink-0 rounded-lg border border-zinc-200/60 bg-zinc-50/80 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-600">
						{item.site}
					</span>
				</div>
				<a
					href={item.url}
					target="_blank"
					rel="noopener noreferrer"
					class="mt-1 inline-flex items-center gap-1 text-xs text-zinc-400 transition-all duration-200 hover:text-zinc-700"
				>
					{t('detail_view_on_site', { site: item.site })}
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="size-3" aria-hidden="true">
						<path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
					</svg>
				</a>
			</div>

			<button
				type="button"
				onclick={page.handleDelete}
				disabled={page.ui.deleting || !item.trackedItemId}
				class="flex shrink-0 items-center gap-1.5 rounded-2xl px-3 py-2 text-sm font-medium text-zinc-500 transition-all duration-200 hover:bg-rose-50 hover:text-rose-700 disabled:opacity-40"
			>
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="size-4" aria-hidden="true">
					<path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
				</svg>
				<span class="hidden sm:inline">{page.ui.deleting ? t('detail_deleting') : t('detail_delete')}</span>
			</button>
		</div>
	</div>

	<!-- Content -->
	<div class="p-5 sm:p-7 lg:p-10">
		<div class="mx-auto max-w-5xl space-y-5 sm:space-y-6">

			<!-- Image + Price grid -->
			<div class="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2">
				<!-- Image -->
				<div class="flex items-center justify-center overflow-hidden rounded-3xl bg-white/60 backdrop-blur-sm border border-zinc-200/60 p-6">
					{#if !page.ui.imgError && displayImage}
						{#key `${currentSku?.skuId ?? ''}|${displayImage}`}
							<img
								src={displayImage}
								alt={item.title}
								class="max-h-72 w-full rounded-xl object-contain sm:max-h-96"
								onerror={page.onImageError}
							/>
						{/key}
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
					<div class="rounded-3xl bg-white/60 backdrop-blur-sm border border-zinc-200/60 p-6">
						<p class="mb-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-400">{t('detail_current_price')}</p>
						<div class="flex items-end gap-2.5">
							<p class="text-3xl font-semibold tabular-nums tracking-tight text-zinc-900 sm:text-4xl">
								{page.fmt(displayPrice)}
							</p>
							{#if discountPct}
								<span class="mb-1 rounded-xl bg-rose-50 border border-rose-100/50 px-2.5 py-0.5 text-sm font-semibold text-rose-600">
									-{discountPct}%
								</span>
							{/if}
						</div>
						{#if originalPrice && originalPrice > displayPrice}
							<p class="mt-1 text-sm tabular-nums line-through text-zinc-400">
								{page.fmt(originalPrice)}
							</p>
						{/if}
						{#if originalPrice && originalPrice > displayPrice}
							<div class="mt-4 inline-flex items-center gap-1.5 rounded-2xl border border-emerald-100/50 bg-gradient-to-r from-emerald-50 to-teal-50 px-3.5 py-2 text-sm font-semibold text-emerald-700">
								<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="size-4" aria-hidden="true">
									<path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18 9 11.25l4.286-4.286a11.948 11.948 0 0 1 4.306 6.43l.776 2.898m0 0 3.182-5.511m-3.182 5.51-5.511-3.181" />
								</svg>
								{t('detail_savings', { amount: page.fmt(originalPrice - displayPrice) })}
							</div>
						{/if}
					</div>

					<!-- Tracking settings -->
					<div class="rounded-3xl bg-white/60 backdrop-blur-sm border border-zinc-200/60 p-5">
						<div>
							<div class="flex items-center justify-between py-3 border-b border-zinc-100">
								<div class="flex items-center gap-2 text-sm text-zinc-500">
									<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="size-4 shrink-0" aria-hidden="true">
										<path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
									</svg>
									{t('detail_last_checked')}
								</div>
								<span class="text-sm font-medium text-zinc-900">{item.lastChecked}</span>
							</div>
							<div class="flex items-center justify-between py-3 border-b border-zinc-100">
								<div class="flex items-center gap-2 text-sm text-zinc-500">
									<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="size-4 shrink-0" aria-hidden="true">
										<path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
									</svg>
									{t('detail_check_interval')}
								</div>
								<span class="text-sm font-medium text-zinc-900">{t('detail_every_frequency', { frequency: item.trackingFrequency })}</span>
							</div>
							<div class="flex items-center justify-between py-3">
								<div class="flex items-center gap-2 text-sm text-zinc-500">
									<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="size-4 shrink-0" aria-hidden="true">
										<path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
									</svg>
									{t('detail_price_alert')}
								</div>
								<button
									type="button"
									onclick={page.toggleAlert}
									class="flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-sm font-medium transition-all duration-200 {page.ui.alertEnabled ? 'bg-emerald-50 text-emerald-700 border border-emerald-100/50' : 'text-zinc-500 hover:text-zinc-900'}"
								>
									{page.ui.alertEnabled
										? t('detail_alert_below', { price: page.fmt(item.alertThreshold) })
										: t('detail_alert_off')}
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- sku_properties: 색상 / 크기 매트릭스 -->
			{#if showMatrixPanel}
				<div class="rounded-3xl bg-white/60 backdrop-blur-sm border border-zinc-200/60 p-6 space-y-6">
					{#if showColorRow}
						<div>
							<p class="mb-3 text-sm font-medium text-zinc-900">{t('detail_prop_color')}</p>
							<div class="flex flex-wrap gap-2.5">
								{#each matrixColorOptions as opt}
									{#if opt.image}
										<button
											type="button"
											onclick={() => page.selectMatrixColor(opt.value)}
											title={opt.value}
											class="size-12 cursor-pointer overflow-hidden rounded-xl border-2 transition sm:size-14"
											style="
												border-color: {effectivePropColor === opt.value ? '#2d2d2a' : 'transparent'};
												box-shadow: {effectivePropColor === opt.value ? '0 1px 4px rgba(0,0,0,0.12)' : 'none'};
											"
										>
											<img src={opt.image} alt={opt.value} class="size-full object-cover pointer-events-none" />
										</button>
									{:else}
										<button
											type="button"
											onclick={() => page.selectMatrixColor(opt.value)}
											class="rounded-xl border px-3.5 py-2 text-sm font-medium transition"
											style="
												border-color: {effectivePropColor === opt.value ? '#2d2d2a' : 'rgba(45, 45, 42, 0.1)'};
												background-color: {effectivePropColor === opt.value ? '#2d2d2a' : 'transparent'};
												color: {effectivePropColor === opt.value ? '#ffffff' : '#1a1a17'};
											"
										>
											{opt.value}
										</button>
									{/if}
								{/each}
							</div>
						</div>
					{/if}

					{#if showSizeRow}
						<div>
							<p class="mb-3 text-sm font-medium text-zinc-900">{t('detail_prop_size')}</p>
							<div class="flex flex-wrap gap-2.5">
								{#each matrixSizeOptions as sz}
									{@const avail = availableSizesForColor.has(sz)}
									{@const selected = effectivePropSize === sz}
									<button
										type="button"
										onclick={() => page.selectMatrixSize(sz)}
										disabled={!avail}
										class="min-w-[3rem] rounded-xl border px-3.5 py-2 text-sm font-medium transition"
										style="
											border-color: {selected ? '#2d2d2a' : avail ? 'rgba(45, 45, 42, 0.1)' : 'rgba(45, 45, 42, 0.05)'};
											background-color: {selected ? '#2d2d2a' : 'transparent'};
											color: {selected ? '#ffffff' : avail ? '#1a1a17' : '#c0c0bb'};
											cursor: {avail ? 'pointer' : 'not-allowed'};
											text-decoration: {avail ? 'none' : 'line-through'};
										"
									>
										{sz}
									</button>
								{/each}
							</div>
						</div>
					{/if}

					{#if currentSku}
						<div class="rounded-xl px-5 py-3.5 text-sm" style="background-color: #f7f6f3;">
							<span class="text-zinc-500">{t('detail_selected_option')}</span>
							<span class="ml-1.5 font-medium text-zinc-900">
								{currentSku.skuName}
							</span>
							<span class="ml-3 font-semibold tabular-nums text-zinc-900">
								{page.fmt(currentSku.price)}
							</span>
						</div>
					{/if}
				</div>
			{/if}

			<!-- sku_properties 없음: 전체 SKU 행 목록 -->
			{#if hasSkuList}
				<div class="rounded-3xl bg-white/60 backdrop-blur-sm p-6 space-y-5 border border-zinc-200/60">
					<p class="text-sm font-medium text-zinc-900">
						{t('detail_sku_list_heading', { count: item.skus.length })}
					</p>
					<div class="space-y-2">
						{#each item.skus as sku (sku.skuId)}
							<button
								type="button"
								onclick={() => page.selectSku(sku.skuId)}
								class="flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition sm:gap-4 sm:px-4"
								style="
									border-color: {page.ui.selectedSkuId === sku.skuId ? '#2d2d2a' : 'rgba(45, 45, 42, 0.1)'};
									background-color: {page.ui.selectedSkuId === sku.skuId ? '#fafaf9' : 'transparent'};
								"
							>
								{#if sku.image}
									<img
										src={sku.image}
										alt=""
										class="size-12 shrink-0 rounded-lg object-cover sm:size-14"
									/>
								{:else}
									<div
										class="size-12 shrink-0 rounded-lg sm:size-14"
										style="background-color: #f7f6f3;"
									></div>
								{/if}
								<div class="min-w-0 flex-1">
									<p class="text-sm font-medium leading-snug text-zinc-900">
										{sku.skuName}
									</p>
									<p class="mt-0.5 text-xs tabular-nums sm:text-sm text-zinc-500">
										{page.fmt(sku.price)}
									</p>
								</div>
							</button>
						{/each}
					</div>

					{#if currentSku}
						<div class="rounded-xl px-5 py-3.5 text-sm" style="background-color: #f7f6f3;">
							<span class="text-zinc-500">{t('detail_selected_option')}</span>
							<span class="ml-1.5 font-medium text-zinc-900">
								{currentSku.skuName}
							</span>
							<span class="ml-3 font-semibold tabular-nums text-zinc-900">
								{page.fmt(currentSku.price)}
							</span>
						</div>
					{/if}
				</div>
			{/if}

			<!-- Price history -->
			<div class="rounded-3xl bg-white/60 backdrop-blur-sm p-6 border border-zinc-200/60">
				<h2 class="mb-5 text-base font-semibold text-zinc-900">{t('detail_price_history')}</h2>

				<PriceChart data={item.priceHistory} />

				<div class="mt-6">
					<p class="mb-3 text-xs font-medium" style="color: #9b9b95;">{t('detail_recent_changes')}</p>
					{#each item.priceHistory.slice(0, 10) as entry, i}
						<div
							class="flex items-center justify-between py-2.5"
							style="{i < 9 ? 'border-bottom: 1px solid rgba(45, 45, 42, 0.05);' : ''}"
						>
							<span class="text-sm text-zinc-500">{entry.date}</span>
							<div class="flex items-center gap-4">
								<span class="text-sm font-medium tabular-nums text-zinc-900">{page.fmt(entry.price)}</span>
								{#if entry.change < 0}
									<span class="w-20 text-right text-xs font-medium tabular-nums text-emerald-600">
										▼ {page.fmt(Math.abs(entry.change))}
									</span>
								{:else if entry.change > 0}
									<span class="w-20 text-right text-xs font-medium tabular-nums text-rose-600">
										▲ {page.fmt(entry.change)}
									</span>
								{:else}
									<span class="w-20 text-right text-xs" style="color: #9b9b95;">—</span>
								{/if}
							</div>
						</div>
					{/each}
				</div>
			</div>

			{#if item.trackedItemId}
				<div class="flex justify-center pt-2">
					<button
						type="button"
						onclick={page.handleDelete}
						disabled={page.ui.deleting}
						class="inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition hover:bg-[#fee8e8] disabled:opacity-40 text-rose-600"
					>
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="size-4" aria-hidden="true">
							<path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
						</svg>
						{page.ui.deleting ? t('detail_deleting') : t('detail_delete_track_footer')}
					</button>
				</div>
			{/if}

		</div>
	</div>
{/if}
