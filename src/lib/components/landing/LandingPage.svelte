<script lang="ts">
	import { resolve } from '$app/paths';
	import { getLocale, setLocale } from '$lib/paraglide/runtime.js';
	import { t } from '$lib/i18n/t';
	import LandingHero from './LandingHero.svelte';
	import LandingFeatures from './LandingFeatures.svelte';
	import LandingHowItWorks from './LandingHowItWorks.svelte';
	import LandingFaq from './LandingFaq.svelte';
	import LandingCta from './LandingCta.svelte';
	import AppFooter from '$lib/components/AppFooter.svelte';

	let langOpen = $state(false);
	const currentLocale = $derived(getLocale());

	function selectLocale(locale: 'en' | 'ko') {
		if (getLocale() !== locale) setLocale(locale);
		langOpen = false;
	}
</script>

<div class="min-h-svh bg-[#F5F4F1]">
	<!-- Landing Nav -->
	<nav
		class="sticky top-0 z-50 flex items-center justify-between bg-[#F5F4F1]/80 px-5 py-4 backdrop-blur-sm sm:px-8"
	>
		<a href={resolve('/')} class="text-lg font-bold tracking-tight text-[#1c1917]"> Price Eye </a>

		<div class="flex items-center gap-3">
			<!-- Language switcher -->
			<div class="relative">
				<button
					type="button"
					onclick={() => (langOpen = !langOpen)}
					class="flex items-center gap-1.5 rounded-xl border border-zinc-200/60 bg-white/80 px-3 py-2 text-xs font-semibold text-zinc-600 shadow-sm backdrop-blur-sm transition hover:bg-white hover:text-zinc-900"
				>
					<svg
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="1.5"
						class="size-4"
						aria-hidden="true"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5a17.92 17.92 0 0 1-8.716-2.247m0 0A8.966 8.966 0 0 1 3 12c0-1.264.26-2.467.732-3.558"
						/>
					</svg>
					{currentLocale === 'ko' ? '한국어' : 'EN'}
				</button>

				{#if langOpen}
					<div
						class="fixed inset-0 z-40"
						role="presentation"
						onclick={() => (langOpen = false)}
					></div>
					<div
						class="absolute right-0 z-50 mt-2 w-36 overflow-hidden rounded-2xl border border-zinc-200/60 bg-white shadow-xl"
					>
						<button
							type="button"
							onclick={() => selectLocale('ko')}
							class="flex w-full items-center justify-between px-4 py-2.5 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50"
							style="background-color: {currentLocale === 'ko' ? '#f5f5f4' : 'transparent'};"
						>
							한국어
							{#if currentLocale === 'ko'}
								<svg
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2.5"
									class="size-3.5 text-zinc-700"
									aria-hidden="true"
								>
									<path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
								</svg>
							{/if}
						</button>
						<button
							type="button"
							onclick={() => selectLocale('en')}
							class="flex w-full items-center justify-between px-4 py-2.5 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50"
							style="background-color: {currentLocale === 'en' ? '#f5f5f4' : 'transparent'};"
						>
							English
							{#if currentLocale === 'en'}
								<svg
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2.5"
									class="size-3.5 text-zinc-700"
									aria-hidden="true"
								>
									<path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
								</svg>
							{/if}
						</button>
					</div>
				{/if}
			</div>

			<a
				href={resolve('/auth/login')}
				class="rounded-xl border border-zinc-200/60 bg-white/80 px-4 py-2 text-xs font-semibold text-zinc-700 shadow-sm backdrop-blur-sm transition hover:bg-white hover:text-zinc-900"
			>
				{t('header_login')}
			</a>
		</div>
	</nav>

	<LandingHero />
	<LandingFeatures />
	<LandingHowItWorks />
	<LandingFaq />
	<LandingCta />
	<AppFooter />
</div>
