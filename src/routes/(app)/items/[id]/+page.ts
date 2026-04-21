import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import type { TrackedItemDetailData } from '$lib/api/tracked-items';
import { ENDPOINTS } from '$lib/api/endpoints';

export const load: PageLoad = async ({ fetch, params, parent }) => {
	const { userEmail } = await parent();
	if (!userEmail) {
		redirect(303, '/auth/login');
	}

	const id = params.id;
	if (!id) {
		return {
			trackedItem: null as TrackedItemDetailData | null,
			error: 'item_id_missing'
		};
	}

	const res = await fetch(ENDPOINTS.trackedItems.detail(id));
	const json = (await res.json().catch(() => ({}))) as Record<string, unknown>;

	if (!res.ok) {
		const err = json?.error as { message?: string } | string | undefined;
		const msg =
			typeof err === 'object' && err?.message != null
				? String(err.message)
				: typeof err === 'string'
					? err
					: 'item_lad_fail';
		return { trackedItem: null, error: msg };
	}

	const payload = json?.data;
	if (!payload || typeof payload !== 'object') {
		return { trackedItem: null, error: 'response_format_error' };
	}

	const trackedItem = payload as TrackedItemDetailData;

	return {
		trackedItem,
		error: null as string | null
	};
};
