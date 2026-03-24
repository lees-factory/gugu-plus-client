<script lang="ts">
	import { t } from '$lib/i18n/t';

	let { onAdd }: { onAdd: () => void } = $props();
</script>

<div class="flex flex-col items-center justify-center py-24 text-center px-6">
	<div
		class="flex size-20 items-center justify-center rounded-2xl"
		style="background-color: #f7f6f3;"
	>
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="size-9" style="color: #6b6b65;" aria-hidden="true">
			<path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
		</svg>
	</div>
	<h2 class="mt-5 text-lg font-semibold" style="color: #1a1a17;">{t('empty_title')}</h2>
	<p class="mt-2 max-w-sm text-sm" style="color: #6b6b65;">
		{t('empty_desc')}
	</p>
	<button
		type="button"
		onclick={onAdd}
		class="mt-7 flex items-center gap-2.5 rounded-xl px-5 py-2.5 text-sm font-medium transition-all hover:shadow-md"
		style="background-color: #2d2d2a; color: #ffffff;"
	>
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="size-4" aria-hidden="true">
			<path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
		</svg>
		{t('empty_cta')}
	</button>
</div>
