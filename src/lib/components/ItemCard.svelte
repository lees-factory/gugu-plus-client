<script lang="ts">
	import type { TrackedItem } from '$lib/types';

	let { item }: { item: TrackedItem } = $props();

	let imgError = $state(false);

	const siteColors: Record<string, string> = {
		Amazon: 'bg-orange-50 text-orange-700',
		Taobao: 'bg-red-50 text-red-700',
		eBay: 'bg-blue-50 text-blue-700',
		AliExpress: 'bg-rose-50 text-rose-700',
		'1688': 'bg-amber-50 text-amber-700'
	};

	const siteBadgeClass = $derived(siteColors[item.site] ?? 'bg-zinc-100 text-zinc-600');
</script>

<a href="/items/{item.id}" class="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white px-3 py-3 transition hover:border-zinc-300 hover:shadow-sm sm:gap-4 sm:px-4">
	<!-- Image -->
	<div class="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-zinc-100 sm:size-14">
		{#if !imgError && item.imageUrl}
			<img
				src={item.imageUrl}
				alt={item.title}
				class="size-full object-cover"
				onerror={() => (imgError = true)}
			/>
		{:else}
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="size-5 text-zinc-300 sm:size-6" aria-hidden="true">
				<path stroke-linecap="round" stroke-linejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
			</svg>
		{/if}
	</div>

	<!-- Title & site -->
	<div class="min-w-0 flex-1">
		<p class="line-clamp-2 text-sm font-medium text-zinc-900">{item.title}</p>
		<div class="mt-1.5">
			<span class="rounded-md px-1.5 py-0.5 text-xs font-medium {siteBadgeClass}">
				{item.site}
			</span>
		</div>
	</div>

	<!-- Chevron -->
	<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="size-4 shrink-0 text-zinc-300" aria-hidden="true">
		<path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
	</svg>
</a>
