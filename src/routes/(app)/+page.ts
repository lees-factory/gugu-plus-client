import type { PageLoad } from './$types';
import type { HotProductData } from '$lib/api/discover';
import type { TrackedItemData } from '$lib/api/tracked-items';

export const load: PageLoad = async ({ fetch }) => {
	const [discoverRes, itemsRes] = await Promise.all([
		fetch('/api/v1/discover/hot-products?page=1&size=20'),
		fetch('/api/v1/tracked-items').catch(() => null)
	]);

	const discoverJson = await discoverRes.json().catch(() => ({}));
	const itemsJson = itemsRes ? await itemsRes.json().catch(() => ({})) : {};

	return {
		hotProducts: (discoverRes.ok ? (discoverJson?.data ?? []) : []) as HotProductData[],
		trackedItems: (itemsRes?.ok ? (itemsJson?.data?.items ?? []) : []) as TrackedItemData[],
		error: !discoverRes.ok ? (discoverJson?.error?.message ?? null) : (null as string | null)
	};
};
