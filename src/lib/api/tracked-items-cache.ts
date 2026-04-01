import { trackedItemsApi, type TrackedItemData } from './tracked-items';

const CACHE_TTL = 30_000;

let cache: { data: TrackedItemData[]; ts: number } | null = null;

export async function getCachedTrackedItems(force = false): Promise<TrackedItemData[]> {
	if (!force && cache && Date.now() - cache.ts < CACHE_TTL) {
		return cache.data;
	}

	const res = await trackedItemsApi.list();
	if (!res.error && res.data?.data) {
		cache = { data: res.data.data, ts: Date.now() };
		return cache.data;
	}

	return cache?.data ?? [];
}

export function invalidateTrackedItemsCache() {
	cache = null;
}

export function updateTrackedItemsCache(data: TrackedItemData[]) {
	cache = { data, ts: Date.now() };
}
