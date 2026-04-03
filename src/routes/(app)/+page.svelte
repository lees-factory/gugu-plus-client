<script lang="ts">
	import type { PageProps } from './$types';
	import { resolve } from '$app/paths';
	import { t } from '$lib/i18n/t';
	import { createDiscoverPage, siteLabels } from './discover-page.svelte';

	const { data }: PageProps = $props();
	const page = createDiscoverPage(() => data);
</script>

<div class="space-y-10 p-8 sm:p-10 lg:p-14">
	<!-- ── Hero ─────────────────────────────────────────────────── -->
	<div class="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
		<div class="max-w-2xl">
			<div
				class="mb-6 inline-flex items-center gap-2 rounded-full border border-zinc-200/50 bg-zinc-100/80 px-3 py-1.5"
			>
				<svg
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2.5"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="size-3.5 text-stone-600"
					aria-hidden="true"
				>
					<polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
					<polyline points="16 7 22 7 22 13" />
				</svg>
				<span class="text-xs font-semibold text-stone-800">Live Price Tracking</span>
			</div>
			<h1
				class="text-4xl leading-tight font-semibold tracking-tight text-zinc-900 md:text-5xl lg:text-6xl"
			>
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
				href={resolve('/items')}
				class="inline-flex items-center gap-2 rounded-2xl px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-zinc-900/10 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-zinc-900/15"
				style="background: linear-gradient(to right, #292524, #3f3f46);"
			>
				<svg
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2.5"
					class="size-4"
					aria-hidden="true"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
				</svg>
				{t('home_add_item')}
			</a>
		</div>
	</div>

	<!-- ── Main: two columns (flex + items-start — grid stretch로 인한 열 높이 동기화 방지) -->
	<div class="flex flex-col gap-8 xl:flex-row xl:items-start xl:gap-10">
		<div class="min-w-0 flex-1 space-y-8">
			<!-- Section header -->
			<div class="flex items-center justify-between">
				<div class="flex items-center gap-4">
					<div
						class="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-100 to-amber-100 text-orange-600 shadow-sm"
					>
						<svg
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="size-5"
							aria-hidden="true"
						>
							<polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
						</svg>
					</div>
					<div>
						<h2 class="text-2xl font-semibold tracking-tight text-zinc-900">
							{t('discover_trending_title')}
						</h2>
						<p class="mt-1 text-sm text-zinc-500">{t('discover_trending_subtitle')}</p>
					</div>
				</div>
			</div>

			{#if page.loadError}
				<div class="flex items-center justify-center py-20 text-sm text-red-400">
					{t('discover_load_fail')}
				</div>
			{:else if page.displayed.length === 0}
				<div class="flex items-center justify-center py-20 text-sm text-zinc-400">
					{t('discover_no_more')}
				</div>
			{:else}
				<div class="flex flex-col gap-3">
					{#each page.displayed as product (product.id)}
						{@const isAdded = page.addedIds.includes(product.id)}
						{@const isAdding = page.addingId === product.id}
						<div
							class="group relative flex flex-col gap-3 rounded-3xl border border-zinc-200/60 bg-white p-4 transition-all duration-300 hover:border-stone-300/60 hover:shadow-lg hover:shadow-stone-500/5 sm:gap-4 sm:p-5 md:flex-row md:items-center md:gap-5 md:rounded-2xl md:p-4"
						>
							<!-- Stretched link covering entire row -->
							<a
								href={product.url}
								target="_blank"
								rel="external noopener noreferrer"
								class="absolute inset-0 z-0 rounded-[inherit]"
								aria-label={product.title}
							></a>

							<!-- Image -->
							<div class="flex items-start justify-between md:block">
								<div
									class="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-zinc-200/60 bg-zinc-100 shadow-sm sm:h-24 sm:w-24 sm:rounded-2xl md:h-16 md:w-16 md:rounded-xl"
								>
									<img
										src={product.imageUrl}
										alt={product.title}
										class="size-full object-cover transition-transform duration-500 group-hover:scale-105"
										loading="lazy"
									/>
								</div>
							</div>

							<!-- Title + badge -->
							<div class="flex min-w-0 flex-1 flex-col justify-center">
								<span
									class="line-clamp-2 text-sm font-semibold text-zinc-900 transition-colors group-hover:text-stone-600 md:line-clamp-1"
								>
									{product.title}
								</span>
								<div class="mt-2 flex items-center gap-2 md:mt-1.5">
									<span
										class="rounded-lg border border-zinc-200/60 bg-zinc-50/80 px-2 py-0.5 text-[10px] font-semibold tracking-wider text-zinc-600 uppercase"
									>
										{siteLabels[product.site]}
									</span>
								</div>
							</div>

							<!-- Price -->
							<div
								class="flex items-center justify-between border-t border-zinc-100 pt-3 md:contents md:border-0 md:pt-0"
							>
								<div class="flex flex-col md:w-28 md:items-end">
									{#if product.originalPrice > 0 && product.originalPrice > product.currentPrice}
										<span class="text-xs font-medium text-zinc-400 line-through">
											{page.fmt(product.originalPrice, product.currency)}
										</span>
									{/if}
									<span
										class="text-lg font-semibold tracking-tight text-zinc-900 sm:text-xl md:text-base"
									>
										{page.fmt(product.currentPrice, product.currency)}
									</span>
								</div>
								{#if product.discountPct > 0}
									<div class="shrink-0 md:flex md:w-20 md:justify-end">
										<span
											class="inline-flex items-center gap-1 rounded-full border border-emerald-100/50 bg-gradient-to-r from-emerald-50 to-teal-50 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-emerald-700 shadow-sm"
										>
											-{product.discountPct}%
										</span>
									</div>
								{/if}
							</div>

							<!-- Add button -->
							<div class="relative z-10 shrink-0 border-t border-zinc-100 pt-3 md:border-0 md:pt-0">
								{#if isAdded}
									<span class="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200/60 bg-emerald-50/80 px-4 py-2 text-xs font-semibold text-emerald-700">
										<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="size-3.5" aria-hidden="true">
											<path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
										</svg>
										{t('discover_added')}
									</span>
								{:else}
									<button
										type="button"
										onclick={() => page.addItem(product)}
										disabled={!!page.addingId}
										class="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200/60 bg-white px-4 py-2 text-xs font-semibold text-zinc-700 transition-all duration-200 hover:bg-zinc-50 hover:shadow-sm disabled:opacity-50"
									>
										{#if isAdding}
											<svg class="size-3.5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
												<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
												<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
											</svg>
										{:else}
											<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="size-3.5" aria-hidden="true">
												<path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
											</svg>
										{/if}
										{t('discover_add_track')}
									</button>
								{/if}
							</div>
						</div>
					{/each}
				</div>

				<div
					bind:this={page.model.sentinel}
					class="flex min-h-[52px] items-center justify-center py-4 [overflow-anchor:none]"
					aria-busy={page.model.isLoadingMore}
				>
					<div class="flex min-h-6 items-center justify-center text-sm text-zinc-400">
						{#if page.model.isLoadingMore}
							<span class="inline-flex items-center gap-2">
								<svg
									class="size-4 shrink-0 animate-spin"
									viewBox="0 0 24 24"
									fill="none"
									aria-hidden="true"
								>
									<circle
										class="opacity-25"
										cx="12"
										cy="12"
										r="10"
										stroke="currentColor"
										stroke-width="4"
									></circle>
									<path
										class="opacity-75"
										fill="currentColor"
										d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
									></path>
								</svg>
								{t('discover_loading')}
							</span>
						{:else if !page.model.hasMore && page.displayed.length > 0}
							<span>{t('discover_no_more')}</span>
						{/if}
					</div>
				</div>
			{/if}
		</div>

		<aside
			class="w-full shrink-0 [contain:layout] xl:sticky xl:top-[80px] xl:w-[340px] xl:self-start"
		>
			<div class="rounded-3xl border border-zinc-200/60 bg-white p-7 shadow-sm">
				<div class="mb-7 flex items-center justify-between">
					<h3 class="text-lg font-semibold tracking-tight text-zinc-900">
						{t('nav_tracked_items')}
					</h3>
					<span
						class="rounded-full border border-zinc-200/60 bg-gradient-to-r from-zinc-100 to-zinc-50 px-3 py-1.5 text-[9px] font-semibold tracking-wider text-zinc-600 uppercase"
					>
						{page.trackedItems.length}
					</span>
				</div>

				{#if page.trackedItems.length === 0}
					<p class="py-6 text-center text-sm text-zinc-400">{t('items_empty')}</p>
				{:else}
					<div class="flex flex-col gap-4">
						{#each page.trackedItems as item (item.id)}
							<a
								href={resolve(`/items/${item.id}`)}
								class="group -mx-3 flex items-center gap-4 rounded-2xl p-3 transition-all duration-200 hover:bg-zinc-50/80"
							>
								<div
									class="size-12 shrink-0 overflow-hidden rounded-xl border border-zinc-200/60 bg-zinc-100 shadow-sm"
								>
									<img
										src={item.imageUrl}
										alt={item.title}
										class="size-full object-cover transition-transform duration-500 group-hover:scale-105"
										loading="lazy"
									/>
								</div>
								<div class="min-w-0 flex-1">
									<h4
										class="truncate text-sm font-semibold text-zinc-900 transition-colors group-hover:text-stone-800"
									>
										{item.title}
									</h4>
									<p class="mt-0.5 text-xs font-medium text-zinc-400">{item.site}</p>
								</div>
								{#if item.currentPrice != null}
									<div class="shrink-0 text-right text-sm font-semibold text-zinc-700">
										{page.fmt(item.currentPrice, item.currency)}
									</div>
								{/if}
							</a>
						{/each}
					</div>
				{/if}

				<a
					href={resolve('/items')}
					class="mt-7 block w-full rounded-2xl border border-zinc-200/60 bg-zinc-50/80 py-3.5 text-center text-sm font-medium text-zinc-700 transition-all duration-200 hover:bg-zinc-100 hover:text-zinc-900"
				>
					{t('items_view_all')} →
				</a>
			</div>
		</aside>
	</div>
</div>
