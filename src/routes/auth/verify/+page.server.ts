import { fail, redirect } from '@sveltejs/kit'
import type { Actions } from './$types'

const BACKEND = 'http://localhost:8080'

export const actions: Actions = {
	verify: async ({ request }) => {
		const data = await request.formData()
		const code = String(data.get('code') ?? '')
		const email = String(data.get('email') ?? '')

		if (!code) {
			return fail(400, { error: 'Verification code is required.', email })
		}

		const res = await fetch(`${BACKEND}/v1/auth/verify-email`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ code })
		}).catch(() => null)

		if (!res) {
			return fail(503, { error: 'Cannot reach backend. Is the server running.', email })
		}

		const body = await res.json().catch(() => ({}))

		if (!res.ok) {
			return fail(res.status, { error: body.error?.message ?? 'Invalid code. Please try again.', email })
		}

		// 스펙: verify-email 응답은 user만 반환, 토큰 없음 → 로그인 페이지로 이동
		redirect(303, `/auth/login?verified=1&email=${encodeURIComponent(email)}`)
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
