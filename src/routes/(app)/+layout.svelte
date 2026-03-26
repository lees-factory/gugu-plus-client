<script lang="ts">
	import { onMount } from 'svelte';
	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import { setContext } from 'svelte';
	import { auth } from '$lib/stores/auth.svelte';
	import { hydratePreferencesFromStorage } from '$lib/stores/preferences.svelte';
	import { localizeHref, deLocalizeHref } from '$lib/paraglide/runtime.js';
	import { t } from '$lib/i18n/t';
	import AppSidebar from '$lib/components/AppSidebar.svelte';
	import AppFooter from '$lib/components/AppFooter.svelte';
	import AddItemModal from '$lib/components/AddItemModal.svelte';
	import { trackedItemsApi } from '$lib/api/tracked-items';

	let { data, children } = $props();
	let collapsed = $state(false);
	let mobileOpen = $state(false);
	let mainEl: HTMLElement | undefined = $state();

	onMount(() => {
		hydratePreferencesFromStorage();
	});

	afterNavigate(({ from, to, type }) => {
		if (type === 'popstate') return;
		if (from?.url.pathname === to?.url.pathname) return;
		mainEl?.scrollTo(0, 0);
	});

	$effect(() => {
		if (data.userEmail && !auth.user) {
			auth.initialize(data.userEmail, data.userId);
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

	const mobileNavItems = $derived([
		{ href: localizeHref('/'), path: '/', label: t('nav_home') },
		{ href: localizeHref('/items'), path: '/items', label: t('nav_tracked_items') },
		{ href: localizeHref('/plan'), path: '/plan', label: t('nav_plan') },
		{ href: localizeHref('/settings'), path: '/settings', label: t('nav_settings') }
	]);

	function isActive(path: string) {
		const base = deLocalizeHref(page.url.pathname);
		if (path === '/') return base === '/' || base === '';
		return base.startsWith(path);
	}

	const userInitial = $derived(auth.user?.email?.[0]?.toUpperCase() ?? '?');

	// Layout-level Quick Add
	let quickAddOpen = $state(false);
	let quickAddUrl = $state('');
	let searchValue = $state('');

	function openQuickAdd(url = '') {
		quickAddUrl = url;
		quickAddOpen = true;
		searchValue = '';
	}

	setContext('openQuickAdd', openQuickAdd);

	function handleSearchPaste(e: ClipboardEvent) {
		const text = e.clipboardData?.getData('text') ?? '';
		if (text.startsWith('http')) {
			e.preventDefault();
			openQuickAdd(text);
		}
	}

	function handleSearchKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' && searchValue.startsWith('http')) {
			openQuickAdd(searchValue);
		}
	}

	async function handleQuickAdd(data: import('$lib/types').AddItemData) {
		if (!data.commerce.ok) throw new Error('유효한 상품 URL이 아닙니다.');
		const res = await trackedItemsApi.create({
			original_url: data.commerce.original_url,
			provider_commerce: data.commerce.provider_commerce,
			external_product_id: data.commerce.external_product_id
		});
		if (res.error) throw new Error(res.error);
	}
</script>

<div class="flex h-svh overflow-hidden bg-[#F5F4F1]">
	<AppSidebar {collapsed} {mobileOpen} onClose={() => (mobileOpen = false)} />

	{#if mobileOpen}
		<div
			class="fixed inset-0 z-30 bg-zinc-900/30 backdrop-blur-sm md:hidden"
			role="presentation"
			onclick={() => (mobileOpen = false)}
		></div>
	{/if}

	<div
		class="flex min-w-0 flex-1 flex-col overflow-hidden transition-all duration-200 {collapsed
			? 'md:ml-16'
			: 'md:ml-[280px]'}"
	>
		<!-- Sticky glass header -->
		<header class="sticky top-0 z-10 border-b border-zinc-200/50 bg-white/70 backdrop-blur-2xl">
			<div class="flex h-20 items-center gap-4 px-4 sm:px-8">
				<button
					type="button"
					onclick={toggleSidebar}
					aria-label={t('aria_toggle_sidebar')}
					class="flex size-10 shrink-0 items-center justify-center rounded-2xl border border-zinc-200/60 p-2.5 text-zinc-600 transition-all duration-200 hover:bg-zinc-50"
				>
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="size-5" aria-hidden="true">
						<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
					</svg>
				</button>

				<!-- Search bar -->
				<div class="relative flex-1 max-w-2xl">
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="pointer-events-none absolute left-4 top-1/2 size-[18px] -translate-y-1/2 text-zinc-400" aria-hidden="true">
						<path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
					</svg>
					<input
						type="text"
						bind:value={searchValue}
						placeholder="상품 URL 붙여넣기, 브랜드 또는 카테고리 검색..."
						onpaste={handleSearchPaste}
						onkeydown={handleSearchKeydown}
						class="h-12 w-full rounded-2xl border border-zinc-200/60 bg-white/50 pl-11 pr-4 text-sm font-normal outline-none placeholder:text-zinc-400 transition-all duration-200 focus:border-stone-300 focus:bg-white focus:ring-4 focus:ring-stone-100/50"
					/>
				</div>

				<!-- Right actions -->
				<div class="hidden items-center gap-3 md:flex">
					{#if auth.user}
						<a
							href={localizeHref('/settings')}
							class="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-zinc-700 to-stone-800 text-sm font-semibold text-white shadow-md shadow-zinc-900/10 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
							title={auth.user.email ?? ''}
						>
							{userInitial}
						</a>
					{:else}
						<a
							href={localizeHref('/auth/login')}
							class="rounded-2xl border border-zinc-200/60 px-4 py-2 text-sm font-medium text-zinc-700 transition-all duration-200 hover:bg-zinc-50"
						>
							{t('guest_login')}
						</a>
					{/if}
				</div>
			</div>
		</header>

		<main bind:this={mainEl} class="flex-1 overflow-x-hidden overflow-y-auto pb-20 md:pb-0">
			{@render children()}
			<AppFooter />
		</main>
	</div>

	<!-- Mobile bottom nav -->
	<div class="fixed bottom-0 left-0 right-0 z-30 border-t border-zinc-200/50 bg-white/80 backdrop-blur-2xl md:hidden">
		<div class="flex items-center justify-around px-2 py-2">
			{#each mobileNavItems as item}
				<a
					href={item.href}
					class="flex min-w-[60px] flex-col items-center gap-1 rounded-xl px-3 py-2 transition-all duration-200
						{isActive(item.path) ? 'text-stone-800' : 'text-zinc-500'}"
				>
					{#if item.path === '/'}
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width={isActive(item.path) ? '2.5' : '2'} class="size-[18px]" aria-hidden="true">
							<path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
						</svg>
					{:else if item.path === '/items'}
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width={isActive(item.path) ? '2.5' : '2'} class="size-[18px]" aria-hidden="true">
							<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" stroke-linecap="round" stroke-linejoin="round" />
						</svg>
					{:else if item.path === '/plan'}
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width={isActive(item.path) ? '2.5' : '2'} class="size-[18px]" aria-hidden="true">
							<path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
						</svg>
					{:else if item.path === '/settings'}
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width={isActive(item.path) ? '2.5' : '2'} class="size-[18px]" aria-hidden="true">
							<path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
							<path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
						</svg>
					{/if}
					<span class="text-[10px] font-medium tracking-wide">{item.label}</span>
				</a>
			{/each}
		</div>
	</div>
</div>

<AddItemModal
	open={quickAddOpen}
	initialUrl={quickAddUrl}
	onClose={() => (quickAddOpen = false)}
	onAdd={handleQuickAdd}
/>
