<script lang="ts">
	import { localizeHref } from '$lib/paraglide/runtime.js';
	import { t } from '$lib/i18n/t';
	import LocaleToggle from '$lib/components/LocaleToggle.svelte';

	const year = new Date().getFullYear();
</script>

<footer class="mt-auto px-6 py-6 sm:px-8" style="border-top: 1px solid rgba(45, 45, 42, 0.06);">
	<div class="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
		<p class="text-xs" style="color: #6b6b65;">
			{t('footer_copyright', { year })}
		</p>
		<div class="flex flex-wrap items-center justify-center gap-4 sm:gap-5">
			<LocaleToggle />
			<div class="flex items-center gap-5 text-xs" style="color: #6b6b65;">
				<a
					href={localizeHref('/terms')}
					class="transition hover:opacity-70"
					style="color: #6b6b65;"
				>
					{t('footer_terms')}
				</a>
				<span style="opacity: 0.3;">·</span>
				<a
					href={localizeHref('/privacy')}
					class="transition hover:opacity-70"
					style="color: #6b6b65;"
				>
					{t('footer_privacy')}
				</a>
				<span style="opacity: 0.3;">·</span>
				<a
					href="mailto:support@gugu.plus"
					class="transition hover:opacity-70"
					style="color: #6b6b65;"
				>
					{t('footer_contact')}
				</a>
			</div>
		</div>
	</div>
</footer>
