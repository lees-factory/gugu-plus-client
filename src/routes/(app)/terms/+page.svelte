<script lang="ts">
	import { page } from '$app/stores';
	import LegalPageLayout from '$lib/components/LegalPageLayout.svelte';
	import SeoHead from '$lib/components/SeoHead.svelte';
	import { t } from '$lib/i18n/t';
	import { getTermsSections } from '$lib/data/terms-sections';

	const isGuest = $derived(!$page.data.userEmail);
	const sections = $derived(getTermsSections());
</script>

<SeoHead title={t('terms_seo_title')} description={t('terms_seo_desc')} canonical="/terms" />

<LegalPageLayout
	title={t('terms_title')}
	subtitle={t('terms_subtitle')}
	badgeText={t('terms_badge')}
	effectiveDate={t('terms_effective_date')}
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
			<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
			<polyline points="14 2 14 8 20 8" />
			<line x1="16" y1="13" x2="8" y2="13" />
			<line x1="16" y1="17" x2="8" y2="17" />
			<polyline points="10 9 9 9 8 9" />
		</svg>
	{/snippet}
</LegalPageLayout>
