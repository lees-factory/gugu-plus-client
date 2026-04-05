<script lang="ts">
	import { t } from '$lib/i18n/t';

	const features = $derived([
		{
			title: t('landing_feat_track_title'),
			desc: t('landing_feat_track_desc'),
			icon: 'chart'
		},
		{
			title: t('landing_feat_alert_title'),
			desc: t('landing_feat_alert_desc'),
			icon: 'bell'
		},
		{
			title: t('landing_feat_analysis_title'),
			desc: t('landing_feat_analysis_desc'),
			icon: 'sparkle'
		}
	]);
</script>

<section class="px-5 py-16 sm:px-8 sm:py-24">
	<div class="mx-auto max-w-5xl">
		<!-- Section heading -->
		<div class="mb-12 text-center sm:mb-16">
			<h2 class="text-2xl font-bold tracking-[-0.025em] text-[#1c1917] sm:text-3xl">
				{t('landing_feat_heading')}
			</h2>
			<p class="mt-3 text-base text-zinc-500">
				{t('landing_feat_subheading')}
			</p>
		</div>

		<!-- Cards grid -->
		<div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
			{#each features as feat (feat.icon)}
				<div
					class="group rounded-3xl border border-zinc-200/60 bg-white p-7 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-stone-500/5"
				>
					<!-- Icon -->
					<div
						class="mb-5 flex size-12 items-center justify-center rounded-2xl border border-zinc-200/60 bg-gradient-to-br from-zinc-50 to-white shadow-sm"
					>
						{#if feat.icon === 'chart'}
							<svg
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="1.5"
								class="size-5 text-[#5aad9c]"
								aria-hidden="true"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"
								/>
							</svg>
						{:else if feat.icon === 'bell'}
							<svg
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="1.5"
								class="size-5 text-[#5aad9c]"
								aria-hidden="true"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
								/>
							</svg>
						{:else}
							<svg
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="1.5"
								class="size-5 text-[#5aad9c]"
								aria-hidden="true"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
								/>
							</svg>
						{/if}
					</div>

					<h3 class="text-base font-semibold tracking-tight text-[#1c1917]">{feat.title}</h3>
					<p class="mt-2 text-sm leading-relaxed text-zinc-500">{feat.desc}</p>
				</div>
			{/each}
		</div>
	</div>
</section>
