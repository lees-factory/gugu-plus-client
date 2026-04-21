<script lang="ts">
	import { getLocale } from '$lib/paraglide/runtime.js';
	import { t } from '$lib/i18n/t';

	/**
	 * 운영 도메인 — .env 의 VITE_SITE_URL 이 우선, 없으면 프로덕션 fallback.
	 * 하드코드 fallback 을 두는 이유: Vercel 등 빌드 환경에서 env 가 누락돼도
	 * canonical/og:url/og:image 가 절대 URL 로 나가야 social 공유·JSON-LD 가 정상 동작한다.
	 */
	const BASE_URL =
		(import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/+$/, '') ??
		'https://priceeye.vercel.app';

	interface Props {
		title: string;
		description?: string;
		canonical?: string;
		ogImage?: string;
		noindex?: boolean;
		type?: 'website' | 'article';
		jsonLd?: Record<string, unknown> | null;
	}

	let {
		title,
		description = undefined,
		canonical,
		ogImage = '/og-default.png',
		noindex = false,
		type = 'website',
		jsonLd = null
	}: Props = $props();

	const resolvedDescription = $derived(description ?? t('seo_default_description'));

	const locale = $derived(getLocale());
	const ogLocale = $derived(locale === 'ko' ? 'ko_KR' : 'en_US');
	const ogLocaleAlt = $derived(locale === 'ko' ? 'en_US' : 'ko_KR');

	const fullCanonical = $derived(
		canonical ? (canonical.startsWith('http') ? canonical : `${BASE_URL}${canonical}`) : undefined
	);

	const fullOgImage = $derived(ogImage.startsWith('http') ? ogImage : `${BASE_URL}${ogImage}`);

	const SCRIPT_OPEN = '<' + 'script type="application/ld+json">';
	const SCRIPT_CLOSE = '</' + 'script>';
	const SCRIPT_CLOSE_ESCAPED = '<\\/' + 'script>';
	const jsonLdHtml = $derived(
		jsonLd
			? `${SCRIPT_OPEN}${JSON.stringify(jsonLd).replaceAll(SCRIPT_CLOSE, SCRIPT_CLOSE_ESCAPED)}${SCRIPT_CLOSE}`
			: null
	);
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={resolvedDescription} />

	{#if noindex}
		<meta name="robots" content="noindex, nofollow" />
	{/if}

	{#if fullCanonical}
		<link rel="canonical" href={fullCanonical} />
		<link rel="alternate" hreflang="ko" href={fullCanonical} />
		<link rel="alternate" hreflang="en" href={fullCanonical} />
		<link rel="alternate" hreflang="x-default" href={fullCanonical} />
	{/if}

	<!-- Open Graph -->
	<meta property="og:title" content={title} />
	<meta property="og:description" content={resolvedDescription} />
	<meta property="og:type" content={type} />
	<meta property="og:image" content={fullOgImage} />
	{#if fullCanonical}
		<meta property="og:url" content={fullCanonical} />
	{/if}
	<meta property="og:site_name" content="Price Eye" />
	<meta property="og:locale" content={ogLocale} />
	<meta property="og:locale:alternate" content={ogLocaleAlt} />

	<!-- Twitter Card -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={resolvedDescription} />
	<meta name="twitter:image" content={fullOgImage} />

	<!-- JSON-LD — jsonLd 는 JSON.stringify + </script> escape 처리되므로 XSS 안전 -->
	{#if jsonLdHtml}
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html jsonLdHtml}
	{/if}
</svelte:head>
