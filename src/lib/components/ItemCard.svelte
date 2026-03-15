<script lang="ts">
	import type { TrackedItem } from '$lib/types';

	let { item }: { item: TrackedItem } = $props();

	let imgError = $state(false);

	const siteColors: Record<string, { bg: string; text: string }> = {
		Amazon: { bg: '#fef3e8', text: '#c97d32' },
		Taobao: { bg: '#fef0e8', text: '#c96332' },
		eBay: { bg: '#fef9e8', text: '#c9a832' },
		AliExpress: { bg: '#fee8e8', text: '#c93232' },
		'1688': { bg: '#fef5e8', text: '#c99532' }
	};

	const siteStyle = $derived(siteColors[item.site] ?? { bg: '#f7f6f3', text: '#6b6b65' });
</script>

<a
	href="/items/{item.id}"
	class="block rounded-2xl bg-white p-5 transition-all hover:shadow-lg sm:p-6"
	style="border: 1px solid rgba(45, 45, 42, 0.06);"
>
	<div class="flex gap-5">
		<!-- Image -->
		<div
			class="size-20 shrink-0 overflow-hidden rounded-xl sm:size-24"
			style="background-color: #f7f6f3;"
		>
			{#if !imgError && item.imageUrl}
				<img
					src={item.imageUrl}
					alt={item.title}
					class="size-full object-cover"
					onerror={() => (imgError = true)}
				/>
			{:else}
				<div class="flex size-full items-center justify-center">
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="size-7" style="color: #6b6b65; opacity: 0.4;" aria-hidden="true">
						<path stroke-linecap="round" stroke-linejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
					</svg>
				</div>
			{/if}
		</div>

		<!-- Content -->
		<div class="min-w-0 flex-1">
			<!-- Title & site badge -->
			<div class="flex items-start gap-3 mb-2">
				<h3 class="line-clamp-2 text-sm font-medium flex-1 sm:text-base" style="color: #1a1a17; line-height: 1.5;">
					{item.title}
				</h3>
				<span
					class="shrink-0 rounded-lg px-2.5 py-1 text-xs font-medium"
					style="background-color: {siteStyle.bg}; color: {siteStyle.text};"
				>
					{item.site}
				</span>
			</div>

			<!-- Chevron hint -->
			<div class="flex items-center gap-1.5 mt-3">
				<span class="text-xs" style="color: #6b6b65;">자세히 보기</span>
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="size-3.5" style="color: #6b6b65;" aria-hidden="true">
					<path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
				</svg>
			</div>
		</div>
	</div>
</a>
