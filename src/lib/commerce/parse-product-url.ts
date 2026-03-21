import type { ProductMarket } from '$lib/api/market';

export type ParsedCommerceUrl =
	| {
			ok: true;
			original_url: string;
			provider_commerce: ProductMarket;
			external_product_id: string;
			displayName: string;
	  }
	| {
			ok: false;
			displayName: string | null;
			message: string;
	  };

function normalizeUrl(input: string): URL | null {
	try {
		const t = input.trim();
		if (!t) return null;
		const withProto = /^https?:\/\//i.test(t) ? t : `https://${t}`;
		return new URL(withProto);
	} catch {
		return null;
	}
}

/**
 * 쇼핑몰 상품 URL에서 API용 `original_url`, `provider_commerce`, `external_product_id`를 추출한다.
 * 현재 API 연동 가능한 것은 AliExpress `/item/{숫자}.html` 패턴뿐이다.
 */
export function parseCommerceProductUrl(raw: string): ParsedCommerceUrl {
	const u = normalizeUrl(raw);
	if (!u) {
		return { ok: false, displayName: null, message: '올바른 URL을 입력해 주세요.' };
	}

	const host = u.hostname.toLowerCase();

	const isAliExpressHost =
		host === 'aliexpress.com' ||
		host.endsWith('.aliexpress.com') ||
		host.endsWith('aliexpress.us');

	if (isAliExpressHost) {
		const m = u.pathname.match(/\/item\/(\d+)\.html/i);
		if (m?.[1]) {
			return {
				ok: true,
				original_url: u.href,
				provider_commerce: 'ALIEXPRESS',
				external_product_id: m[1],
				displayName: 'AliExpress'
			};
		}
		return {
			ok: false,
			displayName: 'AliExpress',
			message: '상품 ID를 찾을 수 없습니다. /item/숫자.html 형식인지 확인해 주세요.'
		};
	}

	if (host.includes('amazon.')) {
		const asin =
			u.pathname.match(/\/(?:dp|gp\/product)\/([A-Z0-9]{10})/i)?.[1] ??
			u.pathname.match(/\/d\/([A-Z0-9]{10})/i)?.[1];
		if (asin) {
			return {
				ok: false,
				displayName: 'Amazon',
				message: 'Amazon 상품은 아직 추가할 수 없습니다.'
			};
		}
		return {
			ok: false,
			displayName: 'Amazon',
			message: 'Amazon 상품 URL에서 ASIN을 찾지 못했습니다.'
		};
	}

	if (host.includes('ebay.')) {
		const id = u.pathname.match(/\/itm\/(\d+)/)?.[1];
		if (id) {
			return {
				ok: false,
				displayName: 'eBay',
				message: 'eBay 상품은 아직 추가할 수 없습니다.'
			};
		}
		return {
			ok: false,
			displayName: 'eBay',
			message: 'eBay 상품 ID를 찾지 못했습니다.'
		};
	}

	if (host.includes('taobao.com') || host.includes('tmall.com')) {
		return {
			ok: false,
			displayName: host.includes('tmall') ? 'Tmall' : 'Taobao',
			message: '타오바오·티몰 상품은 아직 추가할 수 없습니다.'
		};
	}

	return {
		ok: false,
		displayName: null,
		message: '지원하는 쇼핑몰 URL이 아닙니다.'
	};
}
