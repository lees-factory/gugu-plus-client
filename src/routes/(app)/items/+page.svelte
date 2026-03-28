<script lang="ts">
	import { auth } from '$lib/stores/auth.svelte';
	import ItemCard from '$lib/components/ItemCard.svelte';
	import EmptyState from '$lib/components/EmptyState.svelte';
	import AddItemModal from '$lib/components/AddItemModal.svelte';
	import { t } from '$lib/i18n/t';
	import { resolve } from '$app/paths';
	import { createItemsPage } from './items-page.svelte';

	const page = createItemsPage();
</script>

<div class="space-y-10 p-8 sm:p-10 lg:p-14">
	<!-- Page header (aligned with web-ref Watchlist) -->
	<div class="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
		<div class="max-w-2xl">
			<div
				class="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-100/50 bg-linear-to-r from-amber-50 to-orange-50 px-3 py-1.5"
			>
				<svg
					viewBox="0 0 24 24"
					fill="currentColor"
					stroke="currentColor"
					stroke-width="2.5"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="size-3.5 text-amber-600"
					aria-hidden="true"
				>
					<polygon
						points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
					/>
				</svg>
				<span class="text-xs font-semibold text-amber-700">{t('items_page_badge')}</span>
			</div>
			<h1
				class="flex flex-wrap items-baseline gap-x-1.5 text-4xl font-semibold tracking-tight text-zinc-900 md:text-5xl"
			>
				<span>{t('items_heading_my')}</span>
				<span class="bg-linear-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent"
					>{t('items_heading_watchlist')}</span
				>
			</h1>
			<p class="mt-6 max-w-xl text-base leading-relaxed text-zinc-600">
				{t('items_page_desc')}
			</p>
		</div>
		<button
			type="button"
			onclick={page.handleAddClick}
			disabled={page.model.loading}
			class="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-zinc-900/10 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-zinc-900/15 disabled:transform-none disabled:cursor-not-allowed disabled:opacity-50"
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
		</button>
	</div>

	<!-- Content area -->
	{#if page.model.loading}
		<div class="flex flex-col items-center justify-center gap-4 py-20">
			<svg
				class="size-8 animate-spin text-zinc-400"
				viewBox="0 0 24 24"
				fill="none"
				aria-hidden="true"
			>
				<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
				></circle>
				<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
				></path>
			</svg>
			<p class="text-sm text-zinc-500">{t('home_loading')}</p>
		</div>
	{:else if !auth.user}
		<div class="flex flex-col items-center justify-center gap-6 py-24 text-center">
			<div
				class="flex size-16 items-center justify-center rounded-3xl border border-zinc-200/60 bg-zinc-100/80 shadow-sm"
			>
				<svg
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="1.5"
					class="size-8 text-zinc-400"
					aria-hidden="true"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M20.25 7.5l-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
					/>
				</svg>
			</div>
			<div>
				<h2 class="text-xl font-semibold tracking-tight text-zinc-900">{t('guest_title')}</h2>
				<p class="mt-2 max-w-sm text-sm leading-relaxed text-zinc-600">{t('guest_desc')}</p>
			</div>
			<div class="flex gap-3">
				<a
					href={resolve('/auth/login')}
					class="rounded-2xl px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-zinc-900/10 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
					style="background: linear-gradient(to right, #292524, #3f3f46);"
				>
					{t('guest_login')}
				</a>
				<a
					href={resolve('/auth/signup')}
					class="rounded-2xl border border-zinc-200/60 bg-white/60 px-6 py-3 text-sm font-medium text-zinc-700 transition-all duration-200 hover:bg-white"
				>
					{t('guest_signup')}
				</a>
			</div>
		</div>
	{:else if page.model.listError}
		<div class="mx-auto max-w-md py-16 text-center">
			<p class="text-sm text-rose-600">{page.model.listError}</p>
			<button
				type="button"
				onclick={() => page.loadItems()}
				class="mt-4 rounded-2xl px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5"
				style="background: linear-gradient(to right, #292524, #3f3f46);"
			>
				{t('home_retry')}
			</button>
		</div>
	{:else}
		<!-- Search + Filters (web-ref Watchlist toolbar; no All/Active/Paused tabs) -->
		<div
			class="flex flex-col gap-4 rounded-3xl border border-zinc-200/60 bg-white/60 p-4 shadow-sm backdrop-blur-sm lg:flex-row lg:items-center lg:justify-between"
		>
			<div class="relative max-w-md flex-1">
				<svg
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					class="pointer-events-none absolute top-1/2 left-4 size-[18px] -translate-y-1/2 text-zinc-400"
					aria-hidden="true"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
					/>
				</svg>
				<input
					type="search"
					bind:value={page.searchQuery}
					placeholder={t('items_search_placeholder')}
					class="h-12 w-full rounded-2xl border border-zinc-200/60 bg-white/50 pr-4 pl-11 text-sm font-normal transition-all outline-none placeholder:text-zinc-400 focus:border-stone-300 focus:bg-white focus:ring-4 focus:ring-stone-100/50"
				/>
			</div>
			<div class="flex items-center gap-3">
				<button
					type="button"
					onclick={page.toggleFilterOpen}
					aria-expanded={page.filterOpen}
					class="inline-flex h-12 items-center justify-center rounded-2xl border px-5 text-sm font-medium transition-all duration-200
						{page.filterOpen
						? 'border-stone-200/80 bg-zinc-100/80 text-stone-800'
						: 'border-zinc-200/60 bg-white text-zinc-700 hover:bg-zinc-50'}"
				>
					<svg
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						class="mr-2 size-4"
						aria-hidden="true"
					>
						<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" stroke-linejoin="round" />
					</svg>
					{t('items_filters_button')}
					<svg
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						class="ml-2 size-4 transition-transform duration-300 {page.filterOpen
							? 'rotate-180'
							: ''}"
						aria-hidden="true"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="m6 9 6 6 6-6" />
					</svg>
				</button>
			</div>
		</div>

		{#if page.filterOpen}
			<div class="rounded-3xl border border-zinc-200/60 bg-white/60 p-6 shadow-sm backdrop-blur-sm">
				<div class="grid gap-6 md:grid-cols-2">
					<div>
						<label
							for="items-marketplace"
							class="text-[9px] font-semibold tracking-wider text-zinc-400 uppercase"
						>
							{t('items_filter_marketplace')}
						</label>
						<select
							id="items-marketplace"
							bind:value={page.marketplace}
							class="mt-2 w-full rounded-xl border border-zinc-200/60 bg-zinc-50/80 p-3 text-sm font-medium transition-colors outline-none focus:border-stone-300"
						>
							<option value="all">{t('items_market_all')}</option>
							{#each page.marketplaceSites as site (site)}
								<option value={site}>{site}</option>
							{/each}
						</select>
					</div>
					<div>
						<label
							for="items-sort"
							class="text-[9px] font-semibold tracking-wider text-zinc-400 uppercase"
						>
							{t('items_filter_sort')}
						</label>
						<select
							id="items-sort"
							value={page.sortBy}
							onchange={page.setSortFromSelect}
							class="mt-2 w-full rounded-xl border border-zinc-200/60 bg-zinc-50/80 p-3 text-sm font-medium transition-colors outline-none focus:border-stone-300"
						>
							<option value="recent">{t('items_sort_recent')}</option>
							<option value="title">{t('items_sort_title')}</option>
							<option value="site">{t('items_sort_site')}</option>
							<option value="price">{t('items_sort_price')}</option>
						</select>
					</div>
				</div>
			</div>
		{/if}

		{#if page.model.items.length === 0}
			<EmptyState onAdd={() => (page.model.modalOpen = true)} />
		{:else if page.displayedItems.length === 0}
			<p class="py-16 text-center text-sm text-zinc-500">{t('items_no_results')}</p>
		{:else}
			<!-- Chrome extension banner -->
			<div
				class="flex items-center justify-between rounded-3xl border border-zinc-200/60 bg-white/60 p-5 shadow-sm backdrop-blur-sm"
			>
				<div class="flex items-center gap-4">
					<div
						class="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-zinc-200/60 bg-white shadow-sm"
					>
						<svg
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							class="size-5 text-zinc-500"
							aria-hidden="true"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418"
							/>
						</svg>
					</div>
					<div>
						<p class="text-sm font-semibold text-zinc-900">{t('home_chrome_banner_title')}</p>
						<p class="text-xs text-zinc-500">{t('home_chrome_banner_desc')}</p>
					</div>
				</div>
				<button
					type="button"
					onclick={page.openChromeExtensionStore}
					class="hidden shrink-0 rounded-2xl border border-zinc-200/60 bg-white px-5 py-2.5 text-sm font-medium text-zinc-700 transition-all duration-200 hover:shadow-sm sm:block"
				>
					{t('home_install')}
				</button>
			</div>

			<!-- Column headers (desktop) — aligned with ItemCard -->
			<div
				class="mb-2 hidden items-center border-b border-zinc-200/60 px-4 py-2 text-[9px] font-semibold tracking-wider text-zinc-400 uppercase md:flex"
			>
				<div class="w-[72px] shrink-0"></div>
				<div class="min-w-0 flex-1 pr-4">{t('items_column_product')}</div>
				<div class="flex w-[380px] shrink-0 items-center justify-between gap-3 pr-4">
					<div class="w-20">{t('items_col_current')}</div>
					<div class="w-20">{t('items_col_target')}</div>
					<div class="w-24 text-center">{t('items_col_progress')}</div>
					<div class="w-20 text-right">{t('items_col_trend')}</div>
				</div>
				<div class="w-24 shrink-0 text-right">{t('item_delete')}</div>
			</div>

			<!-- Items list -->
			<div class="flex flex-col gap-4">
				{#each page.displayedItems as item (item.id)}
					<ItemCard
						{item}
						deleting={page.model.deletingId === item.id}
						onDelete={() => page.deleteItem(item.id)}
					/>
				{/each}
			</div>
		{/if}
	{/if}
</div>

<AddItemModal
	open={page.model.modalOpen}
	onClose={() => (page.model.modalOpen = false)}
	onAdd={page.handleAddItem}
/>
