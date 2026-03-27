import { API_BASE } from './config';

export const ENDPOINTS = {
	/** GET /health */
	health: `${API_BASE}/health`,

	auth: {
		registerEmail: `${API_BASE}/v1/auth/register/email`,
		loginEmail: `${API_BASE}/v1/auth/login/email`,
		verifyEmail: `${API_BASE}/v1/auth/verify-email`,
		oauthLogin: `${API_BASE}/v1/auth/oauth/login`,
		refresh: `${API_BASE}/v1/auth/refresh`,
		logout: `${API_BASE}/v1/auth/logout`
	},

	/**
	 * 브라우저 → 동일 출처 프록시(/api/v1/tracked-items…) → 백엔드 (Bearer)
	 */
	trackedItems: {
		list: '/api/v1/tracked-items',
		create: '/api/v1/tracked-items',
		delete: (trackedItemId: string) => `/api/v1/tracked-items/${encodeURIComponent(trackedItemId)}`,
		selectSku: (trackedItemId: string) =>
			`/api/v1/tracked-items/${encodeURIComponent(trackedItemId)}/sku`
	},

	/** 브라우저 → BFF → GET /v1/products/… (Bearer) */
	products: {
		detail: (productId: string) => `/api/v1/products/${encodeURIComponent(productId)}`,
		skus: (productId: string) => `/api/v1/products/${encodeURIComponent(productId)}/skus`
	}
} as const;
