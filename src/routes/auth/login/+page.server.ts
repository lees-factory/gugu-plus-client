import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { authApi } from '$lib/api/auth.server';
import { COOKIE_OPTS } from '$lib/api/config.server';

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();
		const email = String(data.get('email') ?? '');
		const password = String(data.get('password') ?? '');

		if (!email || !password) {
			return fail(400, { error: 'Email and password are required.', email });
		}

		const result = await authApi.login(email, password);

		if (result.error) {
			return fail(result.status, { error: result.error, email });
		}

		const payload = result.data?.data;
		const tokens = payload?.tokens;
		const user = payload?.user;
		if (tokens?.access_token) {
			cookies.set('access_token', tokens.access_token, COOKIE_OPTS);
		}
		if (tokens?.refresh_token) {
			cookies.set('refresh_token', tokens.refresh_token, COOKIE_OPTS);
		}
		cookies.set('session', encodeURIComponent(email), COOKIE_OPTS);
		if (user?.id) {
			cookies.set('user_id', user.id, COOKIE_OPTS);
		}

		redirect(303, '/');
	}
};
