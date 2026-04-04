import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { authApi } from '$lib/api/auth.server';

export const actions: Actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const email = String(data.get('email') ?? '');
		const password = String(data.get('password') ?? '');
		const display_name = String(data.get('display_name') ?? '') || email.split('@')[0];

		if (!email || !password) {
			return fail(400, { error: 'Email and password are required.', email, display_name });
		}

		const result = await authApi.register(email, password, display_name);

		if (result.error) {
			return fail(result.status, { error: result.error, email, display_name });
		}

		redirect(303, `/auth/verify?email=${encodeURIComponent(email)}`);
	}
};
