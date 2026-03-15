<script lang="ts">
	import type { AddItemData } from '$lib/types';

	let {
		open,
		onClose,
		onAdd
	}: {
		open: boolean;
		onClose: () => void;
		onAdd: (data: AddItemData) => void;
	} = $props();

	let url = $state('');
	let loading = $state(false);

	const supportedSites = ['Amazon', 'eBay', 'AliExpress', 'Taobao', '1688', 'Coupang'];

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		if (!url.trim()) return;
		loading = true;
		await new Promise((r) => setTimeout(r, 800));
		onAdd({ url: url.trim(), frequency: '24h' });
		loading = false;
		url = '';
		frequency = '6h';
		onClose();
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') onClose();
	}
</script>

<svelte:window onkeydown={handleKeydown} />

{#if open}
	<!-- Backdrop -->
	<div class="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
		<div
			class="absolute inset-0 backdrop-blur-sm"
			style="background-color: rgba(0, 0, 0, 0.4);"
			role="presentation"
			onclick={onClose}
		></div>

		<!-- Dialog: mobile bottom sheet / desktop centered modal -->
		<div
			class="relative z-10 w-full bg-white shadow-2xl sm:max-w-lg"
			style="border-radius: 1.5rem 1.5rem 1.5rem 1.5rem; border: 1px solid rgba(45, 45, 42, 0.06);"
		>
			<!-- Handle bar (모바일) -->
			<div class="flex justify-center pt-3 sm:hidden">
				<div class="h-1 w-10 rounded-full" style="background-color: #e8e7e3;"></div>
			</div>

			<!-- Header -->
			<div class="flex items-center justify-between px-7 py-6" style="border-bottom: 1px solid rgba(45, 45, 42, 0.06);">
				<h2 class="text-lg font-semibold" style="color: #1a1a17; letter-spacing: -0.01em;">상품 추가</h2>
				<button
					type="button"
					onclick={onClose}
					class="flex size-8 items-center justify-center rounded-lg transition hover:bg-[#f7f6f3]"
					style="color: #6b6b65;"
					aria-label="닫기"
				>
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="size-4" aria-hidden="true">
						<path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
					</svg>
				</button>
			</div>

			<!-- Body -->
			<form onsubmit={handleSubmit} class="flex flex-col gap-6 p-7">
				<!-- URL Input -->
				<div class="flex flex-col gap-2">
					<label for="item-url" class="text-sm font-medium" style="color: #1a1a17;">상품 URL</label>
					<div class="relative">
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="absolute left-4 top-1/2 -translate-y-1/2 size-4" style="color: #6b6b65;" aria-hidden="true">
							<path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
						</svg>
						<input
							id="item-url"
							type="url"
							bind:value={url}
							placeholder="https://www.amazon.com/dp/..."
							required
							autofocus
							class="w-full rounded-xl pl-11 pr-4 py-3 text-sm outline-none transition-all"
							style="
								border: 1px solid rgba(45, 45, 42, 0.1);
								background-color: #ffffff;
								color: #1a1a17;
							"
						/>
					</div>
					<p class="text-xs" style="color: #6b6b65;">지원: {supportedSites.join(', ')}</p>
				</div>

				<!-- Actions -->
				<div class="flex gap-3 pt-1 pb-1">
					<button
						type="button"
						onclick={onClose}
						class="flex-1 rounded-xl py-3 text-sm font-medium transition-all hover:shadow-sm"
						style="border: 1px solid rgba(45, 45, 42, 0.1); color: #6b6b65; background-color: #ffffff;"
					>
						취소
					</button>
					<button
						type="submit"
						disabled={!url.trim() || loading}
						class="flex-1 rounded-xl py-3 text-sm font-medium transition-all hover:shadow-md disabled:cursor-not-allowed disabled:opacity-40"
						style="background-color: #2d2d2a; color: #ffffff;"
					>
						{loading ? '추가 중...' : '추가하기'}
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}
