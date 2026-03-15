import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ fetch, url }) => {
	const response = await fetch(`${url.origin}/api/health`)
	const data = await response.json()
	return { health: data }
}
