export const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:8080';

export const COOKIE_OPTS = {
	path: '/',
	maxAge: 60 * 60 * 24 * 7,
	httpOnly: true,
	sameSite: 'lax'
} as const;
