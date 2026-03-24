<script lang="ts">
	import { localizeHref } from '$lib/paraglide/runtime.js';
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

	const siteColors: Record<string, { bg: string; text: string }> = {
		Amazon: { bg: '#fef3e8', text: '#c97d32' },
		Taobao: { bg: '#fef0e8', text: '#c96332' },
		eBay: { bg: '#fef9e8', text: '#c9a832' },
		AliExpress: { bg: '#fee8e8', text: '#c93232' },
		'1688': { bg: '#fef5e8', text: '#c99532' }
	};

	const siteStyle = $derived(siteColors[item.site] ?? { bg: '#f7f6f3', text: '#6b6b65' });
</script>

<div
	class="flex rounded-2xl bg-white transition-all hover:shadow-lg"
	style="border: 1px solid rgba(45, 45, 42, 0.06);"
>
	<a
		href={localizeHref(`/items/${item.productId}`)}
		class="flex min-w-0 flex-1 gap-5 p-5 sm:p-6"
	>
		<!-- Image -->
		<div
			class="size-20 shrink-0 overflow-hidden rounded-xl sm:size-24"
			style="background-color: #f7f6f3;"
		>
			{#if !imgError && item.imageUrl}
				<img
					src={item.imageUrl}
					alt={item.title}
					class="size-full object-cover"
					onerror={() => (imgError = true)}
				/>
			{:else}
				<div class="flex size-full items-center justify-center">
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="size-7" style="color: #6b6b65; opacity: 0.4;" aria-hidden="true">
						<path stroke-linecap="round" stroke-linejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
					</svg>
				</div>
			{/if}
		</div>

		<!-- Content -->
		<div class="min-w-0 flex-1">
			<div class="mb-2 flex items-start gap-3">
				<h3 class="line-clamp-2 flex-1 text-sm font-medium sm:text-base" style="color: #1a1a17; line-height: 1.5;">
					{item.title}
				</h3>
				<span
					class="shrink-0 rounded-lg px-2.5 py-1 text-xs font-medium"
					style="background-color: {siteStyle.bg}; color: {siteStyle.text};"
				>
					{item.site}
				</span>
			</div>

			<div class="mt-3 flex items-center gap-1.5">
				<span class="text-xs" style="color: #6b6b65;">{t('item_view_details')}</span>
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="size-3.5" style="color: #6b6b65;" aria-hidden="true">
					<path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
				</svg>
			</div>
		</div>
	</a>

	<div
		class="flex shrink-0 flex-col justify-center border-l border-[rgba(45,45,42,0.08)] px-2 py-3 sm:px-3"
	>
		<button
			type="button"
			onclick={(e) => {
				e.preventDefault();
				onDelete();
			}}
			disabled={deleting}
			aria-label={t('aria_delete_track')}
			class="flex flex-col items-center justify-center gap-1 rounded-xl px-2 py-2 text-xs font-medium transition hover:bg-[#fee8e8] disabled:cursor-not-allowed disabled:opacity-40 sm:flex-row sm:gap-1.5 sm:px-3"
			style="color: #d4183d;"
		>
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="size-5 sm:size-4" aria-hidden="true">
				<path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
			</svg>
			<span class="hidden sm:inline">{deleting ? t('item_deleting') : t('item_delete')}</span>
		</button>
	</div>
</div>
