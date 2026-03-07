import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = ({ cookies }) => {
	const session = cookies.get('session');
	return {
		userEmail: session ? decodeURIComponent(session) : ''
	};
};
