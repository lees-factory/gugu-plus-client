import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = ({ cookies }) => {
	const session = cookies.get('session');
	if (!session) {
		return { userEmail: null, userId: null };
	}
	return {
		userEmail: decodeURIComponent(session),
		userId: cookies.get('user_id') ?? null
	};
};
