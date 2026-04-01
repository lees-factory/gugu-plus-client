import type { Pathname } from '$app/types';
import { page } from '$app/state';
import { goto, invalidate } from '$app/navigation';
import { resolve } from '$app/paths';
import { auth } from '$lib/stores/auth.svelte';
import { trackedItemsApi } from '$lib/api/tracked-items';
import { t } from '$lib/i18n/t';
import type { AddItemEntry } from '$lib/types';

type LayoutData = { userEmail: string | null; userId: string | null };

export function createLayoutModel(getData: () => LayoutData) {
	const model = $state({
		collapsed: false,
		mobileOpen: false,
		quickAddOpen: false,
		quickAddUrl: '',
		searchValue: ''
	});

	$effect(() => {
		const data = getData();
		if (data.userEmail && !auth.user) {
			auth.initialize(data.userEmail, data.userId);
		}
	});

	$effect(() => {
		void page.url.pathname;
		model.mobileOpen = false;
	});

	const mobileNavItems: Array<{ path: Pathname; label: string }> = $derived([
		{ path: '/', label: t('nav_home') },
		{ path: '/items', label: t('nav_tracked_items') },
		{ path: '/alerts', label: t('alerts_title') },
		{ path: '/settings', label: t('nav_settings') }
	]);

	const userInitial = $derived(auth.user?.email?.[0]?.toUpperCase() ?? '?');

	function isActive(path: Pathname) {
		const base = page.url.pathname;
		if (path === '/') return base === '/';
		return base.startsWith(path);
	}

	function toggleSidebar() {
		if (window.matchMedia('(min-width: 768px)').matches) {
			model.collapsed = !model.collapsed;
		} else {
			model.mobileOpen = !model.mobileOpen;
		}
	}

	function openQuickAdd(url = '') {
		model.quickAddUrl = url;
		model.quickAddOpen = true;
		model.searchValue = '';
	}

	function handleSearchPaste(e: ClipboardEvent) {
		const text = e.clipboardData?.getData('text') ?? '';
		if (text.startsWith('http')) {
			e.preventDefault();
			openQuickAdd(text);
		}
	}

	function handleSearchKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' && model.searchValue.startsWith('http')) {
			openQuickAdd(model.searchValue);
		}
	}

	async function handleQuickAdd(entries: AddItemEntry[]) {
		const items = entries
			.map((e) => e.commerce)
			.filter((c): c is Extract<typeof c, { ok: true }> => c.ok)
			.map((c) => ({
				original_url: c.original_url,
				provider_commerce: c.provider_commerce,
				external_product_id: c.external_product_id
			}));
		if (items.length === 0) throw new Error(t('no_valid_url'));
		const res = await trackedItemsApi.create(items);
		if (res.error) throw new Error(res.error);
		await invalidate('app:tracked-items');
		await goto(resolve('/items'));
	}

	return {
		model,
		get mobileNavItems() {
			return mobileNavItems;
		},
		get userInitial() {
			return userInitial;
		},
		isActive,
		toggleSidebar,
		openQuickAdd,
		handleSearchPaste,
		handleSearchKeydown,
		handleQuickAdd
	};
}
