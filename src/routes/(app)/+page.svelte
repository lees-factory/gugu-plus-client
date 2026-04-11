<script lang="ts">
	import { t } from '$lib/i18n/t';
	import LandingPage from '$lib/components/landing/LandingPage.svelte';
	import SeoHead from '$lib/components/SeoHead.svelte';

	const SITE_URL = (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/+$/, '') ?? '';

	/**
	 * FAQ 항목: `LandingFaq.svelte` 의 FAQS 배열과 1:1 동기화.
	 * 한쪽을 수정하면 다른 쪽도 동일 번호로 맞춰야 schema 와 visible UI 가 일치한다.
	 * (구글은 화면에 없는 FAQ schema 를 "invisible FAQ" 로 간주해 리치 리절트 제외)
	 */
	const FAQ_KEYS = [
		['landing_faq_q1', 'landing_faq_a1'],
		['landing_faq_q2', 'landing_faq_a2'],
		['landing_faq_q3', 'landing_faq_a3'],
		['landing_faq_q4', 'landing_faq_a4'],
		['landing_faq_q5', 'landing_faq_a5'],
		['landing_faq_q6', 'landing_faq_a6'],
		['landing_faq_q7', 'landing_faq_a7'],
		['landing_faq_q8', 'landing_faq_a8'],
		['landing_faq_q9', 'landing_faq_a9'],
		['landing_faq_q10', 'landing_faq_a10']
	] as const;

	/**
	 * 구조화 데이터: @graph 로 4종 schema 병렬 배치.
	 * - WebApplication: "이 서비스가 뭘 하는지"
	 * - Organization: 브랜드 식별 (지식 그래프)
	 * - WebSite: 사이트 메타
	 * - FAQPage: 리치 리절트(검색 결과에서 아코디언으로 노출)
	 */
	const landingJsonLd = {
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'WebApplication',
				'@id': `${SITE_URL}/#webapp`,
				name: 'Price Eye',
				url: SITE_URL || '/',
				description: t('landing_seo_desc'),
				applicationCategory: 'ShoppingApplication',
				operatingSystem: 'Web',
				inLanguage: ['ko-KR', 'en-US'],
				offers: {
					'@type': 'Offer',
					price: '0',
					priceCurrency: 'KRW'
				}
			},
			{
				'@type': 'Organization',
				'@id': `${SITE_URL}/#organization`,
				name: 'Price Eye',
				url: SITE_URL || '/',
				logo: `${SITE_URL}/og-default.png`,
				email: 'priceeye.support@gmail.com'
			},
			{
				'@type': 'WebSite',
				'@id': `${SITE_URL}/#website`,
				name: 'Price Eye',
				url: SITE_URL || '/',
				inLanguage: ['ko-KR', 'en-US'],
				publisher: { '@id': `${SITE_URL}/#organization` }
			},
			{
				'@type': 'FAQPage',
				'@id': `${SITE_URL}/#faq`,
				mainEntity: FAQ_KEYS.map(([qKey, aKey]) => ({
					'@type': 'Question',
					name: t(qKey),
					acceptedAnswer: {
						'@type': 'Answer',
						text: t(aKey)
					}
				}))
			}
		]
	};
</script>

<SeoHead
	title={t('landing_seo_title')}
	description={t('landing_seo_desc')}
	canonical="/"
	jsonLd={landingJsonLd}
/>
<LandingPage />
