<script lang="ts">
	let { children } = $props();
</script>

<div class="flex min-h-svh items-center justify-center p-4" style="background-color: #fafaf8;">
	<div class="w-full max-w-sm">
		<div class="mb-8 flex items-center justify-center gap-2.5">
			<div
				class="flex size-10 items-center justify-center rounded-xl"
				style="background: linear-gradient(135deg, #5aad9c 0%, #4a9384 100%);"
			>
				<svg
					viewBox="0 0 24 24"
					fill="currentColor"
					class="size-5 text-white"
					aria-hidden="true"
				>
					<path
						fill-rule="evenodd"
						d="M9 4.5a.75.75 0 0 1 .721.544l.813 2.846a3.75 3.75 0 0 0 2.576 2.576l2.846.813a.75.75 0 0 1 0 1.442l-2.846.813a3.75 3.75 0 0 0-2.576 2.576l-.813 2.846a.75.75 0 0 1-1.442 0l-.813-2.846a3.75 3.75 0 0 0-2.576-2.576l-2.846-.813a.75.75 0 0 1 0-1.442l2.846-.813A3.75 3.75 0 0 0 7.466 7.89l.813-2.846A.75.75 0 0 1 9 4.5Zm9-3a.75.75 0 0 1 .728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 0 1 0 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 0 1-1.456 0l-.258-1.036a3.375 3.375 0 0 0-1.91-1.91l-1.036-.258a.75.75 0 0 1 0-1.456l1.036-.258a3.375 3.375 0 0 0 1.91-1.91l.258-1.036A.75.75 0 0 1 18 1.5Z"
						clip-rule="evenodd"
					/>
				</svg>
			</div>
			<span class="text-xl font-semibold" style="color: #1a1a17;">Gugu Plus</span>
		</div>
		{@render children()}
	</div>
</div>
