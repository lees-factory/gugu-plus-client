import { type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { deLocalizeHref } from '$lib/paraglide/runtime.js';
import { paraglideMiddleware } from '$lib/paraglide/server.js';
import { ENDPOINTS } from '$lib/api/endpoints';
import { COOKIE_OPTS } from '$lib/api/config';
import type { AuthTokens } from '$lib/api/auth';

const handleParaglide: Handle = ({ event, resolve }) =>
	paraglideMiddleware(event.request, ({ request, locale }) => {
		event.request = request;

		return resolve(event, {
			transformPageChunk: ({ html }) => html.replace('%paraglide.lang%', locale)
		});
	});

const handleAuth: Handle = async ({ event, resolve }) => {
	const accessToken = event.cookies.get('access_token');
	const refreshToken = event.cookies.get('refresh_token');
	const pathname = deLocalizeHref(event.url.pathname);

	const isAuthRoute = pathname.startsWith('/auth');
	const isApiRoute = pathname.startsWith('/api');

	if (isAuthRoute || isApiRoute) {
		return resolve(event);
	}

	// access_token이 없고 refresh_token이 있으면 자동 갱신 시도
	if (!accessToken && refreshToken) {
		const res = await fetch(ENDPOINTS.auth.refresh, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ refresh_token: refreshToken })
		}).catch(() => null);

		if (!res || !res.ok) {
			// refresh 실패 → 쿠키 전체 삭제 (게스트 상태로 계속)
			event.cookies.delete('session', { path: '/' });
			event.cookies.delete('access_token', { path: '/' });
			event.cookies.delete('refresh_token', { path: '/' });
			event.cookies.delete('user_id', { path: '/' });
			return resolve(event);
		}

		const body = await res.json().catch(() => null);
		const tokens: AuthTokens | undefined = body?.data;
		if (tokens?.access_token) {
			event.cookies.set('access_token', tokens.access_token, COOKIE_OPTS);
		}
		if (tokens?.refresh_token) {
			event.cookies.set('refresh_token', tokens.refresh_token, COOKIE_OPTS);
		}
	}

	return resolve(event);
};

export const handle: Handle = sequence(handleParaglide, handleAuth);
