<script lang="ts">
	import { t } from '$lib/i18n/t';
	import SeoHead from '$lib/components/SeoHead.svelte';
	import { createPlanPage } from './plan-page.svelte';

	const page = createPlanPage();

	const planJsonLd = {
		'@context': 'https://schema.org',
		'@type': 'WebApplication',
		name: 'Price Eye',
		url: 'https://priceeye.com',
		applicationCategory: 'ShoppingApplication',
		operatingSystem: 'Web',
		description: t('plan_jsonld_desc')
	};
</script>

<SeoHead
	title={t('plan_seo_title')}
	description={t('plan_seo_desc')}
	canonical="/plan"
	jsonLd={planJsonLd}
/>

<div class="space-y-6 p-5 sm:p-6 lg:p-8">
	<!-- Page hero -->
	<div class="max-w-2xl">
		<div
			class="mb-3 inline-flex items-center gap-2 rounded-full border border-zinc-200/50 bg-zinc-100/80 px-3 py-1.5"
		>
			<svg
				viewBox="0 0 24 24"
				fill="currentColor"
				class="size-3.5 text-stone-600"
				aria-hidden="true"
			>
				<path
					fill-rule="evenodd"
					d="M9 4.5a.75.75 0 0 1 .721.544l.813 2.846a3.75 3.75 0 0 0 2.576 2.576l2.846.813a.75.75 0 0 1 0 1.442l-2.846.813a3.75 3.75 0 0 0-2.576 2.576l-.813 2.846a.75.75 0 0 1-1.442 0l-.813-2.846a3.75 3.75 0 0 0-2.576-2.576l-2.846-.813a.75.75 0 0 1 0-1.442l2.846-.813A3.75 3.75 0 0 0 7.466 7.89l.813-2.846A.75.75 0 0 1 9 4.5Z"
					clip-rule="evenodd"
				/>
			</svg>
			<span class="text-xs font-semibold text-stone-800">{t('plan_badge')}</span>
		</div>
		<h1 class="text-2xl font-semibold tracking-tight text-zinc-900 md:text-3xl">
			{t('plan_title')}<br />
			<span class="text-zinc-600">{t('plan_title_accent')}</span>
		</h1>
		<p class="mt-3 text-base leading-relaxed text-zinc-600">
			{t('plan_desc')}
		</p>
	</div>

	<!-- Coming Soon card -->
	<div
		class="flex flex-col items-center justify-center rounded-3xl border border-zinc-200/60 bg-white p-10 shadow-sm sm:p-14"
	>
		<div
			class="mb-6 flex size-16 items-center justify-center rounded-2xl bg-linear-to-br from-stone-100 to-zinc-100"
		>
			<svg
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="1.5"
				class="size-8 text-stone-500"
				aria-hidden="true"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
				/>
			</svg>
		</div>
		<h2 class="mb-2 text-xl font-semibold tracking-tight text-zinc-900">
			{t('plan_coming_soon_title')}
		</h2>
		<p class="max-w-md text-center text-sm leading-relaxed text-zinc-500">
			{t('plan_coming_soon_desc')}
		</p>
	</div>

	<!-- Data policy note -->
	<div
		class="flex items-start gap-4 rounded-3xl border border-stone-200/80 bg-gradient-to-r from-stone-50 to-zinc-50 p-6 shadow-sm"
	>
		<div
			class="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-stone-800 to-zinc-700 text-white shadow-sm"
		>
			<svg
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="size-5"
				aria-hidden="true"
			>
				<polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
				<polyline points="16 7 22 7 22 13" />
			</svg>
		</div>
		<div>
			<p class="text-sm font-semibold text-zinc-900">
				{t('plan_data_policy_title')}
			</p>
			<p class="mt-1.5 text-sm leading-relaxed text-zinc-600">
				{t('plan_data_policy_desc')}
			</p>
		</div>
	</div>

	<!-- FAQ -->
	<div>
		<div class="mb-5 flex items-center gap-4">
			<div
				class="flex size-12 items-center justify-center rounded-2xl bg-linear-to-br from-zinc-100 to-stone-100 text-zinc-600 shadow-sm"
			>
				<svg
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="size-5"
					aria-hidden="true"
				>
					<circle cx="12" cy="12" r="10" />
					<path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
					<line x1="12" y1="17" x2="12.01" y2="17" />
				</svg>
			</div>
			<h2 class="text-2xl font-semibold tracking-tight text-zinc-900">{t('plan_faq_title')}</h2>
		</div>

		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
			{#each page.faqItems as faq (faq.q)}
				<div class="rounded-3xl border border-zinc-200/60 bg-white p-6 shadow-sm">
					<h3 class="mb-2 text-sm font-semibold text-zinc-900">{faq.q}</h3>
					<p class="text-sm leading-relaxed text-zinc-500">{faq.a}</p>
				</div>
			{/each}
		</div>
	</div>
</div>
