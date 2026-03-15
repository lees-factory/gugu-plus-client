import { fail, redirect } from '@sveltejs/kit'
import type { Actions } from './$types'

const BACKEND = 'http://localhost:8080'
const COOKIE_OPTS = { path: '/', maxAge: 60 * 60 * 24 * 7, httpOnly: true, sameSite: 'lax' } as const

export const actions: Actions = {
	verify: async ({ request, cookies }) => {
		const data = await request.formData()
		const token = String(data.get('token') ?? '')
		const email = String(data.get('email') ?? '')

		if (!token) {
			return fail(400, { error: 'Verification code is required.' })
		}

		const res = await fetch(`${BACKEND}/v1/auth/verify-email`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ token })
		}).catch(() => null)

		if (!res) {
			return fail(503, { error: 'Cannot reach backend. Is the server running?' })
		}

		const body = await res.json().catch(() => ({}))

		if (!res.ok) {
			return fail(res.status, { error: body.message ?? 'Invalid code. Please try again.' })
		}

		// 인증 후 자동 로그인
		const accessToken = body.access_token ?? body.token ?? body.accessToken
		if (accessToken) {
			cookies.set('access_token', accessToken, COOKIE_OPTS)
		}
		if (email) {
			cookies.set('session', encodeURIComponent(email), COOKIE_OPTS)
		}

		redirect(303, '/')
	},

	resend: async ({ request }) => {
		const data = await request.formData()
		const email = String(data.get('email') ?? '')

		if (!email) return fail(400, { error: 'Email is required.' })

		// 백엔드에 재발송 요청 (register 재호출로 verification 재발송)
		await fetch(`${BACKEND}/v1/auth/register/email`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email, password: '', display_name: email.split('@')[0] })
		}).catch(() => null)

		return { resent: true }
	}
}
