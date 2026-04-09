import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent }) => {
	const { userEmail } = await parent();
	if (userEmail) {
		redirect(302, '/discover');
	}
	return {};
};
