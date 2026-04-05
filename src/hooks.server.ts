import { type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { deLocalizeHref } from '$lib/paraglide/runtime.js';
import { paraglideMiddleware } from '$lib/paraglide/server.js';
import { API_BASE, COOKIE_OPTS } from '$lib/api/config.server';
import type { AuthTokens } from '$lib/api/auth';

const handleParaglide: Handle = ({ event, resolve }) =>
	paraglideMiddleware(event.request, ({ request, locale }) => {
		event.request = request;

		return resolve(event, {
			transformPageChunk: ({ html }) => html.replace('%paraglide.lang%', locale)
		});
	});

/**
 * JWT의 exp 클레임을 디코딩하여 만료까지 남은 초를 반환한다.
 * 파싱 실패 시 0 (만료된 것으로 간주).
 */
function getTokenRemainingSeconds(token: string): number {
	try {
		const payload = token.split('.')[1];
		const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
		const exp = decoded.exp as number;
		if (!exp) return 0;
		return exp - Math.floor(Date.now() / 1000);
	} catch {
		return 0;
	}
}

const handleAuth: Handle = async ({ event, resolve }) => {
	const accessToken = event.cookies.get('access_token');
	const refreshToken = event.cookies.get('refresh_token');
	const pathname = deLocalizeHref(event.url.pathname);

	const isAuthRoute = pathname.startsWith('/auth');
	const isApiRoute = pathname.startsWith('/api');

	if (isAuthRoute || isApiRoute) {
		return resolve(event);
	}

	// access_token이 없거나 만료 임박(60초 이내)이면 갱신 시도
	const needsRefresh = refreshToken && (!accessToken || getTokenRemainingSeconds(accessToken) < 60);

	if (needsRefresh) {
		const res = await fetch(`${API_BASE}/v1/auth/refresh`, {
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

/** 보안 헤더 추가 */
const handleSecurityHeaders: Handle = async ({ event, resolve }) => {
	const response = await resolve(event);

	response.headers.set('X-Frame-Options', 'DENY');
	response.headers.set('X-Content-Type-Options', 'nosniff');
	response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
	response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
	response.headers.set(
		'Content-Security-Policy',
		"default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com https://*.firebaseapp.com https://www.gstatic.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://*.googleapis.com https://*.firebaseio.com https://*.firebaseapp.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://www.gstatic.com; font-src 'self' data:; frame-src https://accounts.google.com https://*.firebaseapp.com;"
	);
	response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

	return response;
};

export const handle: Handle = sequence(handleParaglide, handleAuth, handleSecurityHeaders);
