import { goto, invalidate } from '$app/navigation';
import { resolve } from '$app/paths';
import { SvelteSet } from 'svelte/reactivity';
import { auth } from '$lib/stores/auth.svelte';
import { trackedItemsApi, type TrackedItemData } from '$lib/api/tracked-items';
import { t } from '$lib/i18n/t';
import type { AddItemEntry, TrackedItem } from '$lib/types';
import { summaryToCard } from '$lib/tracked-items/map-summary';

export type SortKey = 'recent' | 'title' | 'site' | 'price';

export const CHROME_EXTENSION_STORE_URL =
	'https://chromewebstore.google.com/detail/ldigkhkcbjmiingoclccjjcnbcgiooao?utm_source=item-share-cb';

export function createItemsPage(getData: () => {
	items: TrackedItemData[];
	hasMore: boolean;
	nextCursor?: string;
	error: string | null;
}) {
	const model = $state({
		modalOpen: false,
		items: [] as TrackedItem[],
		loading: true,
		listError: null as string | null,
		deletingId: null as string | null,
		isLoadingMore: false,
		hasMore: false,
		nextCursor: undefined as string | undefined
	});

	let searchQuery = $state('');
	let marketplace = $state('all');
	let sortBy = $state<SortKey>('recent');
	let filterOpen = $state(false);

	// load 데이터가 바뀔 때마다 model 갱신
	$effect(() => {
		const data = getData();
		model.items = data.items.map(summaryToCard);
		model.listError = data.error;
		model.loading = false;
		model.hasMore = data.hasMore;
		model.nextCursor = data.nextCursor;
	});

	const marketplaceSites = $derived.by(() => {
		return [...new SvelteSet(model.items.map((i) => i.site))].sort((a, b) => a.localeCompare(b));
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

	async function handleAddItem(entries: AddItemEntry[]) {
		const items = entries
			.map((e) => e.commerce)
			.filter((c): c is Extract<typeof c, { ok: true }> => c.ok)
			.map((c) => ({
				original_url: c.original_url,
				provider_commerce: c.provider_commerce,
				external_product_id: c.external_product_id
			}));

		if (items.length === 0) {
			throw new Error(t('no_valid_url'));
		}

		const createRes = await trackedItemsApi.create(items);

		if (createRes.error || !createRes.data) {
			throw new Error(createRes.error ?? t('item_add_fail'));
		}

		// load 함수 재실행 → model 자동 갱신
		await invalidate('app:tracked-items');
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
			// optimistic UI + load 재실행
			model.items = model.items.filter((i) => i.id !== trackedItemId);
			await invalidate('app:tracked-items');
		} finally {
			model.deletingId = null;
		}
	}

	async function loadMore() {
		if (model.isLoadingMore || !model.hasMore || !model.nextCursor) return;
		model.isLoadingMore = true;
		try {
			const res = await trackedItemsApi.list({ cursor: model.nextCursor, size: 20 });
			if (res.error || !res.data) {
				model.hasMore = false;
				return;
			}
			const page = res.data.data;
			model.items = [...model.items, ...page.items.map(summaryToCard)];
			model.hasMore = page.has_more;
			model.nextCursor = page.next_cursor;
		} finally {
			model.isLoadingMore = false;
		}
	}

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
		handleAddItem,
		deleteItem,
		loadMore
	};
}
