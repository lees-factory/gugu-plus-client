<script lang="ts">
	import { parseCommerceProductUrl } from '$lib/commerce/parse-product-url';
	import { t } from '$lib/i18n/t';
	import type { AddItemData } from '$lib/types';

	let {
		open,
		initialUrl = '',
		onClose,
		onAdd
	}: {
		open: boolean;
		initialUrl?: string;
		onClose: () => void;
		onAdd: (data: AddItemData) => void | Promise<void>;
	} = $props();

	let url = $state('');
	let loading = $state(false);
	let submitError = $state<string | null>(null);

	$effect(() => {
		if (open && initialUrl) url = initialUrl;
	});

	const supportedSites = ['Amazon', 'eBay', 'AliExpress', 'Taobao', '1688', 'Coupang'];

	const parsed = $derived(parseCommerceProductUrl(url));

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		submitError = null;
		if (!url.trim()) return;

		const commerce = parseCommerceProductUrl(url);
		if (!commerce.ok) {
			submitError = commerce.message;
			return;
		}

		loading = true;
		try {
			await onAdd({ url: url.trim(), frequency: '24h', commerce });
			url = '';
			onClose();
		} catch (e) {
			submitError = e instanceof Error ? e.message : t('error_generic');
		} finally {
			loading = false;
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') onClose();
	}

	$effect(() => {
		if (open) {
			submitError = null;
			if (!initialUrl) url = '';
		}
	});
</script>

<svelte:window onkeydown={handleKeydown} />

{#if open}
	<div class="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-6">
		<!-- Backdrop -->
		<div
			class="absolute inset-0 bg-zinc-900/30 backdrop-blur-md"
			role="presentation"
			onclick={onClose}
		></div>

		<!-- Dialog -->
		<div class="relative z-10 w-full bg-white/95 backdrop-blur-xl shadow-2xl border border-zinc-200/50 overflow-hidden sm:max-w-lg rounded-t-3xl sm:rounded-3xl">
			<!-- Handle bar (mobile) -->
			<div class="flex justify-center pt-3 sm:hidden">
				<div class="h-1 w-10 rounded-full bg-zinc-200"></div>
			</div>

			<!-- Icon + Header -->
			<div class="px-8 pt-8 pb-0 md:px-10 md:pt-10">
				<div class="pr-12">
					<div
						class="mb-6 inline-flex size-14 items-center justify-center rounded-2xl text-white shadow-lg shadow-zinc-900/10"
						style="background: linear-gradient(135deg, #3f3f46 0%, #1c1917 100%);"
					>
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="size-6" aria-hidden="true">
							<path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
						</svg>
					</div>
					<h2 class="text-3xl font-semibold tracking-tight text-zinc-900">{t('modal_add_title')}</h2>
					<p class="mt-3 text-sm font-normal text-zinc-600 leading-relaxed">
						{t('modal_supported_sites', { sites: supportedSites.join(', ') })}
					</p>
				</div>
			</div>

			<!-- Close button -->
			<button
				type="button"
				onclick={onClose}
				class="absolute right-6 top-6 flex size-10 items-center justify-center rounded-2xl bg-zinc-100/80 text-zinc-400 transition-all duration-200 hover:bg-zinc-200 hover:text-zinc-900"
				aria-label={t('aria_close')}
			>
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="size-5" aria-hidden="true">
					<path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
				</svg>
			</button>

			<!-- Body -->
			<form onsubmit={handleSubmit} class="flex flex-col gap-5 px-8 pt-8 pb-8 md:px-10 md:pb-10">
				<!-- URL Input -->
				<div class="relative group">
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-zinc-400 transition-colors group-focus-within:text-stone-700" aria-hidden="true">
						<path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
					</svg>
					<input
						id="item-url"
						type="url"
						bind:value={url}
						placeholder={t('modal_url_placeholder')}
						required
						autofocus
						class="w-full rounded-2xl border-2 border-zinc-200/80 bg-zinc-50/50 pl-12 pr-4 py-4 text-sm font-normal outline-none transition-all placeholder:text-zinc-400 focus:border-stone-400 focus:bg-white"
						style="box-shadow: none;"
						onfocus={(e) => { (e.target as HTMLInputElement).style.boxShadow = '0 0 0 4px rgba(41, 37, 36, 0.08)'; }}
						onblur={(e) => { (e.target as HTMLInputElement).style.boxShadow = 'none'; }}
					/>
				</div>

				<!-- URL validation feedback -->
				{#if url.trim()}
					<div class="flex flex-wrap items-center gap-2 -mt-2">
						{#if parsed.ok}
							<span
								class="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold"
								style="border-color: rgba(90, 173, 156, 0.4); background-color: rgba(90, 173, 156, 0.08); color: #2d6b5e;"
							>
								<span class="size-1.5 rounded-full" style="background-color: #5aad9c;"></span>
								{parsed.displayName}
							</span>
							<span class="text-xs tabular-nums text-zinc-500">
								{t('modal_product_id_prefix')} {parsed.external_product_id}
							</span>
						{:else if parsed.displayName}
							<span
								class="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold"
								style="border-color: rgba(244, 63, 94, 0.3); background-color: rgba(244, 63, 94, 0.06); color: #9f1239;"
							>
								<span class="size-1.5 rounded-full" style="background-color: #f43f5e;"></span>
								{parsed.displayName}
							</span>
							<span class="text-xs text-zinc-500">{parsed.message}</span>
						{:else}
							<span class="inline-flex items-center rounded-full border border-zinc-200/60 bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-600">
								{parsed.message}
							</span>
						{/if}
					</div>
				{/if}

				{#if submitError}
					<p class="text-xs font-medium text-rose-600" role="alert">{submitError}</p>
				{/if}

				<!-- Actions -->
				<div class="flex gap-3 pt-1">
					<button
						type="button"
						onclick={onClose}
						class="flex-1 rounded-2xl py-4 text-sm font-medium text-zinc-700 transition-all duration-200 hover:bg-zinc-50 border border-zinc-200/80"
					>
						{t('modal_cancel')}
					</button>
					<button
						type="submit"
						disabled={!url.trim() || loading || !parsed.ok}
						class="flex-1 flex items-center justify-center rounded-2xl py-4 text-sm font-semibold text-white shadow-lg shadow-zinc-900/10 transition-all duration-300 hover:shadow-xl hover:shadow-zinc-900/15 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:pointer-events-none disabled:transform-none"
						style="background: linear-gradient(to right, #292524, #3f3f46);"
					>
						{#if loading}
							<svg class="mr-2 size-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
								<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
								<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
							</svg>
							{t('modal_add_loading')}
						{:else}
							{t('modal_add_submit')}
						{/if}
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}
