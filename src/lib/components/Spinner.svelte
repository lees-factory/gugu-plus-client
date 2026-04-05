<script lang="ts">
	let { size = 'md' }: { size?: 'sm' | 'md' | 'lg' } = $props();

	const sizeClass = $derived(size === 'sm' ? 'size-4' : size === 'lg' ? 'size-8' : 'size-6');
</script>

<svg class="{sizeClass} animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
	<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
	<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
	></path>
</svg>
