<script lang="ts">
	import { page } from '$app/state';
	import { deLocalizeHref, localizeHref } from '$lib/paraglide/runtime.js';
	import { auth } from '$lib/stores/auth.svelte';
	import { t } from '$lib/i18n/t';
	import LocaleToggle from '$lib/components/LocaleToggle.svelte';

	let {
		collapsed,
		mobileOpen,
		onClose
	}: { collapsed: boolean; mobileOpen: boolean; onClose: () => void } = $props();

	let userMenuOpen = $state(false);

	// 페이지 이동 시 유저 메뉴 닫기
	$effect(() => {
		page.url.pathname;
		userMenuOpen = false;
	});

	const navItems = $derived([
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

	function logout() {
		auth.logout();
		window.location.href = '/auth/logout';
	}

	const itemCount = $derived(0);
	const usagePercent = $derived((itemCount / auth.plan.maxItems) * 100);
</script>

{#if userMenuOpen}
	<div class="fixed inset-0 z-30" role="presentation" onclick={() => (userMenuOpen = false)}></div>
{/if}

<aside
	class="fixed inset-y-0 left-0 z-40 flex w-72 flex-col bg-white transition-all
		duration-200 {mobileOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
		{collapsed ? 'md:w-16' : 'md:w-64'}"
	style="border-right: 1px solid rgba(45, 45, 42, 0.06);"
>
	<!-- Header -->
	<div
		class="flex h-20 shrink-0 items-center px-5 {collapsed ? 'md:justify-center md:px-0' : ''}"
		style="border-bottom: 1px solid rgba(45, 45, 42, 0.06);"
	>
		<a
			href={localizeHref('/')}
			class="flex items-center gap-2.5 overflow-hidden {collapsed ? 'md:gap-0' : ''}"
			title={t('brand_name')}
		>
			<div
				class="flex size-9 shrink-0 items-center justify-center rounded-xl"
				style="background: linear-gradient(135deg, #5aad9c 0%, #4a9384 100%);"
			>
				<svg viewBox="0 0 24 24" fill="currentColor" class="size-5 text-white" aria-hidden="true">
					<path
						fill-rule="evenodd"
						d="M9 4.5a.75.75 0 0 1 .721.544l.813 2.846a3.75 3.75 0 0 0 2.576 2.576l2.846.813a.75.75 0 0 1 0 1.442l-2.846.813a3.75 3.75 0 0 0-2.576 2.576l-.813 2.846a.75.75 0 0 1-1.442 0l-.813-2.846a3.75 3.75 0 0 0-2.576-2.576l-2.846-.813a.75.75 0 0 1 0-1.442l2.846-.813A3.75 3.75 0 0 0 7.466 7.89l.813-2.846A.75.75 0 0 1 9 4.5Zm9-3a.75.75 0 0 1 .728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 0 1 0 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 0 1-1.456 0l-.258-1.036a3.375 3.375 0 0 0-1.91-1.91l-1.036-.258a.75.75 0 0 1 0-1.456l1.036-.258a3.375 3.375 0 0 0 1.91-1.91l.258-1.036A.75.75 0 0 1 18 1.5Z"
						clip-rule="evenodd"
					/>
				</svg>
			</div>
			{#if !collapsed}
				<span class="text-lg font-semibold whitespace-nowrap" style="color: #1a1a17;">
					{t('brand_name')}
				</span>
			{/if}
		</a>
	</div>

	<!-- Navigation -->
	<nav class="flex flex-1 flex-col gap-1.5 overflow-y-auto p-4">
		{#each navItems as item}
			<a
				href={item.href}
				title={item.label}
				class="group flex h-10 items-center rounded-xl text-sm font-medium transition-all
					{collapsed ? 'md:justify-center md:px-0' : 'gap-3 px-3.5'}
					{isActive(item.path) ? 'shadow-sm' : 'hover:shadow-sm'}"
				style="
					background-color: {isActive(item.path) ? '#f7f6f3' : 'transparent'};
					color: {isActive(item.path) ? '#1a1a17' : '#6b6b65'};
				"
			>
				<span class="shrink-0">
					{#if item.path === '/'}
						<!-- Home icon -->
						<svg
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							class="size-4"
							aria-hidden="true"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
							/>
						</svg>
					{:else if item.path === '/items'}
						<!-- Package / Tracked Items icon -->
						<svg
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							class="size-4"
							aria-hidden="true"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M20.25 7.5l-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
							/>
						</svg>
					{:else if item.path === '/plan'}
						<svg
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							class="size-4"
							aria-hidden="true"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z"
							/>
						</svg>
					{:else if item.path === '/settings'}
						<svg
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							class="size-4"
							aria-hidden="true"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"
							/>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
							/>
						</svg>
					{/if}
				</span>
				{#if !collapsed}
					<span class="whitespace-nowrap">{item.label}</span>
				{/if}
			</a>
		{/each}

		<div class="my-2 h-px" style="background-color: rgba(45, 45, 42, 0.06);"></div>

		<a
			href={localizeHref('/add')}
			title={t('nav_add_item')}
			class="flex h-10 items-center rounded-xl text-sm font-medium transition-all hover:shadow-sm
				{collapsed ? 'md:justify-center md:px-0' : 'gap-3 px-3.5'}"
			style="color: #1a1a17;"
		>
			<span class="shrink-0">
				<svg
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					class="size-4"
					aria-hidden="true"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
					/>
				</svg>
			</span>
			{#if !collapsed}
				<span class="whitespace-nowrap">{t('nav_add_item')}</span>
			{/if}
		</a>
	</nav>

	<!-- Footer -->
	<div class="shrink-0 space-y-4 p-5" style="border-top: 1px solid rgba(45, 45, 42, 0.06);">
		{#if auth.user}
			{#if !collapsed}
				<!-- Chrome Extension -->
				<div
					class="rounded-xl p-3.5"
					style="background-color: #f7f6f3; border: 1px solid rgba(45, 45, 42, 0.06);"
				>
					<div class="flex items-center gap-1.5 text-xs" style="color: #6b6b65;">
						<svg
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							class="size-3.5 shrink-0"
							aria-hidden="true"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418"
							/>
						</svg>
						<span class="font-medium" style="color: #1a1a17;">{t('sidebar_chrome_extension')}</span>
					</div>
					<p class="mt-1 text-xs" style="color: #6b6b65;">{t('sidebar_chrome_extension_desc')}</p>
				</div>

				<!-- Usage -->
				<div>
					<div class="mb-2.5 flex items-center justify-between text-sm">
						<span style="color: #6b6b65;">{t('sidebar_items_tracked')}</span>
						<span class="font-semibold" style="color: #1a1a17;"
							>{itemCount} / {auth.plan.maxItems}</span
						>
					</div>
					<div class="h-2 w-full rounded-full" style="background-color: #f4f3ef;">
						<div
							class="h-2 rounded-full transition-all duration-300"
							style="width: {usagePercent}%; background: linear-gradient(90deg, #5aad9c 0%, #4a9384 100%);"
						></div>
					</div>
				</div>

				<!-- Upgrade button -->
				<button
					type="button"
					class="flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all hover:shadow-md"
					style="background-color: #2d2d2a; color: #ffffff;"
				>
					{t('sidebar_upgrade_pro')}
				</button>
			{/if}

			<!-- User button -->
			<div class="relative">
				<button
					type="button"
					onclick={() => (userMenuOpen = !userMenuOpen)}
					class="flex w-full items-center rounded-xl p-2.5 text-left transition-colors hover:bg-[#f7f6f3]
						{collapsed ? 'md:justify-center' : 'gap-2.5'}"
					title={auth.user?.email ?? 'User'}
				>
					<div
						class="flex size-8 shrink-0 items-center justify-center rounded-full"
						style="background-color: #f7f6f3; color: #6b6b65;"
					>
						<svg
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="1.5"
							class="size-4"
							aria-hidden="true"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
							/>
						</svg>
					</div>
					{#if !collapsed}
						<div class="flex flex-1 flex-col overflow-hidden">
							<span class="truncate text-xs font-medium" style="color: #1a1a17;">
								{auth.user?.email?.split('@')[0] ?? 'User'}
							</span>
							<span class="truncate text-xs" style="color: #6b6b65;">{auth.user?.email ?? ''}</span>
						</div>
						<svg
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="1.5"
							class="size-3.5 shrink-0"
							style="color: #6b6b65;"
							aria-hidden="true"
						>
							<path stroke-linecap="round" stroke-linejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
						</svg>
					{/if}
				</button>

				{#if userMenuOpen}
					<div
						class="absolute bottom-full left-0 z-50 mb-1 w-52 rounded-xl bg-white py-1 shadow-lg"
						style="border: 1px solid rgba(45, 45, 42, 0.08);"
						role="menu"
					>
						<div class="px-3 py-2.5" style="border-bottom: 1px solid rgba(45, 45, 42, 0.06);">
							<p class="text-xs" style="color: #6b6b65;">
								{t('sidebar_plan_prefix')}
								<span class="font-medium capitalize" style="color: #1a1a17;">{auth.plan.type}</span>
							</p>
							{#if auth.plan.type === 'free'}
								<p class="mt-0.5 text-xs" style="color: #6b6b65;">{t('sidebar_upgrade_pro_price')}</p>
							{/if}
						</div>
						<a
							href={localizeHref('/settings')}
							onclick={() => (userMenuOpen = false)}
							class="flex w-full items-center gap-2 px-3 py-2 text-sm transition hover:bg-[#f7f6f3]"
							style="color: #1a1a17;"
							role="menuitem"
						>
							<svg
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="1.5"
								class="size-3.5"
								aria-hidden="true"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"
								/>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
								/>
							</svg>
							{t('nav_settings')}
						</a>
						<a
							href={localizeHref('/plan')}
							onclick={() => (userMenuOpen = false)}
							class="flex w-full items-center gap-2 px-3 py-2 text-sm transition hover:bg-[#f7f6f3]"
							style="color: #1a1a17;"
							role="menuitem"
						>
							<svg
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="1.5"
								class="size-3.5"
								aria-hidden="true"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z"
								/>
							</svg>
							{t('nav_plan')}
						</a>
						<div class="my-1 h-px" style="background-color: rgba(45, 45, 42, 0.06);"></div>
						<button
							type="button"
							onclick={logout}
							class="flex w-full items-center gap-2 px-3 py-2 text-sm transition hover:bg-[#fee8e8]"
							style="color: #d4183d;"
							role="menuitem"
						>
							<svg
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="1.5"
								class="size-3.5"
								aria-hidden="true"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
								/>
							</svg>
							{t('sidebar_log_out')}
						</button>
					</div>
				{/if}
			</div>
		{:else}
			<!-- 게스트: 로그인 버튼 -->
			<a
				href={localizeHref('/auth/login')}
				class="flex w-full items-center justify-center rounded-xl px-4 py-2.5 text-sm font-medium transition-all hover:shadow-md
					{collapsed ? 'md:px-0' : 'gap-2'}"
				style="background-color: #2d2d2a; color: #ffffff;"
				title={t('guest_login')}
			>
				<svg
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="1.5"
					class="size-4 shrink-0"
					aria-hidden="true"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"
					/>
				</svg>
				{#if !collapsed}
					<span>{t('guest_login')}</span>
				{/if}
			</a>
		{/if}
	</div>
</aside>
