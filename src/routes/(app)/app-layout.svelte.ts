import type { Pathname } from '$app/types';
import { page } from '$app/state';
import { goto } from '$app/navigation';
import { resolve } from '$app/paths';
import { auth } from '$lib/stores/auth.svelte';
import { trackedItemsApi } from '$lib/api/tracked-items';
import { t } from '$lib/i18n/t';
import type { AddItemData } from '$lib/types';

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
		{ path: '/plan', label: t('nav_plan') },
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

	async function handleQuickAdd(itemData: AddItemData) {
		if (!itemData.commerce.ok) throw new Error('유효한 상품 URL이 아닙니다.');
		const res = await trackedItemsApi.create({
			original_url: itemData.commerce.original_url,
			provider_commerce: itemData.commerce.provider_commerce,
			external_product_id: itemData.commerce.external_product_id
		});
		if (res.error) throw new Error(res.error);
		// 추가 후 items 페이지로 이동 (이미 있으면 reload)
		await goto(resolve('/items'), { invalidateAll: true });
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
