import { invalidate } from '$app/navigation';
import { SvelteMap } from 'svelte/reactivity';
import { productsApi, type PriceAlertData } from '$lib/api/products';
import type { TrackedItemData } from '$lib/api/tracked-items';
import { t } from '$lib/i18n/t';

type AlertsPageData = {
	alerts: PriceAlertData[];
	trackedItems: TrackedItemData[];
	error: string | null;
};

export function createAlertsPage(getData: () => AlertsPageData) {
	let removingId = $state('');
	let actionError = $state('');

	const alerts = $derived(getData().alerts);
	const error = $derived(getData().error ?? actionError);
	const loading = $derived(false); // load 함수가 SSR/CSR에서 처리하므로 항상 false

	const productMap = $derived.by(() => {
		const map = new SvelteMap<string, TrackedItemData>();
		for (const item of getData().trackedItems) {
			map.set(item.product_id, item);
		}
		return map;
	});

	async function removeAlert(alert: PriceAlertData) {
		removingId = alert.id;
		try {
			const res = await productsApi.unregisterAlert(alert.product_id);
			if (!res.error) {
				await invalidate('/api/v1/alerts');
			} else {
				actionError = res.error;
			}
		} catch {
			actionError = t('alert_dismiss_fail');
		} finally {
			removingId = '';
		}
	}

	return {
		get alerts() {
			return alerts;
		},
		get loading() {
			return loading;
		},
		get error() {
			return error;
		},
		get removingId() {
			return removingId;
		},
		get productMap() {
			return productMap;
		},
		removeAlert
	};
}
