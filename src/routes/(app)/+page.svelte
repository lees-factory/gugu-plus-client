<script lang="ts">
	import { t } from '$lib/i18n/t';
	import LandingPage from '$lib/components/landing/LandingPage.svelte';
	import SeoHead from '$lib/components/SeoHead.svelte';
</script>

<SeoHead
	title={t('landing_seo_title')}
	description={t('landing_seo_desc')}
	canonical="/"
	jsonLd={{
		'@context': 'https://schema.org',
		'@type': 'WebApplication',
		name: 'Price Eye',
		url: 'https://priceeye.com',
		description: t('landing_seo_desc'),
		applicationCategory: 'ShoppingApplication',
		operatingSystem: 'Web',
		offers: {
			'@type': 'Offer',
			price: '0',
			priceCurrency: 'KRW'
		}
	}}
/>
<LandingPage />
