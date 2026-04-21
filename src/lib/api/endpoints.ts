/**
 * 클라이언트 전용 엔드포인트 — 모두 동일 출처 BFF 프록시 경로.
 * 백엔드 URL이 포함되지 않으므로 클라이언트 번들에 안전하게 포함됨.
 */
export const ENDPOINTS = {
	/** 브라우저 → 동일 출처 BFF 프록시 → 백엔드 인증 API */
	authBff: {
		registerEmail: '/api/v1/auth/register/email',
		loginEmail: '/api/v1/auth/login/email',
		verifyEmail: '/api/v1/auth/verify-email',
		oauthLogin: '/api/v1/auth/oauth/login',
		refresh: '/api/v1/auth/refresh',
		logout: '/api/v1/auth/logout',
		sessions: '/api/v1/auth/sessions',
		revokeSession: (sessionId: string) => `/api/v1/auth/sessions/${encodeURIComponent(sessionId)}`
	},

	/**
	 * 브라우저 → 동일 출처 프록시(/api/v1/tracked-items…) → 백엔드 (Bearer)
	 */
	trackedItems: {
		list: '/api/v1/tracked-items',
		create: '/api/v1/tracked-items',
		detail: (trackedItemId: string) => `/api/v1/tracked-items/${encodeURIComponent(trackedItemId)}`,
		delete: (trackedItemId: string) => `/api/v1/tracked-items/${encodeURIComponent(trackedItemId)}`,
		selectSku: (trackedItemId: string) =>
			`/api/v1/tracked-items/${encodeURIComponent(trackedItemId)}/sku`,
		skuPriceHistories: (trackedItemId: string) =>
			`/api/v1/tracked-items/${encodeURIComponent(trackedItemId)}/sku-price-histories`,
		skuPriceTrend: (trackedItemId: string) =>
			`/api/v1/tracked-items/${encodeURIComponent(trackedItemId)}/sku-price-trend`
	},

	/** 브라우저 → BFF → /v1/skus/… (Bearer) */
	skus: {
		priceAlert: (skuId: string) => `/api/v1/skus/${encodeURIComponent(skuId)}/price-alert`
	},

	/** 브라우저 → BFF → GET /v1/discover/… */
	discover: {
		hotProducts: '/api/v1/discover/hot-products'
	},

	/** 브라우저 → BFF → GET /v1/products/… (Bearer) */
	products: {
		detail: (productId: string) => `/api/v1/products/${encodeURIComponent(productId)}`,
		skus: (productId: string) => `/api/v1/products/${encodeURIComponent(productId)}/skus`
	}
} as const;
