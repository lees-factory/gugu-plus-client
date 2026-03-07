<script lang="ts">
	import { getContext } from 'svelte';
	import ItemCard from '$lib/components/ItemCard.svelte';
	import EmptyState from '$lib/components/EmptyState.svelte';
	import AddItemModal from '$lib/components/AddItemModal.svelte';
	import {
		productDetailDummy,
		productDetailDummyEarpods,
		type ProductDetailResponse
	} from '$lib/data/product-dummy';
	import type { TrackedItem, AddItemData } from '$lib/types';

	const toggleSidebar = getContext<() => void>('toggleSidebar');

	let modalOpen = $state(false);

	function sourceToSite(source: string): string {
		const map: Record<string, string> = {
			aliexpress: 'AliExpress',
			amazon: 'Amazon',
			ebay: 'eBay',
			taobao: 'Taobao'
		};
		return map[source.toLowerCase()] ?? source;
	}

	function toTrackedItem(resp: ProductDetailResponse, id: string): TrackedItem | null {
		if (!resp.success || !resp.data) return null;
		const { data } = resp;
		return {
			id,
			title: data.title,
			site: sourceToSite(data.source),
			imageUrl: data.main_image
		};
	}

	let items = $state<TrackedItem[]>(
		[
			toTrackedItem(productDetailDummyEarpods, 'earpods'),
			toTrackedItem(productDetailDummy, 'tshirt')
		].filter((i): i is TrackedItem => i !== null)
	);

	function handleAddItem(data: AddItemData) {
		// TODO: 실제 API 연동
		console.log('Adding item:', data);
	}
</script>

<!-- Sticky header -->
<div class="sticky top-0 z-10 border-b border-zinc-200 bg-white px-4 py-4 sm:px-6 sm:py-5">
	<div class="flex items-center gap-3">
		<!-- 사이드바 토글 -->
		<button
			type="button"
			onclick={toggleSidebar}
			aria-label="Toggle sidebar"
			class="flex size-8 shrink-0 items-center justify-center rounded-md text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900"
		>
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="size-4" aria-hidden="true">
				<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
			</svg>
		</button>

		<div class="flex flex-1 items-center justify-between">
			<div>
				<h1 class="text-lg font-semibold text-zinc-900 sm:text-xl">Dashboard</h1>
				<p class="mt-0.5 hidden text-sm text-zinc-500 sm:block">가격 변동을 실시간으로 모니터링하세요.</p>
			</div>
			<button
				type="button"
				onclick={() => (modalOpen = true)}
				class="flex items-center gap-1.5 rounded-lg bg-zinc-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-zinc-700 sm:gap-2 sm:px-4"
			>
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="size-4" aria-hidden="true">
					<path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
				</svg>
				<span class="hidden sm:inline">Add item</span>
				<span class="sm:hidden">추가</span>
			</button>
		</div>
	</div>
</div>

<!-- Content -->
{#if items.length === 0}
	<EmptyState onAdd={() => (modalOpen = true)} />
{:else}
	<div class="p-4 sm:p-6 lg:p-8">
		<!-- Chrome extension banner -->
		<div class="mb-5 rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-4">
			<div class="flex items-start gap-3 sm:items-center">
				<div class="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm sm:size-10">
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="size-4 text-blue-600 sm:size-5" aria-hidden="true">
						<path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
					</svg>
				</div>
				<div class="flex-1">
					<p class="text-sm font-medium text-zinc-900">Chrome 확장 프로그램으로 더 빠르게 추가</p>
					<p class="mt-0.5 text-xs text-zinc-500">지원 사이트 방문 중에 바로 상품을 추적하세요.</p>
					<!-- 모바일에서는 버튼을 텍스트 아래로 -->
					<button type="button" class="mt-2 text-xs font-medium text-blue-600 sm:hidden">
						설치하기 →
					</button>
				</div>
				<button
					type="button"
					class="hidden shrink-0 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 sm:block"
				>
					설치하기
				</button>
			</div>
		</div>

		<!-- Items list -->
		<div class="flex flex-col gap-2">
			{#each items as item (item.id)}
				<ItemCard {item} />
			{/each}
		</div>
	</div>
{/if}

<AddItemModal open={modalOpen} onClose={() => (modalOpen = false)} onAdd={handleAddItem} />
