import { normalizeTrackedItemsList, trackedItemsApi } from '$lib/api/tracked-items';
import { t } from '$lib/i18n/t';
import type { TrackedItem, AddItemData } from '$lib/types';
import type { TrackedItemSummary } from '$lib/api/tracked-items';

function marketToSite(market: string): string {
	const map: Record<string, string> = {
		ALIEXPRESS: 'AliExpress',
		AMAZON: 'Amazon',
		EBAY: 'eBay',
		TAOBAO: 'Taobao'
	};
	return map[market] ?? market;
}

function summaryToCard(s: TrackedItemSummary): TrackedItem {
	return {
		id: s.tracked_item_id,
		productId: s.product_id ?? s.tracked_item_id,
		title: s.title,
		site: marketToSite(s.market),
		imageUrl: s.main_image_url
	};
}

export function createHomePageModel() {
	/**
	 * `$state` 객체를 그대로 노출해야 `{#each home.model.items}` 등이 갱신된다.
	 * 반환 객체의 getter만 쓰면 Svelte 5가 내부 배열 할당을 추적하지 못하는 경우가 있다.
	 */
	const model = $state({
		modalOpen: false,
		items: [] as TrackedItem[],
		loading: true,
		listError: null as string | null,
		deletingId: null as string | null
	});

	async function loadItems() {
		model.loading = true;
		model.listError = null;
		try {
			const listRes = await trackedItemsApi.list();
			if (listRes.error || !listRes.data) {
				model.listError = listRes.error ?? '목록을 불러오지 못했습니다.';
				model.items = [];
				return;
			}

			const body = listRes.data;
			const list = normalizeTrackedItemsList(body.data);
			model.items = list.map(summaryToCard);
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

		await loadItems();
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
		} finally {
			model.deletingId = null;
		}
	}

	return { model, loadItems, handleAddItem, deleteItem };
}
