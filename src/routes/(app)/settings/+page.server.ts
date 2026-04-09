import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ cookies }) => {
	const session = cookies.get('session');
	return { hasSession: !!session };
};
