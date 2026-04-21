import { goto, invalidate } from '$app/navigation';
import { resolve } from '$app/paths';
import { auth } from '$lib/stores/auth.svelte';
import { trackedItemsApi, type TrackedItemData } from '$lib/api/tracked-items';
import { t } from '$lib/i18n/t';
import type { AddItemEntry, TrackedItem } from '$lib/types';
import { summaryToCard } from '$lib/tracked-items/map-summary';

export type SortKey = 'recent' | 'title';

export function createItemsPage(
	getData: () => {
		items: TrackedItemData[];
		hasMore: boolean;
		nextCursor?: string;
		error: string | null;
	}
) {
	const model = $state({
		modalOpen: false,
		items: [] as TrackedItem[],
		loading: true,
		listError: null as string | null,
		deletingId: null as string | null,
		isLoadingMore: false,
		hasMore: false,
		nextCursor: undefined as string | undefined,
		sentinel: undefined as HTMLElement | undefined
	});

	let searchQuery = $state('');
	let sortBy = $state<SortKey>('recent');

	// load 데이터가 바뀔 때마다 model 갱신
	$effect(() => {
		const data = getData();
		model.items = data.items.map(summaryToCard);
		model.listError = data.error;
		model.loading = false;
		model.hasMore = data.hasMore;
		model.nextCursor = data.nextCursor;
	});

	const displayedItems = $derived.by(() => {
		let list: TrackedItem[] = model.items;
		const q = searchQuery.trim().toLowerCase();
		if (q) {
			list = list.filter(
				(i) => i.title.toLowerCase().includes(q) || i.site.toLowerCase().includes(q)
			);
		}
		const sorted = [...list];
		if (sortBy === 'title') {
			sorted.sort((a, b) => a.title.localeCompare(b.title));
		}
		return sorted;
	});

	function setSortFromSelect(ev: Event) {
		const v = (ev.currentTarget as HTMLSelectElement).value;
		if (v === 'recent' || v === 'title') sortBy = v;
	}

	function handleAddClick() {
		if (!auth.user) {
			goto(resolve('/auth/login'));
			return;
		}
		model.modalOpen = true;
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

	let confirmDeleteId = $state<string | null>(null);

	function deleteItem(trackedItemId: string) {
		confirmDeleteId = trackedItemId;
	}

	function cancelDelete() {
		confirmDeleteId = null;
	}

	async function confirmDelete() {
		const trackedItemId = confirmDeleteId;
		if (!trackedItemId) return;
		confirmDeleteId = null;
		model.deletingId = trackedItemId;
		try {
			const res = await trackedItemsApi.deleteItem(trackedItemId);
			if (res.error) return;
			model.items = model.items.filter((i) => i.id !== trackedItemId);
			await invalidate('app:tracked-items');
		} finally {
			model.deletingId = null;
		}
	}

	// infinite scroll observer
	$effect(() => {
		if (!model.sentinel) return;
		let cooldown = false;
		const observer = new IntersectionObserver(
			(entries) => {
				if (!entries[0].isIntersecting || cooldown || model.isLoadingMore || !model.hasMore) return;
				cooldown = true;
				void loadMore().finally(() => {
					setTimeout(() => {
						cooldown = false;
					}, 80);
				});
			},
			{ root: null, rootMargin: '280px', threshold: 0 }
		);
		observer.observe(model.sentinel);
		return () => observer.disconnect();
	});

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
		get sortBy() {
			return sortBy;
		},
		set sortBy(v: SortKey) {
			sortBy = v;
		},
		get displayedItems() {
			return displayedItems;
		},
		setSortFromSelect,
		handleAddClick,
		get confirmDeleteId() {
			return confirmDeleteId;
		},
		handleAddItem,
		deleteItem,
		cancelDelete,
		confirmDelete,
		loadMore
	};
}
