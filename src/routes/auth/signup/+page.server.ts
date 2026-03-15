import { fail, redirect } from '@sveltejs/kit'
import type { Actions } from './$types'

const BACKEND = 'http://localhost:8080'

export const actions: Actions = {
	default: async ({ request }) => {
		const data = await request.formData()
		const email = String(data.get('email') ?? '')
		const password = String(data.get('password') ?? '')
		const display_name = String(data.get('display_name') ?? '') || email.split('@')[0]

		if (!email || !password) {
			return fail(400, { error: 'Email and password are required.', email, display_name })
		}

		const res = await fetch(`${BACKEND}/v1/auth/register/email`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email, password, display_name })
		}).catch(() => null)

		if (!res) {
			return fail(503, { error: 'Cannot reach backend. Is the server running?', email, display_name })
		}

		const body = await res.json().catch(() => ({}))

		if (!res.ok) {
			return fail(res.status, { error: body.message ?? 'Registration failed.', email, display_name })
		}

		redirect(303, `/auth/verify?email=${encodeURIComponent(email)}`)
	}
}
