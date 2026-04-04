<script lang="ts">
	import { resolve } from '$app/paths';
	import { t } from '$lib/i18n/t';

	const year = new Date().getFullYear();
</script>

<footer class="mt-auto border-t border-zinc-200/60 px-6 py-6 sm:px-8">
	<div class="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
		<p class="text-xs text-zinc-400">
			{t('footer_copyright', { year })}
		</p>
		<div class="flex items-center gap-5 text-xs text-zinc-400">
			<a href={resolve('/terms')} class="transition-all duration-200 hover:text-zinc-700">
				{t('footer_terms')}
			</a>
			<span class="opacity-30">·</span>
			<a href={resolve('/privacy')} class="transition-all duration-200 hover:text-zinc-700">
				{t('footer_privacy')}
			</a>
			<span class="opacity-30">·</span>
			<a href="mailto:priceeye.support@gmail.com" class="transition-all duration-200 hover:text-zinc-700">
				{t('footer_contact')}
			</a>
		</div>
	</div>
</footer>
