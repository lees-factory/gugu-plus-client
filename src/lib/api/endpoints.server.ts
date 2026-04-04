import { API_BASE } from './config.server';

/**
 * 서버 전용 엔드포인트: form actions, hooks 등에서 백엔드를 직접 호출할 때 사용.
 * 클라이언트 번들에 포함되지 않음.
 */
export const SERVER_ENDPOINTS = {
	health: `${API_BASE}/health`,

	auth: {
		registerEmail: `${API_BASE}/v1/auth/register/email`,
		loginEmail: `${API_BASE}/v1/auth/login/email`,
		verifyEmail: `${API_BASE}/v1/auth/verify-email`,
		oauthLogin: `${API_BASE}/v1/auth/oauth/login`,
		refresh: `${API_BASE}/v1/auth/refresh`,
		logout: `${API_BASE}/v1/auth/logout`
	}
} as const;
