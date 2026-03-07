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
	let frequency = $state('6h');
	let loading = $state(false);

	const frequencies = [
		{ value: '1h', label: '1시간' },
		{ value: '6h', label: '6시간' },
		{ value: '24h', label: '24시간' }
	];

	const supportedSites = ['Amazon', 'eBay', 'AliExpress', 'Taobao', '1688', 'Coupang'];

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		if (!url.trim()) return;
		loading = true;
		await new Promise((r) => setTimeout(r, 800));
		onAdd({ url: url.trim(), frequency });
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
			class="absolute inset-0 bg-black/40 backdrop-blur-sm"
			role="presentation"
			onclick={onClose}
		></div>

		<!-- Dialog: mobile bottom sheet / desktop centered modal -->
		<div class="relative z-10 w-full rounded-t-2xl border border-zinc-200 bg-white shadow-xl sm:max-w-md sm:rounded-2xl">
			<!-- Handle bar (모바일) -->
			<div class="flex justify-center pt-3 sm:hidden">
				<div class="h-1 w-10 rounded-full bg-zinc-200"></div>
			</div>

			<!-- Header -->
			<div class="flex items-center justify-between border-b border-zinc-100 px-5 py-4">
				<h2 class="text-base font-semibold text-zinc-900">상품 추가</h2>
				<button
					type="button"
					onclick={onClose}
					class="flex size-7 items-center justify-center rounded-md text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700"
					aria-label="닫기"
				>
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="size-4" aria-hidden="true">
						<path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
					</svg>
				</button>
			</div>

			<!-- Body -->
			<form onsubmit={handleSubmit} class="flex flex-col gap-5 p-5">
				<div class="flex flex-col gap-1.5">
					<label for="item-url" class="text-sm font-medium text-zinc-700">상품 URL</label>
					<input
						id="item-url"
						type="url"
						bind:value={url}
						placeholder="https://www.amazon.com/dp/..."
						required
						autofocus
						class="h-10 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 transition focus:border-zinc-400 focus:ring-2 focus:ring-zinc-900/10"
					/>
					<p class="text-xs text-zinc-400">지원: {supportedSites.join(', ')}</p>
				</div>

				<div class="flex flex-col gap-1.5">
					<label class="text-sm font-medium text-zinc-700">가격 확인 주기</label>
					<div class="grid grid-cols-3 gap-2">
						{#each frequencies as f}
							<button
								type="button"
								onclick={() => (frequency = f.value)}
								class="rounded-md border py-2.5 text-sm font-medium transition {frequency === f.value
									? 'border-zinc-900 bg-zinc-900 text-white'
									: 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50'}"
							>
								{f.label}
							</button>
						{/each}
					</div>
				</div>

				<div class="flex gap-2 pb-1">
					<button
						type="button"
						onclick={onClose}
						class="flex-1 rounded-md border border-zinc-200 bg-white py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
					>
						취소
					</button>
					<button
						type="submit"
						disabled={!url.trim() || loading}
						class="flex-1 rounded-md bg-zinc-900 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50"
					>
						{loading ? '추가 중...' : '추가하기'}
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}
