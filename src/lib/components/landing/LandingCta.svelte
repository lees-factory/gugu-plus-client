<script lang="ts">
	import { resolve } from '$app/paths';
	import { t } from '$lib/i18n/t';
</script>

<section class="px-5 py-16 sm:px-8 sm:py-24">
	<div class="mx-auto max-w-3xl">
		<div class="rounded-3xl border border-zinc-200/60 bg-white p-8 text-center shadow-sm sm:p-14">
			<h2 class="text-2xl font-bold tracking-[-0.025em] text-[#1c1917] sm:text-3xl">
				{t('landing_cta_heading')}
			</h2>
			<p class="mx-auto mt-4 max-w-md text-base leading-relaxed text-zinc-500">
				{t('landing_cta_desc')}
			</p>
			<div class="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
				<a
					href={resolve('/auth/signup')}
					class="inline-flex h-12 items-center gap-2 rounded-2xl px-8 text-sm font-semibold text-white shadow-lg shadow-zinc-900/15 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl"
					style="background: linear-gradient(to right, #292524, #3f3f46);"
				>
					{t('landing_cta_button')}
				</a>
			</div>
			<p class="mt-5 text-xs text-zinc-400">{t('landing_cta_note')}</p>
		</div>
	</div>
</section>
