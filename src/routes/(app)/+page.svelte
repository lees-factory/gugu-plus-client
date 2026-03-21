<script lang="ts">
	import { onMount } from 'svelte';
	import { getContext } from 'svelte';
	import ItemCard from '$lib/components/ItemCard.svelte';
	import EmptyState from '$lib/components/EmptyState.svelte';
	import AddItemModal from '$lib/components/AddItemModal.svelte';
	import { createHomePageModel } from './home-page.svelte';

	const toggleSidebar = getContext<() => void>('toggleSidebar');

	const home = createHomePageModel();

	onMount(() => {
		void home.loadItems();
	});
</script>

<!-- Sticky header -->
<div
	class="sticky top-0 z-10 bg-white px-6 py-5 sm:px-8 sm:py-6"
	style="border-bottom: 1px solid rgba(45, 45, 42, 0.06);"
>
	<div class="flex items-center gap-3">
		<!-- 사이드바 토글 -->
		<button
			type="button"
			onclick={toggleSidebar}
			aria-label="Toggle sidebar"
			class="flex size-9 shrink-0 items-center justify-center rounded-xl transition hover:bg-[#f7f6f3]"
			style="color: #6b6b65;"
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
					d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
				/>
			</svg>
		</button>

		<div class="flex flex-1 items-center justify-between">
			<div>
				<h1
					class="text-2xl font-semibold sm:text-3xl"
					style="color: #1a1a17; letter-spacing: -0.02em;"
				>
					Tracked Items
				</h1>
				<p class="mt-0.5 hidden text-sm sm:block" style="color: #6b6b65;">
					가격 변동을 실시간으로 모니터링하세요.
				</p>
			</div>
			<button
				type="button"
				onclick={() => (home.modalOpen = true)}
				disabled={home.loading}
				class="flex items-center gap-2.5 rounded-xl px-5 py-2.5 text-sm font-medium transition-all hover:shadow-md disabled:cursor-not-allowed disabled:opacity-40"
				style="background-color: #2d2d2a; color: #ffffff;"
			>
				<svg
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					class="size-4"
					aria-hidden="true"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
				</svg>
				<span class="hidden sm:inline">Add item</span>
				<span class="sm:hidden">추가</span>
			</button>
		</div>
	</div>
</div>

<!-- Content -->
{#if home.loading}
	<div class="flex flex-col items-center justify-center gap-4 px-6 py-20 sm:px-8">
		<svg class="size-8 animate-spin" viewBox="0 0 24 24" fill="none" style="color: #6b6b65;" aria-hidden="true">
			<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
			<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
		</svg>
		<p class="text-sm" style="color: #6b6b65;">목록을 불러오는 중…</p>
	</div>
{:else if home.listError}
	<div class="mx-auto max-w-md px-6 py-16 text-center sm:px-8">
		<p class="text-sm" style="color: #d4183d;">{home.listError}</p>
		<button
			type="button"
			onclick={() => home.loadItems()}
			class="mt-4 rounded-xl px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
			style="background-color: #2d2d2a;"
		>
			다시 시도
		</button>
	</div>
{:else if home.items.length === 0}
	<EmptyState onAdd={() => (home.modalOpen = true)} />
{:else}
	<div class="max-w-[1400px] p-6 sm:p-8 lg:p-10">
		<!-- Chrome extension banner -->
		<div
			class="mb-8 flex items-center justify-between rounded-2xl p-6 shadow-sm"
			style="background: linear-gradient(135deg, #e8f2f0 0%, #f0f9f7 100%); border: 1px solid rgba(90, 173, 156, 0.15);"
		>
			<div class="flex items-center gap-4">
				<div
					class="flex size-12 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm"
				>
					<svg
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						class="size-5"
						style="color: #5aad9c;"
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
					<p class="mb-0.5 font-medium" style="color: #1a1a17;">
						Chrome 확장 프로그램으로 더 빠르게 추가
					</p>
					<p class="text-sm" style="color: #6b6b65;">
						지원 사이트 방문 중에 바로 상품을 추적하세요.
					</p>
				</div>
			</div>
			<button
				type="button"
				onclick={() => {
					window.open(
						'https://chromewebstore.google.com/detail/ldigkhkcbjmiingoclccjjcnbcgiooao?utm_source=item-share-cb',
						'_blank'
					);
				}}
				class="hidden shrink-0 rounded-xl bg-white px-5 py-2.5 text-sm font-medium transition-all hover:shadow-md sm:block"
				style="color: #2d2d2a; border: 1px solid rgba(45, 45, 42, 0.06);"
			>
				설치하기
			</button>
		</div>

		<!-- Items list -->
		<div class="space-y-4">
			{#each home.items as item (item.id)}
				<ItemCard {item} />
			{/each}
		</div>
	</div>
{/if}

<AddItemModal
	open={home.modalOpen}
	onClose={() => (home.modalOpen = false)}
	onAdd={home.handleAddItem}
/>
