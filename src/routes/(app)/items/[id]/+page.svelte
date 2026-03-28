<script lang="ts">
	import type { PageProps } from './$types';
	import { resolve } from '$app/paths';
	import { t } from '$lib/i18n/t';
	import { createItemDetailPage } from './item-detail-page.svelte';
	import PriceChart from '$lib/components/PriceChart.svelte';

	const { data }: PageProps = $props();
	console.log('🚀 ~ data:', data.skus);

	const page = createItemDetailPage(
		() => data.trackedItem,
		() => data.skus
	);

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
	<div class="space-y-10 p-8 sm:p-10 lg:p-14">
		<!-- Page hero -->
		<div>
			<a
				href={resolve('/items')}
				class="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 transition-all duration-200 hover:text-zinc-900"
			>
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
						d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
					/>
				</svg>
				<span>{t('detail_back_dashboard')}</span>
			</a>

			<div class="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
				<div class="max-w-2xl">
					<div
						class="mb-6 inline-flex items-center gap-2 rounded-full border border-zinc-200/50 bg-zinc-100/80 px-3 py-1.5"
					>
						<span
							class="rounded-md border border-zinc-200/60 bg-zinc-50/80 px-2 py-0.5 text-[10px] font-semibold tracking-wider text-zinc-600 uppercase"
						>
							{item.site}
						</span>
					</div>
					<h1 class="line-clamp-2 text-4xl font-semibold tracking-tight text-zinc-900 md:text-5xl">
						{item.title}
					</h1>
					<a
						href={item.url}
						target="_blank"
						rel="external noopener noreferrer"
						class="mt-4 inline-flex items-center gap-1.5 text-sm text-zinc-500 transition-all duration-200 hover:text-zinc-900"
					>
						{t('detail_view_on_site', { site: item.site })}
						<svg
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							class="size-3.5"
							aria-hidden="true"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
							/>
						</svg>
					</a>
				</div>

				<button
					type="button"
					onclick={page.handleDelete}
					disabled={page.ui.deleting || !item.trackedItemId}
					class="inline-flex shrink-0 items-center gap-2 rounded-2xl border border-zinc-200/60 bg-white/60 px-5 py-3 text-sm font-medium text-zinc-500 transition-all duration-200 hover:bg-rose-50 hover:text-rose-700 disabled:opacity-40"
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
					{page.ui.deleting ? t('detail_deleting') : t('detail_delete')}
				</button>
			</div>
		</div>

		<div class="mx-auto max-w-5xl space-y-8">
			<!-- Image + Price grid -->
			<div class="grid grid-cols-1 gap-8 md:grid-cols-2">
				<!-- Image -->
				<div
					class="flex items-center justify-center overflow-hidden rounded-3xl border border-zinc-200/60 bg-white/60 p-6 backdrop-blur-sm"
				>
					{#if !page.ui.imgError && page.displayImage}
						{#key `${page.currentSku?.skuId ?? ''}|${page.displayImage}`}
							<img
								src={page.displayImage}
								alt={item.title}
								class="max-h-72 w-full rounded-xl object-contain sm:max-h-96"
								onerror={page.onImageError}
							/>
						{/key}
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

				<!-- Price + Tracking -->
				<div class="flex flex-col gap-5">
					<!-- Price card -->
					<div class="rounded-3xl border border-zinc-200/60 bg-white/60 p-6 backdrop-blur-sm">
						<p class="mb-1.5 text-xs font-semibold tracking-wider text-zinc-400 uppercase">
							{t('detail_current_price')}
						</p>
						<div class="flex items-end gap-2.5">
							<p
								class="text-3xl font-semibold tracking-tight text-zinc-900 tabular-nums sm:text-4xl"
							>
								{page.fmt(page.displayPrice)}
							</p>
							{#if page.discountPct}
								<span
									class="mb-1 rounded-xl border border-rose-100/50 bg-rose-50 px-2.5 py-0.5 text-sm font-semibold text-rose-600"
								>
									-{page.discountPct}%
								</span>
							{/if}
						</div>
						{#if page.originalPrice && page.originalPrice > page.displayPrice}
							<p class="mt-1 text-sm text-zinc-400 tabular-nums line-through">
								{page.fmt(page.originalPrice)}
							</p>
						{/if}
						{#if page.originalPrice && page.originalPrice > page.displayPrice}
							<div
								class="mt-4 inline-flex items-center gap-1.5 rounded-2xl border border-emerald-100/50 bg-linear-to-r from-emerald-50 to-teal-50 px-3.5 py-2 text-sm font-semibold text-emerald-700"
							>
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
										d="M2.25 18 9 11.25l4.286-4.286a11.948 11.948 0 0 1 4.306 6.43l.776 2.898m0 0 3.182-5.511m-3.182 5.51-5.511-3.181"
									/>
								</svg>
								{t('detail_savings', { amount: page.fmt(page.originalPrice - page.displayPrice) })}
							</div>
						{/if}
					</div>

					<!-- Tracking settings -->
					<div class="rounded-3xl border border-zinc-200/60 bg-white/60 p-5 backdrop-blur-sm">
						<div>
							<div class="flex items-center justify-between border-b border-zinc-100 py-3">
								<div class="flex items-center gap-2 text-sm text-zinc-500">
									<svg
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="1.5"
										class="size-4 shrink-0"
										aria-hidden="true"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
										/>
									</svg>
									{t('detail_last_checked')}
								</div>
								<span class="text-sm font-medium text-zinc-900">{item.lastChecked}</span>
							</div>
							<div class="flex items-center justify-between border-b border-zinc-100 py-3">
								<div class="flex items-center gap-2 text-sm text-zinc-500">
									<svg
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="1.5"
										class="size-4 shrink-0"
										aria-hidden="true"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
										/>
									</svg>
									{t('detail_check_interval')}
								</div>
								<span class="text-sm font-medium text-zinc-900"
									>{t('detail_every_frequency', { frequency: item.trackingFrequency })}</span
								>
							</div>
							<div class="flex items-center justify-between py-3">
								<div class="flex items-center gap-2 text-sm text-zinc-500">
									<svg
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="1.5"
										class="size-4 shrink-0"
										aria-hidden="true"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
										/>
									</svg>
									{t('detail_price_alert')}
								</div>
								<button
									type="button"
									onclick={page.toggleAlert}
									class="flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-sm font-medium transition-all duration-200 {page
										.ui.alertEnabled
										? 'border border-emerald-100/50 bg-emerald-50 text-emerald-700'
										: 'text-zinc-500 hover:text-zinc-900'}"
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
			{#if page.showMatrixPanel}
				<div
					class="space-y-6 rounded-3xl border border-zinc-200/60 bg-white/60 p-6 backdrop-blur-sm"
				>
					{#if page.showColorRow}
						<div>
							<p class="mb-3 text-sm font-medium text-zinc-900">{t('detail_prop_color')}</p>
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
				<div
					class="space-y-5 rounded-3xl border border-zinc-200/60 bg-white/60 p-6 backdrop-blur-sm"
				>
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
			<div class="rounded-3xl border border-zinc-200/60 bg-white/60 p-6 backdrop-blur-sm">
				<h2 class="mb-5 text-base font-semibold text-zinc-900">{t('detail_price_history')}</h2>

				<PriceChart data={item.priceHistory} />

				<div class="mt-6">
					<p class="mb-3 text-xs font-medium" style="color: #9b9b95;">
						{t('detail_recent_changes')}
					</p>
					{#each item.priceHistory.slice(0, 10) as entry, i (i)}
						<div
							class="flex items-center justify-between py-2.5"
							style={i < 9 ? 'border-bottom: 1px solid rgba(45, 45, 42, 0.05);' : ''}
						>
							<span class="text-sm text-zinc-500">{entry.date}</span>
							<div class="flex items-center gap-4">
								<span class="text-sm font-medium text-zinc-900 tabular-nums"
									>{page.fmt(entry.price)}</span
								>
								{#if entry.change < 0}
									<span class="w-20 text-right text-xs font-medium text-emerald-600 tabular-nums">
										▼ {page.fmt(Math.abs(entry.change))}
									</span>
								{:else if entry.change > 0}
									<span class="w-20 text-right text-xs font-medium text-rose-600 tabular-nums">
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
		</div>
	</div>
{/if}
