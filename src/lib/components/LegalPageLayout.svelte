<script lang="ts">
	import { resolve } from '$app/paths';
	import { t } from '$lib/i18n/t';
	import AppFooter from '$lib/components/AppFooter.svelte';
	import type { LegalSection } from '$lib/data/terms-sections';
	import type { Snippet } from 'svelte';

	let {
		title,
		subtitle,
		badgeText,
		badgeIcon,
		effectiveDate,
		sections,
		contactEmail,
		beforeSections,
		standalone = false
	}: {
		title: string;
		subtitle: string;
		badgeText: string;
		badgeIcon: Snippet;
		effectiveDate: string;
		sections: LegalSection[];
		contactEmail: string;
		beforeSections?: Snippet;
		standalone?: boolean;
	} = $props();
</script>

{#if standalone}
	<nav class="flex items-center justify-between px-5 pt-5 sm:px-8 sm:pt-6">
		<a href={resolve('/')} class="text-lg font-bold tracking-tight text-[#1c1917]">
			Price Eye
		</a>
		<a
			href={resolve('/')}
			class="flex items-center gap-1.5 rounded-xl border border-zinc-200/60 bg-white/80 px-4 py-2 text-xs font-semibold text-zinc-600 shadow-sm transition hover:bg-white hover:text-zinc-900"
		>
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="size-3.5" aria-hidden="true">
				<path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
			</svg>
			{t('legal_back_home')}
		</a>
	</nav>
{/if}

<div class="mx-auto max-w-2xl space-y-6 p-5 sm:p-6 lg:p-8">
	<!-- Page hero -->
	<div>
		<div
			class="mb-3 inline-flex items-center gap-2 rounded-full border border-zinc-200/50 bg-zinc-100/80 px-3 py-1.5"
		>
			{@render badgeIcon()}
			<span class="text-xs font-semibold text-stone-800">{badgeText}</span>
		</div>
		<h1 class="text-2xl font-semibold tracking-tight text-zinc-900 md:text-3xl">
			{title}
		</h1>
		<p class="mt-3 text-base leading-relaxed text-zinc-600">{subtitle}</p>
	</div>

	<!-- Content card -->
	<div class="rounded-2xl border border-zinc-200/50 bg-white p-7 sm:p-8">
		{#if beforeSections}
			{@render beforeSections()}
		{/if}

		{#each sections as section, i (i)}
			<div class={i < sections.length - 1 ? 'mb-7' : ''}>
				<h2 class="mb-3 text-sm font-semibold text-zinc-900">{section.title}</h2>
				<p class="whitespace-pre-line text-sm leading-relaxed text-zinc-500">
					{section.body}
				</p>
			</div>
		{/each}

		<div class="mt-8 rounded-xl bg-zinc-100/80 p-4 text-xs leading-relaxed text-zinc-500">
			{t('legal_contact')}: <a
				href="mailto:{contactEmail}"
				class="text-zinc-900 underline underline-offset-2">{contactEmail}</a
			>
			&middot; {t('legal_effective')}: {effectiveDate}
		</div>
	</div>
</div>

{#if standalone}
	<AppFooter />
{/if}
