<script lang="ts">
	import { t } from '$lib/i18n/t';

	const steps = $derived([
		{
			num: '01',
			title: t('landing_step1_title'),
			desc: t('landing_step1_desc'),
			icon: 'link'
		},
		{
			num: '02',
			title: t('landing_step2_title'),
			desc: t('landing_step2_desc'),
			icon: 'refresh'
		},
		{
			num: '03',
			title: t('landing_step3_title'),
			desc: t('landing_step3_desc'),
			icon: 'mail'
		}
	]);
</script>

<section class="px-5 py-16 sm:px-8 sm:py-24">
	<div class="mx-auto max-w-5xl">
		<!-- Section heading -->
		<div class="mb-12 text-center sm:mb-16">
			<h2 class="text-2xl font-bold tracking-[-0.025em] text-[#1c1917] sm:text-3xl">
				{t('landing_how_heading')}
			</h2>
			<p class="mt-3 text-base text-zinc-500">
				{t('landing_how_subheading')}
			</p>
		</div>

		<!-- Steps -->
		<div class="grid gap-8 sm:grid-cols-3">
			{#each steps as step, idx (step.num)}
				<div class="relative text-center">
					<!-- Connector line (hidden on first and mobile) -->
					{#if idx > 0}
						<div
							class="pointer-events-none absolute top-8 right-full hidden h-px w-8 bg-zinc-200 sm:block"
							aria-hidden="true"
						></div>
					{/if}

					<!-- Step number circle -->
					<div
						class="mx-auto mb-5 flex size-16 items-center justify-center rounded-3xl border border-zinc-200/60 bg-white shadow-sm"
					>
						{#if step.icon === 'link'}
							<svg
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="1.5"
								class="size-6 text-[#5aad9c]"
								aria-hidden="true"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"
								/>
							</svg>
						{:else if step.icon === 'refresh'}
							<svg
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="1.5"
								class="size-6 text-[#5aad9c]"
								aria-hidden="true"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182M21.015 4.356v4.992"
								/>
							</svg>
						{:else}
							<svg
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="1.5"
								class="size-6 text-[#5aad9c]"
								aria-hidden="true"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
								/>
							</svg>
						{/if}
					</div>

					<!-- Step label -->
					<span
						class="mb-2 block text-[11px] font-semibold tracking-widest text-[#5aad9c] uppercase"
						>{t('landing_step_label', { num: step.num })}</span
					>
					<h3 class="text-base font-semibold tracking-tight text-[#1c1917]">{step.title}</h3>
					<p class="mx-auto mt-2 max-w-[260px] text-sm leading-relaxed text-zinc-500">
						{step.desc}
					</p>
				</div>
			{/each}
		</div>
	</div>
</section>
