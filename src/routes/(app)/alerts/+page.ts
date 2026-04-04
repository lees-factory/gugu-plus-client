import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent }) => {
	const { userEmail } = await parent();
	if (!userEmail) {
		redirect(303, '/auth/login');
	}

	// 독립 알림 목록 API가 제거됨. 알림은 상품 상세에서 관리.
	return {
		alerts: [] as never[],
		trackedItems: [] as never[],
		error: null as string | null
	};
};
