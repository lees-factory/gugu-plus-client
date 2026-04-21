<script lang="ts">
	import { resolve } from '$app/paths';
	import ConfirmDialog from '$lib/components/ConfirmDialog.svelte';
	import PriceChart from '$lib/components/PriceChart.svelte';
	import { t } from '$lib/i18n/t';
	import type { PageProps } from './$types';
	import { createItemDetailPage } from './item-detail-page.svelte';

	const { data }: PageProps = $props();

	const page = createItemDetailPage(() => data.trackedItem);

	const item = $derived(page.item);
</script>

{#if data.error}
	<div class="flex flex-col items-center justify-center gap-4 p-12 text-center">
		<p class="text-sm text-rose-600">{data.error}</p>
		<a
			href={resolve('/items')}
			class="text-sm font-medium text-zinc-900 underline underline-offset-2"
		>
			{t('back_to_dashboard')}
		</a>
	</div>
{:else if !item}
	<div class="flex flex-col items-center justify-center gap-4 p-12 text-center">
		<p class="text-sm text-zinc-500">{t('not_found')}</p>
		<a
			href={resolve('/items')}
			class="text-sm font-medium text-zinc-900 underline underline-offset-2"
		>
			{t('back_to_dashboard')}
		</a>
	</div>
{:else}
	<div class="space-y-6 p-5 sm:p-6 lg:p-8">
		<!-- ad:top -->

		<div class="space-y-8">
			<!-- Page header -->
			<div class="max-w-2xl">
				<div
					class="mb-3 inline-flex items-center gap-2 rounded-full border border-zinc-200/50 bg-zinc-100/80 px-3 py-1.5"
				>
					<a
						href={resolve('/items')}
						class="inline-flex items-center gap-1 text-xs font-medium text-zinc-500 transition hover:text-zinc-900"
					>
						<svg
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							class="size-3"
							aria-hidden="true"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
							/>
						</svg>
						{t('detail_back_dashboard')}
					</a>
				</div>
				<h1 class="line-clamp-4 text-2xl font-semibold tracking-tight text-zinc-900 md:text-3xl">
					{item.title}
				</h1>
			</div>
			<!-- Image + Price grid -->
			<div class="grid grid-cols-1 gap-0 md:grid-cols-2 md:gap-8">
				<!-- Image -->
				<div
					class="relative flex items-center justify-center overflow-hidden rounded-t-3xl border border-zinc-200/60 md:rounded-3xl"
					style="min-height: 280px;"
				>
					{#if !page.ui.imgError && page.displayImage}
						<!-- Blurred background fill -->
						<img
							src={page.displayImage}
							alt=""
							aria-hidden="true"
							class="absolute inset-0 size-full scale-110 object-cover opacity-70 blur-xl"
						/>
						<div class="absolute inset-0 bg-white/30"></div>
						<!-- Main image -->
						<img
							src={page.displayImage}
							alt={item.title}
							class="relative z-10 m-4 max-h-72 rounded-2xl object-cover sm:m-6 sm:max-h-96"
							onerror={page.onImageError}
						/>
					{:else}
						<div
							class="flex h-48 w-full items-center justify-center rounded-xl sm:h-64"
							style="background-color: #f7f6f3;"
						>
							<svg
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="1.5"
								class="size-12"
								style="color: #6b6b65; opacity: 0.3;"
								aria-hidden="true"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
								/>
							</svg>
						</div>
					{/if}
				</div>

				<!-- Price + CTA -->
				<div
					class="flex flex-col rounded-b-3xl border border-t-0 border-zinc-200/60 bg-white p-8 md:rounded-3xl md:border-t"
				>
					<p class="mb-3 text-xs font-semibold tracking-wider text-zinc-400 uppercase">
						{t('detail_current_price')}
					</p>
					<p class="text-4xl font-semibold tracking-tight text-zinc-900 tabular-nums sm:text-5xl">
						{page.fmt(page.displayPrice)}
					</p>
					{#if page.originalPrice && page.originalPrice > page.displayPrice}
						<div class="mt-2 flex items-center gap-2.5">
							<p class="text-sm text-zinc-400 tabular-nums line-through">
								{page.fmt(page.originalPrice)}
							</p>
							{#if page.discountPct}
								<span class="rounded-lg bg-rose-50 px-2 py-0.5 text-xs font-semibold text-rose-600">
									-{page.discountPct}%
								</span>
							{/if}
						</div>
					{/if}

					<!-- Price alert CTA -->
					<div class="mt-6">
						{#if page.alertEnabled}
							<button
								type="button"
								aria-pressed="true"
								aria-label={t('detail_alert_title')}
								disabled={page.ui.alertLoading}
								onclick={page.toggleAlert}
								class="flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border px-5 py-3.5 text-sm font-semibold disabled:opacity-60"
								style="background-color: #e8f5f1; border-color: #5aad9c; color: #2f7566;"
							>
								<svg
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2.25"
									class="size-4"
									aria-hidden="true"
								>
									<path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
								</svg>
								{t('detail_alert_currently_on')}
							</button>
						{:else}
							<button
								type="button"
								aria-pressed="false"
								aria-label={t('detail_alert_title')}
								disabled={page.ui.alertLoading}
								onclick={page.toggleAlert}
								class="flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-sm font-semibold text-white disabled:opacity-60"
								style="background-color: #2d2d2a;"
							>
								<svg
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="1.75"
									class="size-4"
									aria-hidden="true"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
									/>
								</svg>
								{t('detail_alert_turn_on')}
							</button>
						{/if}
						<p class="mt-2 text-center text-xs text-zinc-500">{t('detail_alert_desc')}</p>
					</div>

					<!-- CTAs -->
					<div class="mt-auto flex flex-col gap-2.5 pt-6">
						<a
							href={item.url}
							target="_blank"
							rel="external noopener noreferrer"
							class="flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:opacity-90"
							style="background-color: #2d2d2a;"
						>
							{t('detail_view_on_site', { site: item.site })}
							<svg
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								class="size-4"
								aria-hidden="true"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
								/>
							</svg>
						</a>
						<button
							type="button"
							onclick={page.handleDelete}
							disabled={page.ui.deleting || !item.trackedItemId}
							class="flex w-full items-center justify-center gap-2 rounded-2xl border px-5 py-3 text-sm font-medium transition-all duration-200 hover:bg-rose-50 hover:text-rose-600 disabled:opacity-40"
							style="border-color: rgba(45, 45, 42, 0.1); color: #6b6b65;"
						>
							<svg
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="1.5"
								class="size-4"
								aria-hidden="true"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
								/>
							</svg>
							{page.ui.deleting ? t('detail_deleting') : t('detail_delete_track_footer')}
						</button>
					</div>
				</div>
			</div>

			<!-- Price Insight -->
			{#if page.priceInsight}
				{@const insight = page.priceInsight}
				{@const levelColor =
					insight.level === 'good' ? '#5aad9c' : insight.level === 'normal' ? '#d4a017' : '#d4183d'}
				{@const levelBg =
					insight.level === 'good'
						? 'rgba(90, 173, 156, 0.08)'
						: insight.level === 'normal'
							? 'rgba(212, 160, 23, 0.08)'
							: 'rgba(212, 24, 61, 0.08)'}
				{@const levelTitle =
					insight.level === 'good'
						? t('insight_good_title')
						: insight.level === 'normal'
							? t('insight_normal_title')
							: t('insight_high_title')}
				<div class="rounded-3xl border border-zinc-200/60 bg-white p-6">
					<!-- Header: signal dot + title + description -->
					<div class="flex items-start gap-3.5">
						<div
							class="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl"
							style="background-color: {levelBg};"
						>
							<span class="block size-3 rounded-full" style="background-color: {levelColor};"
							></span>
						</div>
						<div class="min-w-0 flex-1">
							<p class="text-sm font-semibold" style="color: {levelColor};">
								{levelTitle}
							</p>
							<p class="mt-0.5 text-sm text-zinc-600">
								{#if insight.allSame}
									{t('insight_no_change')}
								{:else if insight.vsAvg < 0}
									{t('insight_vs_avg_lower', { pct: Math.abs(insight.vsAvg) })}
								{:else if insight.vsAvg > 0}
									{t('insight_vs_avg_higher', { pct: insight.vsAvg })}
								{:else}
									{t('insight_vs_avg_same')}
								{/if}
							</p>
						</div>
					</div>

					<!-- Progress bar: min ~ current ~ max -->
					{#if !insight.allSame}
						<div class="mt-5">
							<div class="mb-2 flex items-center justify-between">
								<span class="text-xs text-zinc-400">{t('insight_range_label')}</span>
							</div>

							<!-- Bar -->
							<div
								class="relative h-2 w-full overflow-hidden rounded-full"
								style="background-color: #f0f0ee;"
							>
								<!-- Filled region from 0 to percentile -->
								<div
									class="absolute inset-y-0 left-0 rounded-full transition-all duration-500"
									style="width: {insight.percentile}%; background-color: {levelColor}; opacity: 0.25;"
								></div>
								<!-- Current position indicator -->
								<div
									class="absolute top-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white transition-all duration-500"
									style="left: {insight.percentile}%; background-color: {levelColor}; box-shadow: 0 1px 4px rgba(0,0,0,0.15);"
								></div>
							</div>

							<!-- Min / Max labels -->
							<div class="mt-2 flex items-center justify-between">
								<span class="text-xs text-zinc-400 tabular-nums">{page.fmt(insight.minPrice)}</span>
								<span class="text-xs font-medium text-zinc-600 tabular-nums"
									>{page.fmt(insight.avgPrice)}</span
								>
								<span class="text-xs text-zinc-400 tabular-nums">{page.fmt(insight.maxPrice)}</span>
							</div>
						</div>
					{/if}
				</div>
			{/if}

			<!-- sku_properties: 색상 / 크기 매트릭스 -->
			{#if page.showMatrixPanel}
				<div class="space-y-6 rounded-3xl border border-zinc-200/60 bg-white p-6">
					{#if page.showColorRow}
						<div>
							<p class="mb-3 text-sm font-medium text-zinc-900">
								{page.groupByImage ? t('detail_prop_design') : t('detail_prop_color')}
							</p>
							<div class="flex flex-wrap gap-2.5">
								{#each page.matrixColorOptions as opt (opt.value)}
									{#if opt.image}
										<button
											type="button"
											onclick={() => page.selectMatrixColor(opt.value)}
											title={opt.value}
											class="size-12 cursor-pointer overflow-hidden rounded-xl border-2 transition sm:size-14"
											style="
												border-color: {page.effectivePropColor === opt.value ? '#2d2d2a' : 'transparent'};
												box-shadow: {page.effectivePropColor === opt.value ? '0 1px 4px rgba(0,0,0,0.12)' : 'none'};
											"
										>
											<img
												src={opt.image}
												alt={opt.value}
												class="pointer-events-none size-full object-cover"
											/>
										</button>
									{:else}
										<button
											type="button"
											onclick={() => page.selectMatrixColor(opt.value)}
											class="rounded-xl border px-3.5 py-2 text-sm font-medium transition"
											style="
												border-color: {page.effectivePropColor === opt.value ? '#2d2d2a' : 'rgba(45, 45, 42, 0.1)'};
												background-color: {page.effectivePropColor === opt.value ? '#2d2d2a' : 'transparent'};
												color: {page.effectivePropColor === opt.value ? '#ffffff' : '#1a1a17'};
											"
										>
											{opt.value}
										</button>
									{/if}
								{/each}
							</div>
						</div>
					{/if}

					{#if page.showSizeRow}
						<div>
							<p class="mb-3 text-sm font-medium text-zinc-900">{t('detail_prop_size')}</p>
							<div class="flex flex-wrap gap-2.5">
								{#each page.matrixSizeOptions as sz (sz)}
									{@const avail = page.availableSizesForColor.has(sz)}
									{@const selected = page.effectivePropSize === sz}
									<button
										type="button"
										onclick={() => page.selectMatrixSize(sz)}
										disabled={!avail}
										class="min-w-12 rounded-xl border px-3.5 py-2 text-sm font-medium transition"
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

					{#if page.currentSku}
						<div class="rounded-xl px-5 py-3.5 text-sm" style="background-color: #f7f6f3;">
							<span class="text-zinc-500">{t('detail_selected_option')}</span>
							<span class="ml-1.5 font-medium text-zinc-900">
								{page.currentSku.skuName}
							</span>
							<span class="ml-3 font-semibold text-zinc-900 tabular-nums">
								{page.fmt(page.currentSku.price)}
							</span>
						</div>
					{/if}
				</div>
			{/if}

			<!-- sku_properties 없음: 전체 SKU 행 목록 -->
			{#if page.hasSkuList}
				<div class="space-y-5 rounded-3xl border border-zinc-200/60 bg-white p-6">
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
									<p class="text-sm leading-snug font-medium text-zinc-900">
										{sku.skuName}
									</p>
									<p class="mt-0.5 text-xs text-zinc-500 tabular-nums sm:text-sm">
										{page.fmt(sku.price)}
									</p>
								</div>
							</button>
						{/each}
					</div>

					{#if page.currentSku}
						<div class="rounded-xl px-5 py-3.5 text-sm" style="background-color: #f7f6f3;">
							<span class="text-zinc-500">{t('detail_selected_option')}</span>
							<span class="ml-1.5 font-medium text-zinc-900">
								{page.currentSku.skuName}
							</span>
							<span class="ml-3 font-semibold text-zinc-900 tabular-nums">
								{page.fmt(page.currentSku.price)}
							</span>
						</div>
					{/if}
				</div>
			{/if}

			<!-- Price history -->
			<div class="rounded-3xl border border-zinc-200/60 bg-white p-6">
				<h2 class="mb-5 text-base font-semibold text-zinc-900">{t('detail_price_history')}</h2>

				<div class="relative">
					<div class="transition-opacity duration-200" class:opacity-40={page.historyLoading}>
						<PriceChart data={page.skuPriceHistory} currency={item?.currency} />
					</div>
					{#if page.historyLoading}
						<div class="absolute inset-0 flex items-center justify-center">
							<div
								class="h-6 w-6 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-600"
							></div>
						</div>
					{/if}
				</div>

				{#if !page.historyLoading && page.skuPriceHistory.length > 1}
					<div class="mt-6">
						<div class="flex items-center justify-between py-2 text-xs text-zinc-400">
							<span>{t('detail_history_col_date')}</span>
							<div class="flex items-center gap-4">
								<span>{t('detail_history_col_price')}</span>
								<span class="w-20 text-right">{t('detail_history_col_change')}</span>
							</div>
						</div>
						{#each page.skuPriceHistory.slice(0, 10) as entry, i (i)}
							<div
								class="flex items-center justify-between py-2.5"
								style={i < 9 ? 'border-bottom: 1px solid rgba(45, 45, 42, 0.05);' : ''}
							>
								<span class="flex items-center gap-1.5 text-sm text-zinc-500">
									{#if i === 0}
										<span class="inline-block size-1.5 rounded-full bg-blue-500"></span>
									{/if}
									{entry.date}
								</span>
								<div class="flex items-center gap-4">
									<span
										class="text-sm tabular-nums {i === 0
											? 'font-semibold text-zinc-900'
											: 'font-medium text-zinc-900'}">{page.fmt(entry.price)}</span
									>
									{#if entry.change < 0}
										<span class="w-20 text-right text-xs font-medium text-blue-500 tabular-nums">
											{page.fmt(Math.abs(entry.change))}
										</span>
									{:else if entry.change > 0}
										<span class="w-20 text-right text-xs font-medium text-red-500 tabular-nums">
											{page.fmt(entry.change)}
										</span>
									{:else}
										<span class="w-20 text-right text-xs" style="color: #9b9b95;">--</span>
									{/if}
								</div>
							</div>
						{/each}
					</div>
				{/if}
			</div>
		</div>

		<!-- ad:bottom -->
	</div>

	<ConfirmDialog
		open={page.confirmDeleteOpen}
		message={t('confirm_delete_track')}
		onConfirm={page.confirmDelete}
		onCancel={page.cancelDelete}
	/>
{/if}
