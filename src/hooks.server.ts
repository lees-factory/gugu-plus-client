import { redirect, type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { paraglideMiddleware } from '$lib/paraglide/server.js';

const handleParaglide: Handle = ({ event, resolve }) =>
	paraglideMiddleware(event.request, ({ request, locale }) => {
		event.request = request;

		return resolve(event, {
			transformPageChunk: ({ html }) => html.replace('%paraglide.lang%', locale)
		});
	});

const handleAuth: Handle = ({ event, resolve }) => {
	const session = event.cookies.get('session');
	const { pathname } = event.url;

	const isAuthRoute = pathname.startsWith('/auth');

	if (!session && !isAuthRoute) {
		redirect(303, '/auth/login');
	}

	return resolve(event);
};

export const handle: Handle = sequence(handleParaglide, handleAuth);
