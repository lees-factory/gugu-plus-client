import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import type { PriceAlertData } from '$lib/api/products';
import type { TrackedItemData } from '$lib/api/tracked-items';

export const load: PageLoad = async ({ fetch, parent }) => {
	const { userEmail } = await parent();
	if (!userEmail) {
		redirect(303, '/auth/login');
	}

	const [alertsRes, itemsRes] = await Promise.all([
		fetch('/api/v1/alerts'),
		fetch('/api/v1/tracked-items')
	]);

	const alertsJson = await alertsRes.json().catch(() => ({}));
	const itemsJson = await itemsRes.json().catch(() => ({}));

	return {
		alerts: (alertsRes.ok ? alertsJson?.data ?? [] : []) as PriceAlertData[],
		trackedItems: (itemsRes.ok ? itemsJson?.data?.items ?? [] : []) as TrackedItemData[],
		error: !alertsRes.ok ? (alertsJson?.error?.message ?? 'alerts_load_fail') : null as string | null
	};
};
