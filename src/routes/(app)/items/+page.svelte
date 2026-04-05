<script lang="ts">
	import type { PageProps } from './$types';
	import { invalidate } from '$app/navigation';
	import { auth } from '$lib/stores/auth.svelte';
	import ItemCard from '$lib/components/ItemCard.svelte';
	import EmptyState from '$lib/components/EmptyState.svelte';
	import AddItemModal from '$lib/components/AddItemModal.svelte';
	import { t } from '$lib/i18n/t';
	import { resolve } from '$app/paths';
	import ConfirmDialog from '$lib/components/ConfirmDialog.svelte';
	import { createItemsPage } from './items-page.svelte';

	const { data }: PageProps = $props();
	const page = createItemsPage(() => data);
</script>

<div class="space-y-6 p-5 sm:p-6 lg:p-8">
	<!-- Page header (aligned with web-ref Watchlist) -->
	<div class="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
		<div class="max-w-2xl">
			<div
				class="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-100/50 bg-linear-to-r from-amber-50 to-orange-50 px-3 py-1.5"
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
				class="flex flex-wrap items-baseline gap-x-1.5 text-2xl font-semibold tracking-tight text-zinc-900 md:text-3xl"
			>
				<span>{t('items_heading_my')}</span>
				<span class="bg-linear-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent"
					>{t('items_heading_watchlist')}</span
				>
			</h1>
			<p class="mt-3 max-w-xl text-base leading-relaxed text-zinc-600">
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

	<!-- ad:top -->

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
				onclick={() => invalidate('app:tracked-items')}
				class="mt-4 rounded-2xl px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5"
				style="background: linear-gradient(to right, #292524, #3f3f46);"
			>
				{t('home_retry')}
			</button>
		</div>
	{:else if page.model.items.length === 0}
		<EmptyState onAdd={() => (page.model.modalOpen = true)} />
	{:else}
		<!-- Search / Filter / Sort bar -->
		<div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-2">
			<!-- Search input -->
			<div class="relative flex-1">
				<svg
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					class="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-zinc-400"
					aria-hidden="true"
				>
					<circle cx="11" cy="11" r="8" />
					<path d="m21 21-4.3-4.3" stroke-linecap="round" />
				</svg>
				<input
					type="text"
					bind:value={page.searchQuery}
					placeholder={t('items_search_placeholder')}
					class="w-full rounded-xl border border-zinc-200/60 bg-white py-2.5 pr-4 pl-10 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-300 focus:ring-1 focus:ring-zinc-300 focus:outline-none"
				/>
			</div>

			<!-- Sort dropdown -->
			<select
				onchange={page.setSortFromSelect}
				value={page.sortBy}
				class="shrink-0 appearance-none rounded-xl border border-zinc-200/60 bg-white bg-[length:16px_16px] bg-[right_8px_center] bg-no-repeat py-2.5 pr-8 pl-3 text-xs font-medium text-zinc-700 focus:border-zinc-300 focus:ring-1 focus:ring-zinc-300 focus:outline-none"
				style="background-image: url(&quot;data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%2371717a'%3E%3Cpath fill-rule='evenodd' d='M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z'/%3E%3C/svg%3E&quot;);"
			>
				<option value="recent">{t('items_sort_recent')}</option>
				<option value="title">{t('items_sort_title')}</option>
				<option value="price">{t('items_sort_price')}</option>
			</select>
		</div>

		<!-- Chrome extension banner -->
		{#if !page.bannerDismissed}
			<div
				class="flex items-center justify-between rounded-3xl border border-zinc-200/60 bg-white p-5 shadow-sm"
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
				<div class="flex items-center gap-2">
					<button
						type="button"
						onclick={page.openChromeExtensionStore}
						class="shrink-0 rounded-2xl border border-zinc-200/60 bg-white px-5 py-2.5 text-sm font-medium text-zinc-700 transition-all duration-200 hover:shadow-sm"
					>
						{t('home_install')}
					</button>
					<button
						type="button"
						onclick={page.dismissBanner}
						class="flex size-8 shrink-0 items-center justify-center rounded-xl text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-600"
						aria-label={t('aria_close')}
					>
						<svg
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							class="size-4"
							aria-hidden="true"
						>
							<path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
						</svg>
					</button>
				</div>
			</div>
		{/if}

		{#if page.displayedItems.length === 0}
			<p class="py-16 text-center text-sm text-zinc-500">{t('items_no_results')}</p>
		{:else}
			<!-- Items list -->
			<div class="flex flex-col gap-4">
				{#each page.displayedItems as item, idx (item.id)}
					{#if idx > 0 && idx % 5 === 0}
						<!-- ad:infeed -->
					{/if}
					<ItemCard
						{item}
						deleting={page.model.deletingId === item.id}
						onDelete={() => page.deleteItem(item.id)}
					/>
				{/each}
			</div>

			<!-- Infinite scroll sentinel -->
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
							{t('home_loading')}
						</span>
					{:else if !page.model.hasMore && page.displayedItems.length > 0}
						<span>{t('items_no_more')}</span>
					{/if}
				</div>
			</div>
		{/if}
	{/if}

	<!-- ad:bottom -->
</div>

<AddItemModal
	open={page.model.modalOpen}
	onClose={() => (page.model.modalOpen = false)}
	onAdd={page.handleAddItem}
/>

<ConfirmDialog
	open={page.confirmDeleteId !== null}
	message={t('confirm_delete_track')}
	onConfirm={page.confirmDelete}
	onCancel={page.cancelDelete}
/>
