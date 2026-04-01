import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import type { TrackedItemData } from '$lib/api/tracked-items';

export const load: PageLoad = async ({ fetch, parent }) => {
	const { userEmail } = await parent();
	if (!userEmail) {
		redirect(303, '/auth/login');
	}

	const res = await fetch('/api/v1/tracked-items?size=20');
	const json = await res.json().catch(() => ({}));

	if (!res.ok) {
		return {
			items: [] as TrackedItemData[],
			hasMore: false,
			nextCursor: undefined as string | undefined,
			error: json?.error?.message ?? 'list_load_fail'
		};
	}

	const page = json?.data ?? {};
	return {
		items: (page.items ?? []) as TrackedItemData[],
		hasMore: page.has_more ?? false,
		nextCursor: page.next_cursor as string | undefined,
		error: null as string | null
	};
};
