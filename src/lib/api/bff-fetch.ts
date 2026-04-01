/**
 * BFF 프록시 전용 fetch 래퍼.
 * 백엔드가 401을 반환하면 refresh token으로 access_token을 갱신하고 1회 재시도한다.
 * 동시 요청의 race condition을 방지하기 위해 refresh를 한 번만 수행한다.
 */
import { API_BASE, COOKIE_OPTS } from './config';
import type { Cookies } from '@sveltejs/kit';
import type { AuthTokens } from './auth';

const refreshMap = new WeakMap<Cookies, Promise<AuthTokens | null>>();

async function doRefresh(refreshToken: string): Promise<AuthTokens | null> {
	const res = await fetch(`${API_BASE}/v1/auth/refresh`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ refresh_token: refreshToken })
	}).catch(() => null);

	if (!res || !res.ok) return null;

	const body = await res.json().catch(() => null);
	return (body?.data as AuthTokens) ?? null;
}

/**
 * refresh token으로 access_token 갱신.
 * 동시 호출 시 하나의 Promise를 공유하여 중복 refresh 방지.
 */
async function refreshAccessToken(cookies: Cookies): Promise<string | null> {
	const refreshToken = cookies.get('refresh_token');
	if (!refreshToken) return null;

	// 이미 진행 중인 refresh가 있으면 대기
	if (!refreshMap.has(cookies)) {
		refreshMap.set(cookies, doRefresh(refreshToken));
	}

	try {
		const tokens = await refreshMap.get(cookies)!;
		if (!tokens?.access_token) {
			// refresh 실패 → 세션 만료
			cookies.delete('session', { path: '/' });
			cookies.delete('access_token', { path: '/' });
			cookies.delete('refresh_token', { path: '/' });
			cookies.delete('user_id', { path: '/' });
			return null;
		}

		cookies.set('access_token', tokens.access_token, COOKIE_OPTS);
		if (tokens.refresh_token) {
			cookies.set('refresh_token', tokens.refresh_token, COOKIE_OPTS);
		}

		return tokens.access_token;
	} finally {
		refreshMap.delete(cookies);
	}
}

/**
 * BFF 프록시용 fetch.
 * 401 응답 시 자동으로 토큰 갱신 후 1회 재시도.
 */
export async function bffFetch(
	url: string,
	options: RequestInit,
	cookies: Cookies
): Promise<Response> {
	let res = await fetch(url, options).catch(() => null);

	if (!res) {
		throw new BffNetworkError();
	}

	// 401이면 refresh 시도 후 재시도
	if (res.status === 401) {
		const newToken = await refreshAccessToken(cookies);
		if (!newToken) {
			return res; // refresh 실패 → 원래 401 반환
		}

		// 새 토큰으로 헤더 교체 후 재시도
		const retryHeaders = new Headers(options.headers);
		retryHeaders.set('Authorization', `Bearer ${newToken}`);

		res = await fetch(url, { ...options, headers: retryHeaders }).catch(() => null);
		if (!res) {
			throw new BffNetworkError();
		}
	}

	return res;
}

export class BffNetworkError extends Error {
	constructor() {
		super('Cannot reach backend');
	}
}
