<script lang="ts">
	let { children } = $props();
</script>

<div class="flex min-h-svh items-center justify-center bg-zinc-50 p-4">
	<div class="w-full max-w-sm">
		<div class="mb-8 flex items-center justify-center gap-2.5">
			<div class="flex size-8 items-center justify-center rounded-lg bg-zinc-900">
				<svg
					viewBox="0 0 24 24"
					fill="currentColor"
					class="size-4 text-white"
					aria-hidden="true"
				>
					<path
						fill-rule="evenodd"
						d="M14.615 1.595a.75.75 0 0 1 .359.852L12.982 9.75h7.268a.75.75 0 0 1 .548 1.262l-10.5 11.25a.75.75 0 0 1-1.272-.71l1.992-7.302H3.75a.75.75 0 0 1-.548-1.262l10.5-11.25a.75.75 0 0 1 .913-.143Z"
						clip-rule="evenodd"
					/>
				</svg>
			</div>
			<span class="text-lg font-semibold tracking-tight text-zinc-900">Gugu Plus</span>
		</div>
		{@render children()}
	</div>
</div>
