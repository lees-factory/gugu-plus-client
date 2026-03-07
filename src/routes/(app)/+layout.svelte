<script lang="ts">
	import { page } from '$app/state';
	import { setContext } from 'svelte';
	import { auth } from '$lib/stores/auth.svelte';
	import AppSidebar from '$lib/components/AppSidebar.svelte';

	let { data, children } = $props();
	let collapsed = $state(false);
	let mobileOpen = $state(false);

	$effect(() => {
		if (data.userEmail && !auth.user) {
			auth.initialize(data.userEmail);
		}
	});

	$effect(() => {
		page.url.pathname;
		mobileOpen = false;
	});

	function toggleSidebar() {
		if (window.matchMedia('(min-width: 768px)').matches) {
			collapsed = !collapsed;
		} else {
			mobileOpen = !mobileOpen;
		}
	}

	setContext('toggleSidebar', toggleSidebar);
</script>

<div class="flex h-svh overflow-hidden bg-zinc-50">
	<AppSidebar {collapsed} {mobileOpen} onClose={() => (mobileOpen = false)} />

	{#if mobileOpen}
		<div
			class="fixed inset-0 z-30 bg-black/40 md:hidden"
			role="presentation"
			onclick={() => (mobileOpen = false)}
		></div>
	{/if}

	<div
		class="flex flex-1 flex-col overflow-hidden transition-all duration-200 {collapsed
			? 'md:ml-16'
			: 'md:ml-64'}"
	>
		<main class="flex-1 overflow-y-auto">
			{@render children()}
		</main>
	</div>
</div>
