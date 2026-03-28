import { goto } from '$app/navigation';
import { resolve } from '$app/paths';
import { auth } from '$lib/stores/auth.svelte';
import { normalizeTrackedItemsList, trackedItemsApi } from '$lib/api/tracked-items';
import { t } from '$lib/i18n/t';
import type { AddItemData, TrackedItem } from '$lib/types';
import { summaryToCard } from '$lib/tracked-items/map-summary';

export type SortKey = 'recent' | 'title' | 'site' | 'price';

export const CHROME_EXTENSION_STORE_URL =
	'https://chromewebstore.google.com/detail/ldigkhkcbjmiingoclccjjcnbcgiooao?utm_source=item-share-cb';

/** 모듈 레벨 캐시 — 추가/삭제/새로고침 시에만 갱신 */
let cachedItems: TrackedItem[] | null = null;

export function createItemsPage() {
	/**
	 * `$state` 객체를 그대로 노출해야 `{#each ... model.items}` 등이 갱신된다.
	 */
	const model = $state({
		modalOpen: false,
		items: [] as TrackedItem[],
		loading: true,
		listError: null as string | null,
		deletingId: null as string | null
	});

	let searchQuery = $state('');
	let marketplace = $state('all');
	let sortBy = $state<SortKey>('recent');
	let filterOpen = $state(false);

	const marketplaceSites = $derived.by(() => {
		const uniq: string[] = [];
		for (const i of model.items) {
			if (!uniq.includes(i.site)) uniq.push(i.site);
		}
		return uniq.sort((a, b) => a.localeCompare(b));
	});

	const displayedItems = $derived.by(() => {
		let list: TrackedItem[] = model.items;
		const q = searchQuery.trim().toLowerCase();
		if (q) {
			list = list.filter(
				(i) => i.title.toLowerCase().includes(q) || i.site.toLowerCase().includes(q)
			);
		}
		if (marketplace !== 'all') {
			list = list.filter((i) => i.site === marketplace);
		}
		const sorted = [...list];
		if (sortBy === 'title') {
			sorted.sort((a, b) => a.title.localeCompare(b.title));
		} else if (sortBy === 'site') {
			sorted.sort((a, b) => a.site.localeCompare(b.site) || a.title.localeCompare(b.title));
		} else if (sortBy === 'price') {
			sorted.sort((a, b) => {
				const pa = a.currentPrice;
				const pb = b.currentPrice;
				if (pa == null && pb == null) return 0;
				if (pa == null) return 1;
				if (pb == null) return -1;
				return pa - pb;
			});
		}
		return sorted;
	});

	function setSortFromSelect(ev: Event) {
		const v = (ev.currentTarget as HTMLSelectElement).value;
		if (v === 'recent' || v === 'title' || v === 'site' || v === 'price') sortBy = v;
	}

	function toggleFilterOpen() {
		filterOpen = !filterOpen;
	}

	function handleAddClick() {
		if (!auth.user) {
			goto(resolve('/auth/login'));
			return;
		}
		model.modalOpen = true;
	}

	function openChromeExtensionStore() {
		window.open(CHROME_EXTENSION_STORE_URL, '_blank');
	}

	async function loadItems(force = false) {
		if (!force && cachedItems) {
			model.items = cachedItems;
			model.loading = false;
			return;
		}

		model.loading = true;
		model.listError = null;
		try {
			const listRes = await trackedItemsApi.list();

			if (listRes.status === 401) {
				await goto(resolve('/auth/login'));
				return;
			}

			if (listRes.error || !listRes.data) {
				model.listError = listRes.error ?? '목록을 불러오지 못했습니다.';
				return;
			}

			const body = listRes.data;
			const list = normalizeTrackedItemsList(body.data);
			model.items = list.map(summaryToCard);
			cachedItems = model.items;
		} finally {
			model.loading = false;
		}
	}

	async function handleAddItem(data: AddItemData) {
		if (!data.commerce.ok) {
			throw new Error('유효한 상품 URL이 아닙니다.');
		}

		const createRes = await trackedItemsApi.create({
			original_url: data.commerce.original_url,
			provider_commerce: data.commerce.provider_commerce,
			external_product_id: data.commerce.external_product_id
		});

		if (createRes.error || !createRes.data) {
			throw new Error(createRes.error ?? '상품을 추가하지 못했습니다.');
		}

		if (!createRes.data.data) {
			throw new Error('서버 응답이 올바르지 않습니다.');
		}

		// 추가 성공 후 캐시 무효화 + 목록 재조회
		await loadItems(true);
	}

	async function deleteItem(trackedItemId: string) {
		if (!confirm(t('confirm_delete_track'))) return;
		model.deletingId = trackedItemId;
		try {
			const res = await trackedItemsApi.deleteItem(trackedItemId);
			if (res.error) {
				alert(res.error);
				return;
			}
			model.items = model.items.filter((i) => i.id !== trackedItemId);
			cachedItems = model.items;
		} finally {
			model.deletingId = null;
		}
	}

	let loaded = false;

	$effect(() => {
		if (auth.user && !loaded) {
			loaded = true;
			void loadItems();
		} else if (!auth.user) {
			model.loading = false;
		}
	});

	return {
		model,
		get searchQuery() {
			return searchQuery;
		},
		set searchQuery(v: string) {
			searchQuery = v;
		},
		get marketplace() {
			return marketplace;
		},
		set marketplace(v: string) {
			marketplace = v;
		},
		get sortBy() {
			return sortBy;
		},
		set sortBy(v: SortKey) {
			sortBy = v;
		},
		get filterOpen() {
			return filterOpen;
		},
		set filterOpen(v: boolean) {
			filterOpen = v;
		},
		get marketplaceSites() {
			return marketplaceSites;
		},
		get displayedItems() {
			return displayedItems;
		},
		setSortFromSelect,
		toggleFilterOpen,
		handleAddClick,
		openChromeExtensionStore,
		loadItems,
		handleAddItem,
		deleteItem
	};
}
