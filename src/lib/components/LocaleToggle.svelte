<script lang="ts">
	import { getLocale, setLocale } from '$lib/paraglide/runtime.js';
	import { t } from '$lib/i18n/t';

	const current = $derived(getLocale());

	function select(next: 'en' | 'ko') {
		if (getLocale() !== next) setLocale(next);
	}
</script>

<div
	class="inline-flex rounded-lg p-0.5"
	style="border: 1px solid rgba(45, 45, 42, 0.12); background-color: #fafaf8;"
	role="group"
	aria-label={t('locale_switch_label')}
>
	<button
		type="button"
		onclick={() => select('en')}
		class="rounded-md px-2.5 py-1 text-xs font-semibold transition"
		style="
			background-color: {current === 'en' ? '#2d2d2a' : 'transparent'};
			color: {current === 'en' ? '#ffffff' : '#6b6b65'};
		"
		aria-pressed={current === 'en'}
	>
		EN
	</button>
	<button
		type="button"
		onclick={() => select('ko')}
		class="rounded-md px-2.5 py-1 text-xs font-semibold transition"
		style="
			background-color: {current === 'ko' ? '#2d2d2a' : 'transparent'};
			color: {current === 'ko' ? '#ffffff' : '#6b6b65'};
		"
		aria-pressed={current === 'ko'}
	>
		KO
	</button>
</div>
