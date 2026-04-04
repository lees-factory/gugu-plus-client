<script lang="ts">
	import SeoHead from '$lib/components/SeoHead.svelte';
	import { t } from '$lib/i18n/t';

	let { children } = $props();
</script>

<SeoHead title="Price Eye" noindex={true} />

<div class="flex min-h-svh items-center justify-center bg-[#F5F4F1] p-4">
	<div class="w-full max-w-sm">
		<a href="/" class="mb-10 flex items-center justify-center gap-3 no-underline">
			<div
				class="flex size-11 items-center justify-center rounded-2xl text-white shadow-lg shadow-zinc-900/10"
				style="background: linear-gradient(135deg, #3f3f46 0%, #1c1917 100%);"
			>
				<svg
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="size-5"
					aria-hidden="true"
				>
					<path
						d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14"
					/>
					<path d="m7.5 4.27 9 5.15" />
					<polyline points="3.29 7 12 12 20.71 7" />
					<line x1="12" x2="12" y1="22" y2="12" />
					<circle cx="18.5" cy="15.5" r="2.5" />
					<path d="M20.27 17.27 22 19" />
				</svg>
			</div>
			<div>
				<div class="text-xl leading-none font-semibold tracking-tight text-zinc-900">Price Eye</div>
				<div class="mt-1 text-[9px] font-medium tracking-wider text-zinc-400">
					{t('sidebar_tagline')}
				</div>
			</div>
		</a>
		{@render children()}
	</div>
</div>
