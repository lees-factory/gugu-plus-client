import type { PageLoad } from './$types';
import type { HotProductData } from '$lib/api/discover';
import type { TrackedItemData } from '$lib/api/tracked-items';
import { ENDPOINTS } from '$lib/api/endpoints';
import { getLocale } from '$lib/paraglide/runtime.js';

export const load: PageLoad = async ({ fetch, depends, parent }) => {
	const { userEmail } = await parent();

	depends('app:tracked-items');
	const language = getLocale().toUpperCase();
	const [discoverRes, itemsRes] = await Promise.all([
		fetch(`${ENDPOINTS.discover.hotProducts}?page=1&size=20&language=${language}`),
		userEmail ? fetch(ENDPOINTS.trackedItems.list).catch(() => null) : Promise.resolve(null)
	]);

	const discoverJson = await discoverRes.json().catch(() => ({}));
	const itemsJson = itemsRes ? await itemsRes.json().catch(() => ({})) : {};

	return {
		userEmail,
		hotProducts: (discoverRes.ok ? (discoverJson?.data ?? []) : []) as HotProductData[],
		trackedItems: (itemsRes?.ok ? (itemsJson?.data?.items ?? []) : []) as TrackedItemData[],
		error: !discoverRes.ok ? (discoverJson?.error?.message ?? null) : (null as string | null)
	};
};
