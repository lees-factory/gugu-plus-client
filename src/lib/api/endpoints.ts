import { API_BASE } from './config';

export const ENDPOINTS = {
	auth: {
		login: `${API_BASE}/v1/auth/login/email`,
		oauthLogin: `${API_BASE}/v1/auth/oauth/login`,
		refresh: `${API_BASE}/v1/auth/refresh`,
		logout: `${API_BASE}/v1/auth/logout`,
		register: `${API_BASE}/v1/auth/register/email`,
		verify: `${API_BASE}/v1/auth/verify-email`
	},
	items: {
		list: `${API_BASE}/v1/items`,
		create: `${API_BASE}/v1/items`,
		detail: (id: string) => `${API_BASE}/v1/items/${id}`,
		delete: (id: string) => `${API_BASE}/v1/items/${id}`
	},
	user: {
		me: `${API_BASE}/v1/user/me`,
		password: `${API_BASE}/v1/user/password`,
		delete: `${API_BASE}/v1/user`
	}
} as const;
