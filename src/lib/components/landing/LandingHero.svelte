<script lang="ts">
	import { resolve } from '$app/paths';
	import { t } from '$lib/i18n/t';
</script>

<section
	class="relative z-10 overflow-hidden px-5 pt-20 pb-16 sm:px-8 sm:pt-28 sm:pb-20 lg:pt-36 lg:pb-28"
>
	<!-- Subtle background gradient -->
	<div class="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
		<div
			class="absolute top-0 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full opacity-20"
			style="background: radial-gradient(ellipse, #5aad9c 0%, transparent 70%);"
		></div>
	</div>

	<div class="mx-auto max-w-3xl text-center">
		<!-- Badge -->
		<div
			class="mb-6 inline-flex items-center gap-2 rounded-full border border-zinc-200/50 bg-white/80 px-4 py-2 shadow-sm backdrop-blur-sm"
		>
			<span class="relative flex size-2">
				<span
					class="absolute inline-flex size-full animate-ping rounded-full bg-[#5aad9c] opacity-75"
				></span>
				<span class="relative inline-flex size-2 rounded-full bg-[#5aad9c]"></span>
			</span>
			<span class="text-xs font-semibold tracking-wide text-stone-700"
				>{t('landing_hero_badge')}</span
			>
		</div>

		<!-- H1 -->
		<h1
			class="text-4xl leading-[1.1] font-bold tracking-[-0.025em] text-[#1c1917] sm:text-5xl lg:text-6xl"
		>
			{t('landing_hero_title_1')}<br />
			<span class="bg-gradient-to-r from-[#5aad9c] to-[#4a9a8a] bg-clip-text text-transparent"
				>{t('landing_hero_title_2')}</span
			>
		</h1>

		<!-- Subtitle -->
		<p class="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-zinc-600 sm:text-xl">
			{t('landing_hero_subtitle')}
		</p>

		<!-- CTAs -->
		<div class="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
			<a
				href={resolve('/auth/signup')}
				class="inline-flex h-12 items-center gap-2 rounded-2xl px-7 text-sm font-semibold text-white shadow-lg shadow-zinc-900/15 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl"
				style="background: linear-gradient(to right, #292524, #3f3f46);"
			>
				<svg
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					class="size-4"
					aria-hidden="true"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
				</svg>
				{t('landing_hero_cta_start')}
			</a>
			<a
				href="{resolve('/auth/login')}?provider=google"
				class="inline-flex h-12 items-center gap-3 rounded-2xl border border-zinc-200/60 bg-white px-7 text-sm font-semibold text-zinc-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-zinc-50 hover:shadow-md"
			>
				<svg viewBox="0 0 24 24" class="size-5" aria-hidden="true">
					<path
						d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
						fill="#4285F4"
					/>
					<path
						d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
						fill="#34A853"
					/>
					<path
						d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
						fill="#FBBC05"
					/>
					<path
						d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
						fill="#EA4335"
					/>
				</svg>
				{t('landing_hero_cta_google')}
			</a>
		</div>

		<!-- Trust indicators -->
		<div
			class="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-zinc-400"
		>
			<span class="flex items-center gap-1.5">
				<svg
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					class="size-3.5"
					aria-hidden="true"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
					/>
				</svg>
				{t('landing_trust_secure')}
			</span>
			<span class="flex items-center gap-1.5">
				<svg
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					class="size-3.5"
					aria-hidden="true"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
					/>
				</svg>
				{t('landing_trust_daily')}
			</span>
			<span class="flex items-center gap-1.5">
				<svg
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					class="size-3.5"
					aria-hidden="true"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z"
					/>
				</svg>
				{t('landing_trust_free')}
			</span>
		</div>
	</div>
</section>
