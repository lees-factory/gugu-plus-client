import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { authApi } from '$lib/api/auth';

export const actions: Actions = {
	verify: async ({ request }) => {
		const data = await request.formData();
		const code = String(data.get('code') ?? '');
		const email = String(data.get('email') ?? '');

		if (!code) {
			return fail(400, { error: 'Verification code is required.', email });
		}

		const result = await authApi.verify(code);

		if (result.error) {
			return fail(result.status, { error: result.error, email });
		}

		// 스펙: verify-email 응답은 user만 반환, 토큰 없음 → 로그인 페이지로 이동
		redirect(303, `/auth/login?verified=1&email=${encodeURIComponent(email)}`);
	},

	resend: async ({ request }) => {
		const data = await request.formData();
		const email = String(data.get('email') ?? '');

		if (!email) return fail(400, { error: 'Email is required.' });

		await authApi.resendVerification(email);

		return { resent: true };
	}
};
