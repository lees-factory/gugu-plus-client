<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { auth } from '$lib/stores/auth.svelte';
	import { t } from '$lib/i18n/t';

	let {
		collapsed,
		mobileOpen,
		onClose
	}: { collapsed: boolean; mobileOpen: boolean; onClose: () => void } = $props();

	const navItems = $derived([
		{ path: '/' as const, label: t('nav_home') },
		{ path: '/items' as const, label: t('nav_tracked_items') },
		{ path: '/plan' as const, label: t('nav_plan') },
		{ path: '/settings' as const, label: t('nav_settings') }
	]);

	function isActive(path: string) {
		const base = page.url.pathname;
		if (path === '/') return base === '/' || base === '';
		return base.startsWith(path);
	}
</script>

<aside
	class="fixed inset-y-0 left-0 z-40 flex shrink-0 flex-col bg-[#FCFCFB] transition-all duration-200
		{mobileOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
		{collapsed ? 'md:w-16' : 'md:w-[280px]'} w-[280px]"
	style="border-right: 1px solid rgba(0, 0, 0, 0.06);"
>
	<!-- Logo -->
	<div
		class="flex h-16 shrink-0 items-center px-6 {collapsed ? 'md:justify-center md:px-0' : ''}"
		style="border-bottom: 1px solid rgba(0, 0, 0, 0.06);"
	>
		<a
			href={resolve('/')}
			onclick={onClose}
			class="flex items-center gap-3 overflow-hidden"
			title={t('brand_name')}
		>
			<div
				class="flex size-11 shrink-0 items-center justify-center rounded-2xl shadow-lg shadow-zinc-900/10 text-white"
				style="background: linear-gradient(135deg, #3f3f46 0%, #292524 50%, #1c1917 100%);"
			>
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-5" aria-hidden="true">
					<path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14" />
					<path d="m7.5 4.27 9 5.15" />
					<polyline points="3.29 7 12 12 20.71 7" />
					<line x1="12" x2="12" y1="22" y2="12" />
					<circle cx="18.5" cy="15.5" r="2.5" />
					<path d="M20.27 17.27 22 19" />
				</svg>
			</div>
			{#if !collapsed}
				<div class="overflow-hidden">
					<div class="text-xl font-semibold tracking-tight text-zinc-900 leading-none whitespace-nowrap">
						{t('brand_name')}
					</div>
					<div class="mt-1 text-[9px] font-medium tracking-wider text-zinc-400 whitespace-nowrap">
						Smart Price Companion
					</div>
				</div>
			{/if}
		</a>
	</div>

	<!-- Navigation -->
	<nav class="flex flex-1 flex-col gap-1 overflow-y-auto p-4">
		{#each navItems as item (item.path)}
			<a
				href={resolve(item.path)}
				onclick={onClose}
				title={item.label}
				class="group flex items-center rounded-2xl text-sm font-medium transition-all duration-200
					{collapsed ? 'md:justify-center md:px-0 md:py-3 gap-0' : 'gap-3.5 px-4 py-3'}
					{isActive(item.path)
						? 'bg-zinc-200/50 text-stone-800 shadow-sm'
						: 'text-zinc-600 hover:bg-zinc-100/50 hover:text-zinc-900'}"
			>
				<span class="shrink-0">
					{#if item.path === '/'}
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
							stroke-width={isActive(item.path) ? '2.5' : '2'}
							class="size-[18px] {isActive(item.path) ? 'text-stone-800' : 'text-zinc-400 group-hover:text-zinc-600'}"
							aria-hidden="true">
							<path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
						</svg>
					{:else if item.path === '/items'}
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
							stroke-width={isActive(item.path) ? '2.5' : '2'}
							class="size-[18px] {isActive(item.path) ? 'text-stone-800' : 'text-zinc-400 group-hover:text-zinc-600'}"
							aria-hidden="true">
							<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" stroke-linecap="round" stroke-linejoin="round" />
						</svg>
					{:else if item.path === '/plan'}
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
							stroke-width={isActive(item.path) ? '2.5' : '2'}
							class="size-[18px] {isActive(item.path) ? 'text-stone-800' : 'text-zinc-400 group-hover:text-zinc-600'}"
							aria-hidden="true">
							<path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
						</svg>
					{:else if item.path === '/settings'}
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
							stroke-width={isActive(item.path) ? '2.5' : '2'}
							class="size-[18px] {isActive(item.path) ? 'text-stone-800' : 'text-zinc-400 group-hover:text-zinc-600'}"
							aria-hidden="true">
							<path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
							<path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
						</svg>
					{/if}
				</span>
				{#if !collapsed}
					<span class="whitespace-nowrap">{item.label}</span>
				{/if}
			</a>
		{/each}
	</nav>

	<!-- Footer -->
	{#if !collapsed}
		<div class="shrink-0 space-y-3 p-4" style="border-top: 1px solid rgba(0, 0, 0, 0.06);">
			<!-- Add Product button -->
			<button
				type="button"
				onclick={() => { onClose(); }}
				class="flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-semibold text-white shadow-lg shadow-zinc-900/10 transition-all duration-300 hover:shadow-xl hover:shadow-zinc-900/15 hover:-translate-y-0.5"
				style="background: linear-gradient(to right, #292524, #3f3f46);"
			>
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="size-4" aria-hidden="true">
					<path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
				</svg>
				{t('nav_add_item')}
			</button>

			<!-- Pro Tip card -->
			<div class="rounded-2xl p-5 border border-amber-100/50" style="background: linear-gradient(135deg, #fffbeb 0%, #fff7ed 100%);">
				<div class="text-[9px] font-semibold uppercase tracking-wider" style="color: rgba(180, 83, 9, 0.7);">Pro Tip</div>
				<div class="mt-2.5 text-sm font-semibold leading-snug text-zinc-900">{t('sidebar_chrome_extension')}</div>
				<p class="mt-2 text-xs leading-relaxed text-zinc-600">{t('sidebar_chrome_extension_desc')}</p>
			</div>

			<!-- Plan info -->
			{#if auth.user}
				<div class="flex items-center justify-between rounded-xl px-3 py-2.5" style="background-color: #f5f5f4;">
					<div class="text-xs text-zinc-600">
						{t('sidebar_plan_prefix')}
						<span class="font-semibold capitalize text-zinc-900">{auth.plan.type}</span>
					</div>
					{#if auth.plan.type === 'free'}
						<a
							href={resolve('/plan')}
							class="text-xs font-semibold text-stone-700 transition hover:text-stone-900"
						>
							{t('sidebar_upgrade_pro')} →
						</a>
					{/if}
				</div>
			{/if}
		</div>
	{:else}
		<!-- Collapsed: just upgrade icon -->
		<div class="shrink-0 flex flex-col items-center gap-3 p-3" style="border-top: 1px solid rgba(0, 0, 0, 0.06);">
			<a
				href={resolve('/plan')}
				title={t('sidebar_upgrade_pro')}
				class="flex size-10 items-center justify-center rounded-2xl text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5"
				style="background: linear-gradient(135deg, #292524 0%, #3f3f46 100%);"
			>
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="size-4" aria-hidden="true">
					<path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
				</svg>
			</a>
		</div>
	{/if}
</aside>
