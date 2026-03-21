import type { PageLoad } from './$types';
import type { ProductDetailData, ProductSku } from '$lib/api/products';

export const load: PageLoad = async ({ fetch, params }) => {
	const id = params.id;
	if (!id) {
		return {
			product: null as ProductDetailData | null,
			skus: null as ProductSku[] | null,
			error: '상품 ID가 없습니다.'
		};
	}

	const base = `/api/v1/products/${encodeURIComponent(id)}`;
	const [res, resSkus] = await Promise.all([fetch(base), fetch(`${base}/skus`)]);

	const json = (await res.json().catch(() => ({}))) as Record<string, unknown>;

	if (!res.ok) {
		const err = json?.error as { message?: string } | string | undefined;
		const msg =
			typeof err === 'object' && err?.message != null
				? String(err.message)
				: typeof err === 'string'
					? err
					: '상품을 불러오지 못했습니다.';
		return { product: null, skus: null, error: msg };
	}

	const payload = json?.data;
	if (!payload || typeof payload !== 'object') {
		return { product: null, skus: null, error: '응답 형식이 올바르지 않습니다.' };
	}

	let skus: ProductSku[] | null = null;
	if (resSkus.ok) {
		const skusJson = (await resSkus.json().catch(() => ({}))) as Record<string, unknown>;
		const arr = skusJson?.data;
		if (Array.isArray(arr)) {
			skus = arr as ProductSku[];
		}
	}

	return {
		product: payload as ProductDetailData,
		skus,
		error: null as string | null
	};
};
