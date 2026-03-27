<script lang="ts">
	import { t } from '$lib/i18n/t';

	let { onAdd }: { onAdd: () => void } = $props();
</script>

<div class="flex flex-col items-center justify-center px-6 py-24 text-center">
	<div
		class="mb-8 flex size-20 items-center justify-center rounded-3xl border border-zinc-200/60 bg-zinc-100/80 shadow-sm"
	>
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="1.5"
			class="size-9 text-zinc-400"
			aria-hidden="true"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
			/>
		</svg>
	</div>
	<h2 class="text-xl font-semibold tracking-tight text-zinc-900">{t('empty_title')}</h2>
	<p class="mt-3 max-w-sm text-sm leading-relaxed text-zinc-600">
		{t('empty_desc')}
	</p>
	<button
		type="button"
		onclick={onAdd}
		class="mt-8 flex items-center gap-2 rounded-2xl px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-zinc-900/10 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-zinc-900/15"
		style="background: linear-gradient(to right, #292524, #3f3f46);"
	>
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2.5"
			class="size-4"
			aria-hidden="true"
		>
			<path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
		</svg>
		{t('empty_cta')}
	</button>
</div>
