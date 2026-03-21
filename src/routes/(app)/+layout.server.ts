import { redirect } from '@sveltejs/kit'
import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = ({ cookies }) => {
	const session = cookies.get('session')
	if (!session) {
		redirect(303, '/auth/login')
	}
	return {
		userEmail: decodeURIComponent(session),
		userId: cookies.get('user_id') ?? null
	}
}
