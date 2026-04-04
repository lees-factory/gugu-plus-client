import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { authApi } from '$lib/api/auth.server';

export const GET: RequestHandler = async ({ cookies }) => {
	const refreshToken = cookies.get('refresh_token');

	if (refreshToken) {
		// 백엔드 세션 폐기 (실패해도 로컬 쿠키는 삭제)
		await authApi.logout(refreshToken);
	}

	cookies.delete('session', { path: '/' });
	cookies.delete('access_token', { path: '/' });
	cookies.delete('refresh_token', { path: '/' });
	cookies.delete('user_id', { path: '/' });

	redirect(303, '/auth/login');
};
