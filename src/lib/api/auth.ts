import { apiPost } from './client';
import { ENDPOINTS } from './endpoints';

export interface AuthUser {
	id: string;
	email: string;
	display_name: string;
	email_verified: boolean;
	created_at: string;
}

export interface AuthTokens {
	access_token: string;
	refresh_token: string;
	token_type: string;
	access_expires_at: string;
	refresh_expires_at: string;
}

export interface LoginResponse {
	result: string;
	data: {
		user: AuthUser;
		tokens: AuthTokens;
	};
}

export interface OAuthLoginResponse {
	result: string;
	data: {
		user: AuthUser;
		tokens: AuthTokens;
	};
}

export interface RegisterResponse {
	result: string;
	data: { user: { email: string } };
}

export interface VerifyResponse {
	result: string;
	data: { user: { email: string } };
}

export type OAuthProvider = 'google' | 'kakao' | 'naver' | 'apple';

export const authApi = {
	login: (email: string, password: string) =>
		apiPost<LoginResponse>(ENDPOINTS.auth.loginEmail, { email, password }),

	oauthLogin: (payload: {
		provider: OAuthProvider;
		subject: string;
		email: string;
		display_name?: string;
	}) => apiPost<OAuthLoginResponse>(ENDPOINTS.auth.oauthLogin, payload),

	register: (email: string, password: string, display_name: string) =>
		apiPost<RegisterResponse>(ENDPOINTS.auth.registerEmail, { email, password, display_name }),

	verify: (code: string) => apiPost<VerifyResponse>(ENDPOINTS.auth.verifyEmail, { code }),

	resendVerification: (email: string) =>
		apiPost(ENDPOINTS.auth.registerEmail, {
			email,
			password: '',
			display_name: email.split('@')[0]
		}),

	refresh: (refresh_token: string, device_name?: string) =>
		apiPost<{ result: string; data: AuthTokens }>(ENDPOINTS.auth.refresh, {
			refresh_token,
			device_name
		}),

	logout: (refresh_token: string) =>
		apiPost<{ result: string }>(ENDPOINTS.auth.logout, { refresh_token })
};
