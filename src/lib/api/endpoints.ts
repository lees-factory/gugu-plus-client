import { API_BASE } from './config';

export const ENDPOINTS = {
	/** GET /health */
	health: `${API_BASE}/health`,

	/**
	 * 서버 전용: form actions, hooks 등에서 백엔드를 직접 호출할 때 사용.
	 * 브라우저에서 호출하면 CORS 문제가 발생하므로 클라이언트 JS에서는 authBff를 사용한다.
	 */
	auth: {
		registerEmail: `${API_BASE}/v1/auth/register/email`,
		loginEmail: `${API_BASE}/v1/auth/login/email`,
		verifyEmail: `${API_BASE}/v1/auth/verify-email`,
		oauthLogin: `${API_BASE}/v1/auth/oauth/login`,
		refresh: `${API_BASE}/v1/auth/refresh`,
		logout: `${API_BASE}/v1/auth/logout`
	},

	/** 브라우저 → 동일 출처 BFF 프록시 → 백엔드 인증 API */
	authBff: {
		registerEmail: '/api/v1/auth/register/email',
		loginEmail: '/api/v1/auth/login/email',
		verifyEmail: '/api/v1/auth/verify-email',
		oauthLogin: '/api/v1/auth/oauth/login',
		refresh: '/api/v1/auth/refresh',
		logout: '/api/v1/auth/logout'
	},

	/**
	 * 브라우저 → 동일 출처 프록시(/api/v1/tracked-items…) → 백엔드 (Bearer)
	 */
	trackedItems: {
		list: '/api/v1/tracked-items',
		create: '/api/v1/tracked-items',
		detail: (trackedItemId: string) =>
			`/api/v1/tracked-items/${encodeURIComponent(trackedItemId)}`,
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
