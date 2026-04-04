import { apiPost } from './client';
import { SERVER_ENDPOINTS } from './endpoints.server';
import type { LoginResponse, OAuthLoginResponse, RegisterResponse, VerifyResponse, AuthTokens, OAuthProvider } from './auth';

/**
 * 서버 전용 — form actions, hooks 등에서 백엔드를 직접 호출.
 * 클라이언트에서 import 불가 (.server.ts).
 */
export const authApi = {
	login: (email: string, password: string) =>
		apiPost<LoginResponse>(SERVER_ENDPOINTS.auth.loginEmail, { email, password }),

	oauthLogin: (payload: {
		provider: OAuthProvider;
		subject: string;
		email: string;
		display_name: string;
	}) => apiPost<OAuthLoginResponse>(SERVER_ENDPOINTS.auth.oauthLogin, payload),

	register: (email: string, password: string, display_name: string) =>
		apiPost<RegisterResponse>(SERVER_ENDPOINTS.auth.registerEmail, { email, password, display_name }),

	verify: (code: string) => apiPost<VerifyResponse>(SERVER_ENDPOINTS.auth.verifyEmail, { code }),

	resendVerification: (email: string) =>
		apiPost(SERVER_ENDPOINTS.auth.registerEmail, {
			email,
			password: '',
			display_name: email.split('@')[0]
		}),

	refresh: (refresh_token: string, device_name?: string) =>
		apiPost<{ result: string; data: AuthTokens }>(SERVER_ENDPOINTS.auth.refresh, {
			refresh_token,
			device_name
		}),

	logout: (refresh_token: string) =>
		apiPost<{ result: string }>(SERVER_ENDPOINTS.auth.logout, { refresh_token })
};
