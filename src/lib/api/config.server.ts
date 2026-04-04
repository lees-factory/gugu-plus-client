import { env } from '$env/dynamic/private';

/** 백엔드 API base URL — 서버 전용. 클라이언트 번들에 포함되지 않음. */
export const API_BASE = env.API_BASE_URL ?? 'http://localhost:8080';

export const COOKIE_OPTS = {
	path: '/',
	maxAge: 60 * 60 * 24 * 7,
	httpOnly: true,
	sameSite: 'lax' as const,
	secure: !env.API_BASE_URL?.startsWith('http://localhost')
};
