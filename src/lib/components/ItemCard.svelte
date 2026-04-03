<script lang="ts">
	import { resolve } from '$app/paths';
	import { t } from '$lib/i18n/t';
	import type { TrackedItem } from '$lib/types';

	let {
		item,
		onDelete,
		deleting = false
	}: {
		item: TrackedItem;
		onDelete: () => void;
		deleting?: boolean;
	} = $props();

	let imgError = $state(false);

	function formatPrice(amount: number, currency: string): string {
		const c = currency.trim();
		try {
			const code = c === '₩' ? 'KRW' : c === '$' ? 'USD' : c.length === 3 ? c : 'KRW';
			return new Intl.NumberFormat('ko-KR', {
				style: 'currency',
				currency: code,
				maximumFractionDigits: 0
			}).format(amount);
		} catch {
			return `${Math.round(amount).toLocaleString('ko-KR')} ${c}`;
		}
	}
</script>

<div
	class="group flex flex-col rounded-3xl border border-zinc-200/60 bg-white transition-all duration-300 hover:border-stone-300/60 hover:shadow-lg hover:shadow-stone-500/5 sm:flex-row sm:items-center sm:rounded-2xl"
>
	<a
		href={resolve(`/items/${item.id}`)}
		class="flex min-w-0 flex-1 items-center gap-4 p-5 sm:p-4"
	>
		<!-- Thumbnail -->
		<div
			class="relative size-16 shrink-0 overflow-hidden rounded-2xl border border-zinc-200/60 bg-zinc-100 shadow-sm sm:size-14 sm:rounded-xl"
		>
			{#if !imgError && item.imageUrl}
				<img
					src={item.imageUrl}
					alt={item.title}
					class="size-full object-cover transition-transform duration-500 group-hover:scale-105"
					onerror={() => (imgError = true)}
				/>
			{:else}
				<div class="flex size-full items-center justify-center">
					<svg
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="1.5"
						class="size-6 text-zinc-400"
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

		<!-- Title + Site -->
		<div class="min-w-0 flex-1">
			<h3
				class="line-clamp-2 text-sm leading-snug font-semibold text-zinc-900 transition-colors group-hover:text-stone-800 sm:line-clamp-1"
			>
				{item.title}
			</h3>
			<div class="mt-1.5 flex items-center gap-2">
				<span
					class="rounded-lg border border-zinc-200/60 bg-zinc-50/80 px-2.5 py-0.5 text-[10px] font-semibold tracking-wider text-zinc-600 uppercase"
				>
					{item.site}
				</span>
			</div>
		</div>

		<!-- Price -->
		<div class="shrink-0 text-right">
			{#if item.currentPrice != null}
				<span class="text-base font-semibold text-zinc-900 tabular-nums sm:text-sm">
					{formatPrice(item.currentPrice, item.currency)}
				</span>
			{:else}
				<span class="text-sm text-zinc-400">{t('items_price_emdash')}</span>
			{/if}
		</div>
	</a>

	<!-- Delete -->
	<div
		class="flex shrink-0 items-center justify-end border-t border-zinc-100 px-5 py-3 sm:border-0 sm:border-l sm:border-zinc-100 sm:px-4 sm:py-0"
	>
		<button
			type="button"
			onclick={(e) => {
				e.preventDefault();
				onDelete();
			}}
			disabled={deleting}
			aria-label={t('aria_delete_track')}
			class="flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium text-zinc-500 transition-all duration-200 hover:bg-rose-50 hover:text-rose-700 disabled:cursor-not-allowed disabled:opacity-40"
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
			<span class="hidden sm:inline">{deleting ? t('item_deleting') : t('item_delete')}</span>
		</button>
	</div>
</div>
