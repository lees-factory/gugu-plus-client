import { alertsApi, productsApi, type PriceAlertData } from '$lib/api/products';
import type { TrackedItemData } from '$lib/api/tracked-items';
import { getCachedTrackedItems } from '$lib/api/tracked-items-cache';

export function createAlertsPage() {
	let alerts = $state<PriceAlertData[]>([]);
	let loading = $state(true);
	let error = $state('');
	let removingId = $state('');
	let productMap = $state<Map<string, TrackedItemData>>(new Map());

	async function load() {
		try {
			const [alertsRes, items] = await Promise.all([
				alertsApi.list(),
				getCachedTrackedItems()
			]);

			if (alertsRes.error) {
				error = alertsRes.error;
				alerts = [];
			} else {
				alerts = alertsRes.data?.data ?? [];
			}

			const map = new Map<string, TrackedItemData>();
			for (const item of items) {
				map.set(item.product_id, item);
			}
			productMap = map;
		} catch {
			error = '알림 목록을 불러오지 못했습니다.';
			alerts = [];
		} finally {
			loading = false;
		}
	}

	async function removeAlert(alert: PriceAlertData) {
		removingId = alert.id;
		try {
			const res = await productsApi.unregisterAlert(alert.product_id);
			if (!res.error) {
				alerts = alerts.filter((a) => a.id !== alert.id);
			} else {
				error = res.error;
			}
		} catch {
			error = '알림 해제에 실패했습니다.';
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
		load,
		removeAlert
	};
}
