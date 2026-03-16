import { apiCall } from './client';
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
		apiCall<LoginResponse>(ENDPOINTS.auth.login, {
			method: 'POST',
			body: JSON.stringify({ email, password })
		}),

	oauthLogin: (payload: {
		provider: OAuthProvider;
		subject: string;
		email: string;
		display_name?: string;
	}) =>
		apiCall<OAuthLoginResponse>(ENDPOINTS.auth.oauthLogin, {
			method: 'POST',
			body: JSON.stringify(payload)
		}),

	register: (email: string, password: string, display_name: string) =>
		apiCall<RegisterResponse>(ENDPOINTS.auth.register, {
			method: 'POST',
			body: JSON.stringify({ email, password, display_name })
		}),

	verify: (code: string) =>
		apiCall<VerifyResponse>(ENDPOINTS.auth.verify, {
			method: 'POST',
			body: JSON.stringify({ code })
		}),

	resendVerification: (email: string) =>
		apiCall(ENDPOINTS.auth.register, {
			method: 'POST',
			body: JSON.stringify({ email, password: '', display_name: email.split('@')[0] })
		}),

	refresh: (refresh_token: string, device_name?: string) =>
		apiCall<{ result: string; data: AuthTokens }>(ENDPOINTS.auth.refresh, {
			method: 'POST',
			body: JSON.stringify({ refresh_token, device_name })
		}),

	logout: (refresh_token: string) =>
		apiCall<{ result: string }>(ENDPOINTS.auth.logout, {
			method: 'POST',
			body: JSON.stringify({ refresh_token })
		})
};
