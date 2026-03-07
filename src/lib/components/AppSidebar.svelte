<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { auth } from '$lib/stores/auth.svelte';

	let {
		collapsed,
		mobileOpen,
		onClose
	}: { collapsed: boolean; mobileOpen: boolean; onClose: () => void } = $props();

	let userMenuOpen = $state(false);

	const navItems = [
		{ label: 'Dashboard', href: '/' },
		{ label: 'Notifications', href: '/notifications' },
		{ label: 'Plan', href: '/plan' },
		{ label: 'Settings', href: '/settings' }
	] as const;

	function isActive(href: string) {
		if (href === '/') return page.url.pathname === '/';
		return page.url.pathname.startsWith(href);
	}

	function logout() {
		userMenuOpen = false;
		auth.logout();
		goto('/auth/login');
	}

	const itemCount = $derived(0);
	const usagePercent = $derived((itemCount / auth.plan.maxItems) * 100);

	// 데스크탑에서 collapsed일 때만 텍스트 숨김 (모바일 drawer는 항상 full)
	const textHidden = $derived(collapsed);
</script>

{#if userMenuOpen}
	<div class="fixed inset-0 z-30" role="presentation" onclick={() => (userMenuOpen = false)}></div>
{/if}

<aside
	class="fixed inset-y-0 left-0 z-40 flex flex-col border-r border-zinc-200 bg-white transition-all duration-200
		w-72 {mobileOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
		{collapsed ? 'md:w-16' : 'md:w-64'}"
>
	<!-- Header -->
	<div class="flex h-14 shrink-0 items-center border-b border-zinc-100 px-3">
		<a href="/" class="flex flex-1 items-center gap-2.5 overflow-hidden" title="Gugu Plus">
			<div class="flex size-7 shrink-0 items-center justify-center rounded-lg bg-zinc-900">
				<svg viewBox="0 0 24 24" fill="currentColor" class="size-3.5 text-white" aria-hidden="true">
					<path
						fill-rule="evenodd"
						d="M14.615 1.595a.75.75 0 0 1 .359.852L12.982 9.75h7.268a.75.75 0 0 1 .548 1.262l-10.5 11.25a.75.75 0 0 1-1.272-.71l1.992-7.302H3.75a.75.75 0 0 1-.548-1.262l10.5-11.25a.75.75 0 0 1 .913-.143Z"
						clip-rule="evenodd"
					/>
				</svg>
			</div>
			<span
				class="whitespace-nowrap text-base font-semibold tracking-tight text-zinc-900 transition-all duration-200
					{textHidden ? 'md:w-0 md:opacity-0' : 'opacity-100'}"
			>
				Gugu Plus
			</span>
		</a>
		<!-- 모바일 닫기 버튼 -->
		<button
			type="button"
			onclick={onClose}
			aria-label="사이드바 닫기"
			class="flex size-8 items-center justify-center rounded-md text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700 md:hidden"
		>
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="size-4" aria-hidden="true">
				<path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
			</svg>
		</button>
	</div>

	<!-- Navigation -->
	<nav class="flex flex-1 flex-col gap-0.5 overflow-y-auto p-3">
		{#each navItems as item}
			<a
				href={item.href}
				title={item.label}
				class="group flex h-9 items-center gap-2.5 rounded-md px-2 text-sm font-medium transition-colors
					{isActive(item.href)
					? 'bg-zinc-100 text-zinc-900'
					: 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900'}"
			>
				<span class="shrink-0">
					{#if item.href === '/'}
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="size-4" aria-hidden="true">
							<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
						</svg>
					{:else if item.href === '/notifications'}
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="size-4" aria-hidden="true">
							<path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
						</svg>
					{:else if item.href === '/plan'}
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="size-4" aria-hidden="true">
							<path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
						</svg>
					{:else if item.href === '/settings'}
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="size-4" aria-hidden="true">
							<path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
							<path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
						</svg>
					{/if}
				</span>
				<span
					class="whitespace-nowrap transition-all duration-200
						{textHidden ? 'md:w-0 md:opacity-0' : 'opacity-100'}"
				>
					{item.label}
				</span>
			</a>
		{/each}

		<div class="my-2 h-px bg-zinc-100"></div>

		<a
			href="/add"
			title="Add Item"
			class="flex h-9 items-center gap-2.5 rounded-md px-2 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-50"
		>
			<span class="shrink-0">
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="size-4" aria-hidden="true">
					<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
				</svg>
			</span>
			<span class="whitespace-nowrap transition-all duration-200 {textHidden ? 'md:w-0 md:opacity-0' : 'opacity-100'}">
				Add Item
			</span>
		</a>
	</nav>

	<!-- Footer -->
	<div class="shrink-0 border-t border-zinc-100 p-3">
		{#if !textHidden}
			<div class="mb-3 rounded-lg border border-zinc-100 bg-zinc-50 p-3">
				<div class="flex items-center gap-1.5 text-xs text-zinc-500">
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="size-3.5 shrink-0" aria-hidden="true">
						<path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
					</svg>
					<span>Chrome Extension</span>
				</div>
				<p class="mt-1 text-xs text-zinc-400">Add items instantly from any page.</p>
			</div>

			<div class="mb-3 flex flex-col gap-1.5">
				<div class="flex items-center justify-between text-xs">
					<span class="text-zinc-500">{itemCount} / {auth.plan.maxItems} items</span>
					<span class="font-medium capitalize text-zinc-700">{auth.plan.type}</span>
				</div>
				<div class="h-1.5 w-full overflow-hidden rounded-full bg-zinc-100">
					<div class="h-full rounded-full bg-zinc-900 transition-all duration-300" style="width: {usagePercent}%"></div>
				</div>
			</div>
		{/if}

		<!-- User button -->
		<div class="relative">
			<button
				type="button"
				onclick={() => (userMenuOpen = !userMenuOpen)}
				class="flex w-full items-center gap-2.5 rounded-lg p-2 text-left transition-colors hover:bg-zinc-50"
				title={auth.user?.email ?? 'User'}
			>
				<div class="flex size-7 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-zinc-600">
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="size-3.5" aria-hidden="true">
						<path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
					</svg>
				</div>
				{#if !textHidden}
					<div class="flex flex-1 flex-col overflow-hidden">
						<span class="truncate text-xs font-medium text-zinc-900">
							{auth.user?.email?.split('@')[0] ?? 'User'}
						</span>
						<span class="truncate text-xs text-zinc-400">{auth.user?.email ?? ''}</span>
					</div>
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="size-3.5 shrink-0 text-zinc-400" aria-hidden="true">
						<path stroke-linecap="round" stroke-linejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
					</svg>
				{/if}
			</button>

			{#if userMenuOpen}
				<div class="absolute bottom-full left-0 z-50 mb-1 w-52 rounded-lg border border-zinc-200 bg-white py-1 shadow-lg" role="menu">
					<div class="border-b border-zinc-100 px-3 py-2">
						<p class="text-xs text-zinc-500">
							Plan: <span class="font-medium capitalize text-zinc-900">{auth.plan.type}</span>
						</p>
						{#if auth.plan.type === 'free'}
							<p class="mt-0.5 text-xs text-zinc-400">Upgrade to Pro (₩6,900/month)</p>
						{/if}
					</div>
					<a href="/settings" onclick={() => (userMenuOpen = false)} class="flex w-full items-center gap-2 px-3 py-1.5 text-sm text-zinc-700 hover:bg-zinc-50" role="menuitem">
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="size-3.5" aria-hidden="true">
							<path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
							<path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
						</svg>
						Settings
					</a>
					<a href="/plan" onclick={() => (userMenuOpen = false)} class="flex w-full items-center gap-2 px-3 py-1.5 text-sm text-zinc-700 hover:bg-zinc-50" role="menuitem">
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="size-3.5" aria-hidden="true">
							<path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
						</svg>
						Plan
					</a>
					<div class="my-1 h-px bg-zinc-100"></div>
					<button type="button" onclick={logout} class="flex w-full items-center gap-2 px-3 py-1.5 text-sm text-red-500 hover:bg-red-50" role="menuitem">
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="size-3.5" aria-hidden="true">
							<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
						</svg>
						Log out
					</button>
				</div>
			{/if}
		</div>
	</div>
</aside>
