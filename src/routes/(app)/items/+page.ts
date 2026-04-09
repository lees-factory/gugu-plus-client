import type { PageLoad } from './$types';
import type { TrackedItemData } from '$lib/api/tracked-items';
import { ENDPOINTS } from '$lib/api/endpoints';

export const load: PageLoad = async ({ fetch, parent, depends }) => {
	const { userEmail } = await parent();

	if (!userEmail) {
		return {
			userEmail: null,
			items: [] as TrackedItemData[],
			hasMore: false,
			nextCursor: undefined as string | undefined,
			error: null as string | null
		};
	}

	depends('app:tracked-items');

	const res = await fetch(`${ENDPOINTS.trackedItems.list}?size=20`);
	const json = await res.json().catch(() => ({}));

	if (!res.ok) {
		return {
			userEmail,
			items: [] as TrackedItemData[],
			hasMore: false,
			nextCursor: undefined as string | undefined,
			error: json?.error?.message ?? 'list_load_fail'
		};
	}

	const page = json?.data ?? {};
	return {
		userEmail,
		items: (page.items ?? []) as TrackedItemData[],
		hasMore: page.has_more ?? false,
		nextCursor: page.next_cursor as string | undefined,
		error: null as string | null
	};
};
