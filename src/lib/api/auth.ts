import { apiDelete, apiGet, apiPost } from './client';
import { ENDPOINTS } from './endpoints';
export type { ApiResult } from './client';

export type AuthUser = {
	id: string;
	email: string;
	display_name: string;
	email_verified: boolean;
	created_at: string;
};

export type AuthTokens = {
	access_token: string;
	refresh_token: string;
	token_type: string;
	access_expires_at: string;
	refresh_expires_at: string;
};

export type LoginResponse = {
	result: string;
	data: {
		user: AuthUser;
		tokens: AuthTokens;
	};
};

export type OAuthLoginResponse = {
	result: string;
	data: {
		user: AuthUser;
		tokens: AuthTokens;
	};
};

export type RegisterResponse = {
	result: string;
	data: {
		user: AuthUser;
		verification_dispatched: boolean;
		verification_code?: string;
	};
};

export type VerifyResponse = {
	result: string;
	data: { user: AuthUser };
};

export type OAuthProvider = 'google' | 'kakao' | 'naver' | 'apple';

/** GET /v1/auth/sessions 응답의 개별 세션 */
export type LoginSession = {
	id: string;
	user_agent: string;
	client_ip: string;
	device_name: string;
	expires_at: string;
	last_seen_at: string;
	created_at: string;
};

export type LoginSessionsResponse = {
	result: string;
	data: LoginSession[];
};

export type RevokeSessionResponse = {
	result: string;
};

/**
 * 브라우저(클라이언트) 전용 — 동일 출처 BFF 프록시 경유.
 * BFF 라우트가 쿠키 설정까지 처리하므로, 응답만 받으면 된다.
 */
export const authBffApi = {
	login: (email: string, password: string) =>
		apiPost<LoginResponse>(ENDPOINTS.authBff.loginEmail, { email, password }),

	oauthLogin: (payload: {
		provider: OAuthProvider;
		subject: string;
		email: string;
		display_name: string;
	}) => apiPost<OAuthLoginResponse>(ENDPOINTS.authBff.oauthLogin, payload),

	register: (email: string, password: string, display_name: string) =>
		apiPost<RegisterResponse>(ENDPOINTS.authBff.registerEmail, { email, password, display_name }),

	verify: (code: string) => apiPost<VerifyResponse>(ENDPOINTS.authBff.verifyEmail, { code }),

	refresh: (refresh_token: string, device_name?: string) =>
		apiPost<{ result: string; data: AuthTokens }>(ENDPOINTS.authBff.refresh, {
			refresh_token,
			device_name
		}),

	logout: (refresh_token: string) =>
		apiPost<{ result: string }>(ENDPOINTS.authBff.logout, { refresh_token }),

	/** 내 활성 세션 목록 조회 */
	listSessions: () => apiGet<LoginSessionsResponse>(ENDPOINTS.authBff.sessions),

	/** 특정 세션 종료(revoke) */
	revokeSession: (sessionId: string) =>
		apiDelete<RevokeSessionResponse>(ENDPOINTS.authBff.revokeSession(sessionId))
};
