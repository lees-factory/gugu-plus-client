<script lang="ts">
	import { page } from '$app/stores';
	import LegalPageLayout from '$lib/components/LegalPageLayout.svelte';
	import SeoHead from '$lib/components/SeoHead.svelte';
	import { t } from '$lib/i18n/t';
	import { getPrivacySections, getPrivacySummaryItems } from '$lib/data/privacy-sections';

	const isGuest = $derived(!$page.data.userEmail);
	const sections = $derived(getPrivacySections());
	const summaryItems = $derived(getPrivacySummaryItems());
</script>

<SeoHead title={t('privacy_seo_title')} description={t('privacy_seo_desc')} canonical="/privacy" />

<LegalPageLayout
	title={t('privacy_title')}
	subtitle={t('privacy_subtitle')}
	badgeText={t('privacy_badge')}
	effectiveDate={t('privacy_effective_date')}
	{sections}
	contactEmail="priceeye.support@gmail.com"
	standalone={isGuest}
>
	{#snippet badgeIcon()}
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			class="size-3.5 text-stone-600"
			aria-hidden="true"
		>
			<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
		</svg>
	{/snippet}

	{#snippet beforeSections()}
		<div class="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
			{#each summaryItems as item (item.icon)}
				<div class="rounded-xl bg-zinc-100/80 p-4 text-center">
					<p class="mb-1 text-xs font-semibold text-zinc-900">{item.label}</p>
					<p class="text-xs leading-relaxed text-zinc-500">{item.desc}</p>
				</div>
			{/each}
		</div>
	{/snippet}
</LegalPageLayout>
