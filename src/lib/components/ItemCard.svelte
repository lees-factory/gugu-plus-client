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
		if (c === '₩' || c === 'KRW') return `${Math.round(amount).toLocaleString('ko-KR')}₩`;
		if (c === '$' || c === 'USD')
			return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
		return `${amount.toLocaleString()} ${c}`;
	}

	function formatTrendPct(pct: number): string {
		const sign = pct > 0 ? '+' : '';
		return `${sign}${pct.toFixed(1)}%`;
	}

	const progress = $derived(
		item.progressPct != null ? Math.min(100, Math.max(0, item.progressPct)) : null
	);
</script>

<div
	class="group flex flex-col rounded-3xl border border-zinc-200/60 bg-white/60 backdrop-blur-sm transition-all duration-300 hover:border-stone-300/60 hover:shadow-lg hover:shadow-stone-500/5 md:flex-row md:items-stretch md:rounded-2xl"
>
	<a
		href={resolve(`/items/${item.id}`)}
		class="flex min-w-0 flex-1 flex-col gap-4 p-5 md:flex-row md:items-center md:gap-0 md:p-4"
	>
		<div class="flex min-w-0 flex-1 items-start gap-4 md:items-center md:gap-4 md:pr-4">
			<div class="flex w-[72px] shrink-0 justify-center md:justify-start">
				<div
					class="relative size-20 shrink-0 overflow-hidden rounded-2xl border border-zinc-200/60 bg-zinc-100 shadow-sm md:size-14 md:rounded-xl"
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
			</div>

			<div class="min-w-0 flex-1">
				<h3
					class="line-clamp-2 text-sm leading-snug font-semibold text-zinc-900 transition-colors group-hover:text-stone-800 md:line-clamp-1"
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
		</div>

		<div
			class="flex flex-col gap-4 border-t border-zinc-100 pt-4 md:mt-0 md:w-[380px] md:shrink-0 md:flex-row md:items-center md:justify-between md:gap-3 md:border-0 md:pt-0"
		>
			<div class="flex justify-between gap-4 md:contents">
				<div class="flex flex-col md:w-20">
					<span
						class="mb-1 text-[10px] font-semibold tracking-wider text-zinc-400 uppercase md:hidden"
						>{t('items_col_current')}</span
					>
					<span class="text-2xl leading-none font-semibold text-zinc-900 md:text-sm">
						{#if item.currentPrice != null}
							{formatPrice(item.currentPrice, item.currency)}
						{:else}
							<span class="text-zinc-400">{t('items_price_emdash')}</span>
						{/if}
					</span>
				</div>

				<div class="flex flex-col text-right md:w-20 md:text-left">
					<span
						class="mb-1 text-[10px] font-semibold tracking-wider text-zinc-400 uppercase md:hidden"
						>{t('items_col_target')}</span
					>
					<span class="text-xl leading-none font-medium text-zinc-600 md:text-sm">
						{#if item.targetPrice != null}
							{formatPrice(item.targetPrice, item.currency)}
						{:else}
							<span class="text-zinc-400">{t('items_price_emdash')}</span>
						{/if}
					</span>
				</div>
			</div>

			<div class="hidden w-24 flex-col justify-center gap-2 md:flex">
				<div
					class="flex justify-between text-[9px] leading-none font-semibold tracking-wider text-zinc-400 uppercase"
				>
					<span>{t('items_col_progress')}</span>
					{#if progress != null}
						<span class={progress >= 100 ? 'text-stone-800' : ''}>{Math.round(progress)}%</span>
					{:else}
						<span class="text-zinc-400">—</span>
					{/if}
				</div>
				{#if progress != null}
					<div class="h-1.5 w-full overflow-hidden rounded-full bg-zinc-100 shadow-inner">
						<div
							class="h-full rounded-full bg-gradient-to-r from-stone-800 to-stone-600 shadow-sm transition-all duration-500 ease-out"
							style="width: {progress}%"
						></div>
					</div>
				{:else}
					<div class="h-1.5 w-full rounded-full bg-zinc-100/80"></div>
				{/if}
			</div>

			<div class="md:hidden">
				<span class="mb-1 block text-[10px] font-semibold tracking-wider text-zinc-400 uppercase"
					>{t('items_col_progress')}</span
				>
				{#if progress != null}
					<div class="flex items-center justify-between text-[11px] font-semibold text-zinc-600">
						<span>{t('items_progress_to_target')}</span>
						<span class={progress >= 100 ? 'text-stone-800' : ''}>{Math.round(progress)}%</span>
					</div>
					<div class="mt-2 h-2 w-full overflow-hidden rounded-full bg-zinc-100 shadow-inner">
						<div
							class="h-full rounded-full bg-gradient-to-r from-stone-800 to-stone-600 transition-all duration-500"
							style="width: {progress}%"
						></div>
					</div>
				{:else}
					<p class="text-sm text-zinc-400">{t('items_price_emdash')}</p>
				{/if}
			</div>

			<div class="flex flex-col items-end md:w-20 md:items-end md:justify-center">
				<span
					class="mb-1 text-[10px] font-semibold tracking-wider text-zinc-400 uppercase md:hidden"
					>{t('items_col_trend')}</span
				>
				{#if item.trendPct != null}
					<span
						class="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-semibold tracking-wide shadow-sm
							{item.trendPct < 0
							? 'border-emerald-100/50 bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700'
							: item.trendPct > 0
								? 'border-rose-100/50 bg-gradient-to-r from-rose-50 to-pink-50 text-rose-700'
								: 'border-zinc-200/60 bg-zinc-50/90 text-zinc-600'}"
					>
						{#if item.trendPct < 0}
							<svg
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
								class="size-3"
								aria-hidden="true"
							>
								<polyline points="22 17 13.5 8.5 8.5 13.5 2 7" />
								<polyline points="16 17 22 17 22 11" />
							</svg>
						{:else if item.trendPct > 0}
							<svg
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
								class="size-3"
								aria-hidden="true"
							>
								<polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
								<polyline points="16 7 22 7 22 13" />
							</svg>
						{/if}
						{formatTrendPct(item.trendPct)}
					</span>
				{:else}
					<span class="text-sm text-zinc-400 md:text-xs">{t('items_price_emdash')}</span>
				{/if}
			</div>
		</div>
	</a>

	<div
		class="flex w-full shrink-0 items-center justify-end border-t border-zinc-100 px-5 py-3 md:w-24 md:border-0 md:border-l md:border-zinc-100 md:px-2 md:py-0"
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
