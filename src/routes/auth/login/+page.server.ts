import { fail, redirect } from '@sveltejs/kit'
import type { Actions } from './$types'

const BACKEND = 'http://localhost:8080'
const COOKIE_OPTS = { path: '/', maxAge: 60 * 60 * 24 * 7, httpOnly: true, sameSite: 'lax' } as const

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData()
		const email = String(data.get('email') ?? '')
		const password = String(data.get('password') ?? '')

		if (!email || !password) {
			return fail(400, { error: 'Email and password are required.', email })
		}

		const res = await fetch(`${BACKEND}/v1/auth/login/email`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email, password })
		}).catch(() => null)

		if (!res) {
			return fail(503, { error: 'Cannot reach backend. Is the server running?', email })
		}

		const body = await res.json().catch(() => ({}))

		if (!res.ok) {
			return fail(res.status, { error: body.message ?? 'Invalid email or password.', email })
		}

		// JWT 저장 (access_token 키는 백엔드 응답 구조에 맞게)
		const token = body.access_token ?? body.token ?? body.accessToken
		if (token) {
			cookies.set('access_token', token, COOKIE_OPTS)
		}
		cookies.set('session', encodeURIComponent(email), COOKIE_OPTS)

		redirect(303, '/')
	}
}
