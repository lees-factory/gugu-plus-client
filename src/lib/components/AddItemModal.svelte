<script lang="ts">
	import { tick } from 'svelte';
	import { parseCommerceProductUrl, type ParsedCommerceUrl } from '$lib/commerce/parse-product-url';
	import { t } from '$lib/i18n/t';
	import type { AddItemEntry } from '$lib/types';

	const MAX_ITEMS = 5;

	let {
		open,
		initialUrl = '',
		onClose,
		onAdd
	}: {
		open: boolean;
		initialUrl?: string;
		onClose: () => void;
		onAdd: (entries: AddItemEntry[]) => void | Promise<void>;
	} = $props();

	type UrlRow = { id: number; url: string };
	let nextId = 0;
	let rows = $state<UrlRow[]>([{ id: nextId++, url: '' }]);
	let loading = $state(false);
	let submitError = $state<string | null>(null);
	let inputEls = $state<Record<number, HTMLInputElement | undefined>>({});

	const parsedRows = $derived(
		rows.map((r) => ({ ...r, parsed: parseCommerceProductUrl(r.url) }))
	);

	const validCount = $derived(parsedRows.filter((r) => r.parsed.ok).length);

	$effect(() => {
		if (open && initialUrl) {
			rows = [{ id: nextId++, url: initialUrl }];
		}
	});

	$effect(() => {
		if (open) {
			submitError = null;
			if (!initialUrl) rows = [{ id: nextId++, url: '' }];
			void tick().then(() => {
				const firstId = rows[0]?.id;
				if (firstId != null) inputEls[firstId]?.focus();
			});
		}
	});

	const supportedSites = ['AliExpress'];

	function addRow() {
		if (rows.length >= MAX_ITEMS) return;
		const newId = nextId++;
		rows = [...rows, { id: newId, url: '' }];
		void tick().then(() => inputEls[newId]?.focus());
	}

	function removeRow(id: number) {
		if (rows.length <= 1) return;
		rows = rows.filter((r) => r.id !== id);
	}

	function handlePaste(e: ClipboardEvent, rowId: number) {
		const text = e.clipboardData?.getData('text') ?? '';
		const lines = text
			.split(/[\n\r]+/)
			.map((l) => l.trim())
			.filter((l) => l.startsWith('http'));

		if (lines.length <= 1) return;

		e.preventDefault();
		const currentIdx = rows.findIndex((r) => r.id === rowId);
		const before = rows.slice(0, currentIdx);
		const after = rows.slice(currentIdx + 1);
		const newRows = lines.slice(0, MAX_ITEMS - before.length - after.length).map((url) => ({
			id: nextId++,
			url
		}));
		rows = [...before, ...newRows, ...after].slice(0, MAX_ITEMS);
	}

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		submitError = null;

		const entries: AddItemEntry[] = parsedRows
			.filter((r) => r.parsed.ok)
			.map((r) => ({ url: r.url, commerce: r.parsed as ParsedCommerceUrl }));

		if (entries.length === 0) {
			submitError = t('error_generic');
			return;
		}

		loading = true;
		try {
			await onAdd(entries);
			rows = [{ id: nextId++, url: '' }];
			onClose();
		} catch (err) {
			submitError = err instanceof Error ? err.message : t('error_generic');
		} finally {
			loading = false;
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') onClose();
	}
</script>

<svelte:window onkeydown={handleKeydown} />

{#if open}
	<div class="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-6">
		<!-- Backdrop -->
		<div
			class="absolute inset-0 bg-zinc-900/30"
			role="presentation"
			onclick={onClose}
		></div>

		<!-- Dialog -->
		<div
			class="relative z-10 flex w-full max-h-[85svh] flex-col rounded-t-3xl border border-zinc-200/50 bg-white shadow-2xl sm:max-w-lg sm:rounded-3xl"
		>
			<!-- Handle bar + Close (fixed top) -->
			<div class="flex shrink-0 items-center justify-between px-6 pt-3 pb-0 sm:hidden">
				<div class="w-10"></div>
				<div class="h-1 w-10 rounded-full bg-zinc-300"></div>
				<button
					type="button"
					onclick={onClose}
					class="flex size-8 items-center justify-center rounded-xl text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-900"
					aria-label={t('aria_close')}
				>
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="size-4" aria-hidden="true">
						<path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
					</svg>
				</button>
			</div>

			<!-- Scrollable content -->
			<div class="flex-1 overflow-y-auto overscroll-contain">
				<!-- Icon + Header -->
				<div class="px-8 pt-6 pb-0 sm:pt-8 md:px-10 md:pt-10">
					<div class="pr-12">
						<div
							class="mb-6 inline-flex size-14 items-center justify-center rounded-2xl text-white shadow-lg shadow-zinc-900/10"
							style="background: linear-gradient(135deg, #3f3f46 0%, #1c1917 100%);"
						>
							<svg
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2.5"
								class="size-6"
								aria-hidden="true"
							>
								<path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
							</svg>
						</div>
						<h2 class="text-3xl font-semibold tracking-tight text-zinc-900">
							{t('modal_add_title')}
						</h2>
						<p class="mt-3 text-sm leading-relaxed font-normal text-zinc-600">
							{t('modal_supported_sites', { sites: supportedSites.join(', ') })}
						</p>
					</div>
				</div>

				<!-- Desktop close button -->
				<button
					type="button"
					onclick={onClose}
					class="absolute top-6 right-6 hidden size-10 items-center justify-center rounded-2xl bg-zinc-100/80 text-zinc-400 transition-all duration-200 hover:bg-zinc-200 hover:text-zinc-900 sm:flex"
					aria-label={t('aria_close')}
				>
					<svg
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						class="size-5"
						aria-hidden="true"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
					</svg>
				</button>

				<!-- Body -->
				<form onsubmit={handleSubmit} class="flex flex-col gap-4 px-8 pt-8 pb-8 md:px-10 md:pb-10">
				<!-- URL rows -->
				<div class="flex max-h-[280px] flex-col gap-3 overflow-y-auto">
					{#each parsedRows as row, idx (row.id)}
						<div class="group relative">
							<div class="flex items-center gap-2">
								<div class="relative flex-1">
									<svg
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
										class="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-zinc-400 transition-colors group-focus-within:text-stone-700"
										aria-hidden="true"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"
										/>
									</svg>
									<input
										type="url"
										bind:this={inputEls[row.id]}
										bind:value={rows[idx].url}
										placeholder={t('modal_url_placeholder')}
										onpaste={(e) => handlePaste(e, row.id)}
										class="w-full rounded-2xl border-2 bg-zinc-50/50 py-3.5 pr-4 pl-11 text-sm font-normal transition-all outline-none placeholder:text-zinc-400 focus:border-stone-400 focus:bg-white {row.url.trim()
											? row.parsed.ok
												? 'border-emerald-300/60'
												: 'border-zinc-200/80'
											: 'border-zinc-200/80'}"
									/>
								</div>
								{#if rows.length > 1}
									<button
										type="button"
										onclick={() => removeRow(row.id)}
										class="flex size-10 shrink-0 items-center justify-center rounded-xl text-zinc-400 transition hover:bg-rose-50 hover:text-rose-600"
										aria-label={t('modal_add_remove')}
									>
										<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="size-4" aria-hidden="true">
											<path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
										</svg>
									</button>
								{/if}
							</div>

							<!-- Inline validation -->
							{#if row.url.trim()}
								<div class="mt-1.5 flex flex-wrap items-center gap-2 pl-1">
									{#if row.parsed.ok}
										<span
											class="inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-semibold"
											style="border-color: rgba(90, 173, 156, 0.4); background-color: rgba(90, 173, 156, 0.08); color: #2d6b5e;"
										>
											<span class="size-1.5 rounded-full" style="background-color: #5aad9c;"></span>
											{row.parsed.displayName}
										</span>
										<span class="text-[11px] text-zinc-500 tabular-nums">
											{t('modal_product_id_prefix')} {row.parsed.external_product_id}
										</span>
									{:else if row.parsed.displayName}
										<span
											class="inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-semibold"
											style="border-color: rgba(244, 63, 94, 0.3); background-color: rgba(244, 63, 94, 0.06); color: #9f1239;"
										>
											<span class="size-1.5 rounded-full" style="background-color: #f43f5e;"></span>
											{row.parsed.displayName}
										</span>
										<span class="text-[11px] text-zinc-500">{row.parsed.message}</span>
									{:else}
										<span class="text-[11px] text-zinc-500">{row.parsed.message}</span>
									{/if}
								</div>
							{/if}
						</div>
					{/each}
				</div>

				<!-- Add another URL -->
				{#if rows.length < MAX_ITEMS}
					<button
						type="button"
						onclick={addRow}
						class="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-zinc-300/70 py-3.5 text-sm font-medium text-zinc-500 transition-all duration-200 hover:border-stone-400 hover:bg-stone-50 hover:text-stone-700"
					>
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="size-4" aria-hidden="true">
							<path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
						</svg>
						{t('modal_add_another')}
						<span class="rounded-full bg-zinc-200/80 px-2 py-0.5 text-[11px] font-semibold text-zinc-500">{rows.length}/{MAX_ITEMS}</span>
					</button>
				{:else}
					<div class="flex items-center justify-center rounded-2xl bg-zinc-100/60 py-3 text-xs font-medium text-zinc-400">
						{t('modal_add_max', { max: String(MAX_ITEMS) })}
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
						class="flex-1 rounded-2xl border border-zinc-200/80 py-4 text-sm font-medium text-zinc-700 transition-all duration-200 hover:bg-zinc-50"
					>
						{t('modal_cancel')}
					</button>
					<button
						type="submit"
						disabled={validCount === 0 || loading}
						class="flex flex-1 items-center justify-center rounded-2xl py-4 text-sm font-semibold text-white shadow-lg shadow-zinc-900/10 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-zinc-900/15 active:translate-y-0 disabled:pointer-events-none disabled:transform-none disabled:opacity-50"
						style="background: linear-gradient(to right, #292524, #3f3f46);"
					>
						{#if loading}
							<svg
								class="mr-2 size-4 animate-spin"
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
							{t('modal_add_loading')}
						{:else if validCount > 1}
							{t('modal_add_submit_count', { count: String(validCount) })}
						{:else}
							{t('modal_add_submit')}
						{/if}
					</button>
				</div>
			</form>
			</div>
		</div>
	</div>
{/if}
