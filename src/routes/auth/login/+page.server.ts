import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

const BACKEND = 'http://localhost:8080';
const COOKIE_OPTS = {
	path: '/',
	maxAge: 60 * 60 * 24 * 7,
	httpOnly: true,
	sameSite: 'lax'
} as const;

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();
		const email = String(data.get('email') ?? '');
		const password = String(data.get('password') ?? '');

		if (!email || !password) {
			return fail(400, { error: 'Email and password are required.', email });
		}

		const res = await fetch(`${BACKEND}/v1/auth/login/email`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email, password })
		}).catch(() => null);

		if (!res) {
			return fail(503, { error: 'Cannot reach backend. Is the server running?', email });
		}

		const body = await res.json().catch(() => ({}));
		console.log('🚀 ~ body:', body);

		if (!res.ok) {
			return fail(res.status, {
				error: body.error?.message ?? 'Invalid email or password.',
				email
			});
		}

		// 스펙: { result, data: { user, tokens: { access_token, refresh_token, ... } } }
		const tokens = body.data?.tokens;
		if (tokens?.access_token) {
			cookies.set('access_token', tokens.access_token, COOKIE_OPTS);
		}
		if (tokens?.refresh_token) {
			cookies.set('refresh_token', tokens.refresh_token, COOKIE_OPTS);
		}
		cookies.set('session', encodeURIComponent(email), COOKIE_OPTS);

		redirect(303, '/');
	}
};
