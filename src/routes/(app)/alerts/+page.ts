import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent }) => {
	const { userEmail } = await parent();

	return {
		userEmail,
		alerts: [] as never[],
		trackedItems: [] as never[],
		error: null as string | null
	};
};
