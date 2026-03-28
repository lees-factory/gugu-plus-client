import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import type { TrackedItemDetailData } from '$lib/api/tracked-items';

export const load: PageLoad = async ({ fetch, params, parent }) => {
	const { userEmail } = await parent();
	if (!userEmail) {
		redirect(303, '/auth/login');
	}

	const id = params.id;
	if (!id) {
		return {
			trackedItem: null as TrackedItemDetailData | null,
			error: '상품 ID가 없습니다.'
		};
	}

	const res = await fetch(`/api/v1/tracked-items/${encodeURIComponent(id)}`);
	const json = (await res.json().catch(() => ({}))) as Record<string, unknown>;

	if (!res.ok) {
		const err = json?.error as { message?: string } | string | undefined;
		const msg =
			typeof err === 'object' && err?.message != null
				? String(err.message)
				: typeof err === 'string'
					? err
					: '상품을 불러오지 못했습니다.';
		return { trackedItem: null, error: msg };
	}

	const payload = json?.data;
	if (!payload || typeof payload !== 'object') {
		return { trackedItem: null, error: '응답 형식이 올바르지 않습니다.' };
	}

	return {
		trackedItem: payload as TrackedItemDetailData,
		error: null as string | null
	};
};
