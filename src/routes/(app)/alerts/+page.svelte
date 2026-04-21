<script lang="ts">
	import type { PageProps } from './$types';
	import { resolve } from '$app/paths';
	import { t } from '$lib/i18n/t';
	import GuestPlaceholder from '$lib/components/GuestPlaceholder.svelte';

	const { data }: PageProps = $props();
</script>

{#if !data.userEmail}
	<GuestPlaceholder icon="bell" />
{:else}
	<div class="space-y-6 p-5 sm:p-6 lg:p-8">
		<div class="max-w-2xl">
			<div
				class="mb-3 inline-flex items-center gap-2 rounded-full border border-zinc-200/50 bg-zinc-100/80 px-3 py-1.5"
			>
				<svg
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					class="size-3.5 text-stone-600"
					aria-hidden="true"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
					/>
				</svg>
				<span class="text-xs font-semibold text-stone-800">{t('alerts_title')}</span>
			</div>
			<h1 class="text-2xl font-semibold tracking-tight text-zinc-900 md:text-3xl">
				{t('alerts_title')}
			</h1>
			<p class="mt-3 text-base leading-relaxed text-zinc-600">{t('alerts_subtitle')}</p>
		</div>

		<div class="rounded-3xl border border-zinc-200/60 bg-white p-14 text-center">
			<div
				class="mx-auto mb-5 flex size-14 items-center justify-center rounded-2xl"
				style="background-color: #f7f6f3;"
			>
				<svg
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="1.5"
					class="size-7"
					style="color: #9b9b95;"
					aria-hidden="true"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
					/>
				</svg>
			</div>
			<p class="text-sm font-medium text-zinc-900">{t('alerts_empty_title')}</p>
			<p class="mt-1.5 text-xs text-zinc-500">{t('alerts_empty_desc')}</p>
			<a
				href={resolve('/items')}
				class="mt-4 inline-block text-sm font-medium text-stone-700 underline underline-offset-2"
			>
				{t('back_to_dashboard')}
			</a>
		</div>
	</div>
{/if}
