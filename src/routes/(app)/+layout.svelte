<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/stores';
	import { resolve } from '$app/paths';
	import AddItemModal from '$lib/components/AddItemModal.svelte';
	import AppFooter from '$lib/components/AppFooter.svelte';
	import AppSidebar from '$lib/components/AppSidebar.svelte';
	import SeoHead from '$lib/components/SeoHead.svelte';
	import { createPreferences } from '$lib/stores/preferences.svelte';
	import { getLocale, setLocale } from '$lib/paraglide/runtime.js';
	import { t } from '$lib/i18n/t';
	import { onMount, setContext, tick } from 'svelte';
	import { createLayoutModel } from './app-layout.svelte';

	let { data, children } = $props();

	/** 공개 페이지는 각 페이지에서 자체 SeoHead를 렌더링하므로 레이아웃 noindex를 건너뛴다. */
	const PUBLIC_PATHS = ['/discover', '/plan', '/terms', '/privacy'];
	const isPublicPage = $derived(PUBLIC_PATHS.includes($page.url.pathname));

	/** 비로그인 + (루트 or 공개 페이지) = 사이드바/헤더 숨김 */
	const isLanding = $derived(!data.userEmail && ($page.url.pathname === '/' || isPublicPage));

	const layout = createLayoutModel(() => data);
	const preferences = createPreferences();

	let userMenuOpen = $state(false);
	let localeModalOpen = $state(false);
	let localeModalEl: HTMLDivElement | undefined = $state();

	const currentLocale = $derived(getLocale());

	function selectLocale(locale: 'en' | 'ko') {
		if (getLocale() !== locale) setLocale(locale);
		localeModalOpen = false;
	}

	$effect(() => {
		if (localeModalOpen) {
			void tick().then(() => {
				localeModalEl?.querySelector<HTMLElement>('button')?.focus();
			});
		}
	});

	function handleLocaleModalKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			localeModalOpen = false;
			return;
		}
		if (e.key === 'Tab' && localeModalEl) {
			const focusable = localeModalEl.querySelectorAll<HTMLElement>(
				'button, a[href], [tabindex]:not([tabindex="-1"])'
			);
			if (focusable.length === 0) return;
			const first = focusable[0];
			const last = focusable[focusable.length - 1];
			if (e.shiftKey && document.activeElement === first) {
				e.preventDefault();
				last.focus();
			} else if (!e.shiftKey && document.activeElement === last) {
				e.preventDefault();
				first.focus();
			}
		}
	}

	let mainEl: HTMLElement | undefined = $state();

	onMount(() => {
		preferences.hydrate();
	});

	afterNavigate(({ from, to, type }) => {
		if (type === 'popstate') return;
		if (from?.url.pathname === to?.url.pathname) return;
		mainEl?.scrollTo(0, 0);
	});

	setContext('toggleSidebar', layout.toggleSidebar);
	setContext('openQuickAdd', layout.openQuickAdd);
</script>

{#if !isPublicPage && !isLanding}
	<SeoHead title="Price Eye" noindex={true} />
{/if}

{#if isLanding}
	<!-- Landing page: no sidebar, no header, no bottom nav -->
	<div class="min-h-svh bg-[#F5F4F1]">
		{@render children()}
	</div>
{:else}
	<div class="flex h-svh overflow-hidden bg-[#F5F4F1]">
		<AppSidebar
			collapsed={layout.model.collapsed}
			mobileOpen={layout.model.mobileOpen}
			onClose={() => (layout.model.mobileOpen = false)}
		/>

		{#if layout.model.mobileOpen}
			<div
				class="fixed inset-0 z-30 bg-zinc-900/30 backdrop-blur-sm md:hidden"
				role="presentation"
				onclick={() => (layout.model.mobileOpen = false)}
			></div>
		{/if}

		<div
			class="flex min-w-0 flex-1 flex-col overflow-hidden transition-all duration-200 {layout.model
				.collapsed
				? 'md:ml-16'
				: 'md:ml-[280px]'}"
		>
			<!-- Sticky glass header -->
			<header class="sticky top-0 z-10 border-b border-zinc-200/50 bg-[#F5F4F1]">
				<div class="flex h-20 items-center gap-4 px-4 sm:px-8">
					<button
						type="button"
						onclick={layout.toggleSidebar}
						aria-label={t('aria_toggle_sidebar')}
						class="flex size-10 shrink-0 items-center justify-center rounded-2xl border border-zinc-200/60 p-2.5 text-zinc-600 transition-all duration-200 hover:bg-zinc-50"
					>
						<svg
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							class="size-5"
							aria-hidden="true"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
							/>
						</svg>
					</button>

					<!-- Search bar -->
					<div class="relative max-w-2xl flex-1">
						<!-- 브라우저 자동완성 차단용 더미 -->
						<input
							type="text"
							name="fake-email"
							autocomplete="username"
							class="absolute size-0 opacity-0"
							tabindex="-1"
							aria-hidden="true"
						/>
						<input
							type="password"
							name="fake-pw"
							autocomplete="current-password"
							class="absolute size-0 opacity-0"
							tabindex="-1"
							aria-hidden="true"
						/>
						<svg
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							class="pointer-events-none absolute top-1/2 left-4 size-[18px] -translate-y-1/2 text-zinc-400"
							aria-hidden="true"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
							/>
						</svg>
						<input
							type="text"
							role="searchbox"
							bind:value={layout.model.searchValue}
							placeholder={t('search_placeholder')}
							autocomplete="off"
							data-1p-ignore
							data-lpignore="true"
							data-form-type="other"
							onpaste={layout.handleSearchPaste}
							onkeydown={layout.handleSearchKeydown}
							class="h-12 w-full rounded-2xl border border-zinc-200/60 bg-white/50 pr-4 pl-11 text-sm font-normal transition-all duration-200 outline-none placeholder:text-zinc-400 focus:border-stone-300 focus:bg-white focus:ring-4 focus:ring-stone-100/50"
						/>
					</div>

					<div class="flex-1"></div>

					<!-- Right actions -->
					<div class="flex shrink-0 items-center gap-3">
						<!-- Locale globe button -->
						<button
							type="button"
							onclick={() => (localeModalOpen = true)}
							title={t('locale_switch_label')}
							class="flex size-10 shrink-0 items-center justify-center rounded-2xl border border-zinc-200/60 text-zinc-500 transition-all duration-200 hover:bg-zinc-50 hover:text-zinc-900"
						>
							<svg
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="1.5"
								class="size-[18px]"
								aria-hidden="true"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5a17.92 17.92 0 0 1-8.716-2.247m0 0A8.966 8.966 0 0 1 3 12c0-1.264.26-2.467.732-3.558"
								/>
							</svg>
						</button>
					</div>
					<div class="flex shrink-0 items-center gap-3">
						{#if layout.userInitial !== '?'}
							<div class="relative">
								<button
									type="button"
									onclick={() => (userMenuOpen = !userMenuOpen)}
									class="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-zinc-700 to-stone-800 text-sm font-semibold text-white shadow-md shadow-zinc-900/10 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
								>
									{layout.userInitial}
								</button>

								{#if userMenuOpen}
									<!-- backdrop -->
									<div
										class="fixed inset-0 z-40"
										role="presentation"
										onclick={() => (userMenuOpen = false)}
									></div>
									<!-- dropdown -->
									<div
										class="absolute right-0 z-50 mt-2 w-48 overflow-hidden rounded-2xl border border-zinc-200/60 bg-white shadow-xl"
									>
										<a
											href={resolve('/settings')}
											onclick={() => (userMenuOpen = false)}
											class="flex items-center gap-3 px-4 py-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
										>
											<svg
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												stroke-width="1.5"
												class="size-4 text-zinc-400"
												aria-hidden="true"
											>
												<circle cx="12" cy="12" r="3" />
												<path
													d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"
												/>
											</svg>
											{t('nav_settings')}
										</a>
										<div style="border-top: 1px solid rgba(45,45,42,0.06);"></div>
										<a
											href={resolve('/auth/logout')}
											onclick={() => (userMenuOpen = false)}
											class="flex items-center gap-3 px-4 py-3 text-sm font-medium text-rose-600 transition hover:bg-rose-50"
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
													d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3-3h-12m12 0-3-3m3 3-3 3"
												/>
											</svg>
											{t('sidebar_log_out')}
										</a>
									</div>
								{/if}
							</div>
						{:else}
							<a
								href={resolve('/auth/login')}
								class="flex h-10 shrink-0 items-center rounded-2xl px-5 text-sm font-semibold text-white shadow-md shadow-zinc-900/10 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
								style="background: linear-gradient(to right, #292524, #3f3f46);"
							>
								{t('header_login')}
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
		<div
			class="fixed right-0 bottom-0 left-0 z-30 border-t border-zinc-200/50 bg-[#F5F4F1] md:hidden"
		>
			<div class="flex items-center justify-around px-2 py-2">
				{#each layout.mobileNavItems as item (item.path)}
					<a
						href={resolve(item.path)}
						class="flex min-w-[60px] flex-col items-center gap-1 rounded-xl px-3 py-2 transition-all duration-200
						{layout.isActive(item.path) ? 'text-stone-800' : 'text-zinc-500'}"
					>
						{#if item.path === '/discover'}
							<svg
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width={layout.isActive(item.path) ? '2.5' : '2'}
								class="size-[18px]"
								aria-hidden="true"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
								/>
							</svg>
						{:else if item.path === '/items'}
							<svg
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width={layout.isActive(item.path) ? '2.5' : '2'}
								class="size-[18px]"
								aria-hidden="true"
							>
								<polygon
									points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
							</svg>
						{:else if item.path === '/alerts'}
							<svg
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width={layout.isActive(item.path) ? '2.5' : '2'}
								class="size-[18px]"
								aria-hidden="true"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
								/>
							</svg>
						{:else if item.path === '/settings'}
							<svg
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width={layout.isActive(item.path) ? '2.5' : '2'}
								class="size-[18px]"
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
						<span class="text-[10px] font-medium tracking-wide">{item.label}</span>
					</a>
				{/each}
			</div>
		</div>
	</div>

	<!-- Locale Modal -->
	{#if localeModalOpen}
		<div
			class="fixed inset-0 z-50 flex items-center justify-center p-4"
			style="background-color: rgba(0,0,0,0.4);"
			role="presentation"
			onclick={(e) => {
				if (e.target === e.currentTarget) localeModalOpen = false;
			}}
			onkeydown={handleLocaleModalKeydown}
		>
			<div
				bind:this={localeModalEl}
				role="dialog"
				aria-modal="true"
				class="w-full max-w-xs overflow-hidden rounded-3xl bg-white shadow-xl"
			>
				<div class="flex items-center justify-between border-b border-zinc-100 px-6 py-5">
					<h3 class="text-base font-semibold text-zinc-900">{t('locale_switch_label')}</h3>
					<button
						type="button"
						onclick={() => (localeModalOpen = false)}
						aria-label={t('aria_close')}
						class="flex size-8 items-center justify-center rounded-xl text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-900"
					>
						<svg
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							class="size-4"
							aria-hidden="true"
						>
							<path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
						</svg>
					</button>
				</div>
				<div class="p-2">
					<button
						type="button"
						onclick={() => selectLocale('ko')}
						class="flex w-full items-center justify-between rounded-xl px-4 py-3 text-left transition hover:bg-zinc-50"
						style="background-color: {currentLocale === 'ko' ? '#f5f5f4' : 'transparent'};"
					>
						<span class="text-sm font-medium text-zinc-900">한국어</span>
						{#if currentLocale === 'ko'}
							<svg
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2.5"
								class="size-4"
								style="color: #2d2d2a;"
								aria-hidden="true"
							>
								<path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
							</svg>
						{/if}
					</button>
					<button
						type="button"
						onclick={() => selectLocale('en')}
						class="flex w-full items-center justify-between rounded-xl px-4 py-3 text-left transition hover:bg-zinc-50"
						style="background-color: {currentLocale === 'en' ? '#f5f5f4' : 'transparent'};"
					>
						<span class="text-sm font-medium text-zinc-900">English</span>
						{#if currentLocale === 'en'}
							<svg
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2.5"
								class="size-4"
								style="color: #2d2d2a;"
								aria-hidden="true"
							>
								<path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
							</svg>
						{/if}
					</button>
				</div>
			</div>
		</div>
	{/if}

	<AddItemModal
		open={layout.model.quickAddOpen}
		initialUrl={layout.model.quickAddUrl}
		onClose={() => (layout.model.quickAddOpen = false)}
		onAdd={layout.handleQuickAdd}
	/>
{/if}
