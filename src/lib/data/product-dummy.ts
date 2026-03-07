/**
 * 상품 상세 API 응답 더미 데이터 (AliExpress)
 */

export type ProductSku = {
	sku_name: string
	price: string
	original_price: string | null
	image: string | null
}

export type ProductDetailData = {
	title: string
	url: string
	source: string
	skus: ProductSku[]
	main_image: string
	images: string[]
}

export type ProductDetailResponse = {
	success: boolean
	data: ProductDetailData | null
	error: string | null
}

export const productDetailDummy: ProductDetailResponse = {
	success: true,
	data: {
		title:
			'씻어 빈티지 애니메이션 헌터 X 헌터 Illumi Zoldyck 그래픽 T 셔츠 남성 여성 만화 고품질 대형 T 셔츠 반팔',
		url: 'https://ko.aliexpress.com/item/1005008490468691.html?spm=a2g0o.productlist.main.44.191a3aa6Q4lIOq&algo_pvid=2f397693-2862-44e8-bfc4-fc18248a6e49&algo_exp_id=2f397693-2862-44e8-bfc4-fc18248a6e49-41&pdp_ext_f=%7B%22order%22%3A%2219%22%2C%22spu_best_type%22%3A%22price%22%2C%22eval%22%3A%221%22%2C%22fromPage%22%3A%22search%22%7D&pdp_npi=6%40dis!KRW!14418!8335!!!9.48!5.48!%400b1bf20817727992503764894eee39!12000045375202022!sea!KR!0!ABX!1!0!n_tag%3A-29910%3Bd%3A512da5d1%3Bm03_new_user%3A-29895%3BpisId%3A5000000201545898&curPageLogUid=0Ip3gPnIMlHA&utparam-url=scene%3Asearch%7Cquery_from%3A%7Cx_object_id%3A1005008490468691%7C_p_origin_prod%3A',
		source: 'aliexpress',
		skus: [
			{
				sku_name: 'FT-Black-R0835 / S',
				price: '₩8,335',
				original_price: '₩14,418',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/S82e03577706546d985a71732a2696177A.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-R0835 / M',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/S82e03577706546d985a71732a2696177A.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-R0835 / L',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/S82e03577706546d985a71732a2696177A.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-R0835 / XL',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/S82e03577706546d985a71732a2696177A.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-R0835 / XXL',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/S82e03577706546d985a71732a2696177A.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-R0101 / S',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/S6a1bdb24dd04498583eb58b2a2ff11b8U.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-R0101 / M',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/S6a1bdb24dd04498583eb58b2a2ff11b8U.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-R0101 / L',
				price: '₩9,840',
				original_price: '₩15,923',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/S6a1bdb24dd04498583eb58b2a2ff11b8U.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-R0101 / XL',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/S6a1bdb24dd04498583eb58b2a2ff11b8U.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-R0101 / XXL',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/S6a1bdb24dd04498583eb58b2a2ff11b8U.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-R0104 / S',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/Sec1676038d944b6e84a184f20abeadde2.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-R0104 / M',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/Sec1676038d944b6e84a184f20abeadde2.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-R0104 / L',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/Sec1676038d944b6e84a184f20abeadde2.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-R0104 / XL',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/Sec1676038d944b6e84a184f20abeadde2.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-R0104 / XXL',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/Sec1676038d944b6e84a184f20abeadde2.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-R0105 / S',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/Sbc664889d29f446fbd63fbdcd57f7aabN.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-R0105 / M',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/Sbc664889d29f446fbd63fbdcd57f7aabN.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-R0105 / L',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/Sbc664889d29f446fbd63fbdcd57f7aabN.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-R0105 / XL',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/Sbc664889d29f446fbd63fbdcd57f7aabN.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-R0105 / XXL',
				price: '₩ 9,886',
				original_price: '₩ 15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/Sbc664889d29f446fbd63fbdcd57f7aabN.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-R0106 / S',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/S666afc6534f7436fbef0d1d307c3ba4d0.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-R0106 / M',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/S666afc6534f7436fbef0d1d307c3ba4d0.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-R0106 / L',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/S666afc6534f7436fbef0d1d307c3ba4d0.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-R0106 / XL',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/S666afc6534f7436fbef0d1d307c3ba4d0.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-R0106 / XXL',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/S666afc6534f7436fbef0d1d307c3ba4d0.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-R0111 / S',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/S5e2d23ed1a44450b8e80c3617ce99a53m.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-R0111 / M',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/S5e2d23ed1a44450b8e80c3617ce99a53m.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-R0111 / L',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/S5e2d23ed1a44450b8e80c3617ce99a53m.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-R0111 / XL',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/S5e2d23ed1a44450b8e80c3617ce99a53m.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-R0111 / XXL',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/S5e2d23ed1a44450b8e80c3617ce99a53m.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-R0119 / S',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/S795de8d2a1bb433a90f2025b6dff5f1aN.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-R0119 / M',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/S795de8d2a1bb433a90f2025b6dff5f1aN.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-R0119 / L',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/S795de8d2a1bb433a90f2025b6dff5f1aN.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-R0119 / XL',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/S795de8d2a1bb433a90f2025b6dff5f1aN.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-R0119 / XXL',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/S795de8d2a1bb433a90f2025b6dff5f1aN.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-R0255 / S',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/S859938989b5a453087139d71dcb626aeW.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-R0255 / M',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/S859938989b5a453087139d71dcb626aeW.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-R0255 / L',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/S859938989b5a453087139d71dcb626aeW.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-R0255 / XL',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/S859938989b5a453087139d71dcb626aeW.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-R0255 / XXL',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/S859938989b5a453087139d71dcb626aeW.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-R0260 / S',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/S4175cf4f24eb499780e408692dd8add0Y.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-R0260 / M',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/S4175cf4f24eb499780e408692dd8add0Y.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-R0260 / L',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/S4175cf4f24eb499780e408692dd8add0Y.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-R0260 / XL',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/S4175cf4f24eb499780e408692dd8add0Y.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-R0260 / XXL',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/S4175cf4f24eb499780e408692dd8add0Y.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-R0268 / S',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/S137a11934f0b46f59afc85209762410fk.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-R0268 / M',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/S137a11934f0b46f59afc85209762410fk.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-R0268 / L',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/S137a11934f0b46f59afc85209762410fk.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-R0268 / XL',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/S137a11934f0b46f59afc85209762410fk.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-R0268 / XXL',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/S137a11934f0b46f59afc85209762410fk.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-R0281 / S',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/S7e82863672814df4a02bff29bb499695w.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-R0281 / M',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/S7e82863672814df4a02bff29bb499695w.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-R0281 / L',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/S7e82863672814df4a02bff29bb499695w.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-R0281 / XL',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/S7e82863672814df4a02bff29bb499695w.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-R0281 / XXL',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/S7e82863672814df4a02bff29bb499695w.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-R0267 / S',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/S1ea299428d8b411bae27c015ef94cd26b.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-R0267 / M',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/S1ea299428d8b411bae27c015ef94cd26b.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-R0267 / L',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/S1ea299428d8b411bae27c015ef94cd26b.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-R0267 / XL',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/S1ea299428d8b411bae27c015ef94cd26b.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-R0267 / XXL',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/S1ea299428d8b411bae27c015ef94cd26b.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-R0282 / S',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/S1e9f9dd52d3f4014888e46b4af6ca930m.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-R0282 / M',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/S1e9f9dd52d3f4014888e46b4af6ca930m.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-R0282 / L',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/S1e9f9dd52d3f4014888e46b4af6ca930m.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-R0282 / XL',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/S1e9f9dd52d3f4014888e46b4af6ca930m.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-R0282 / XXL',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/S1e9f9dd52d3f4014888e46b4af6ca930m.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-R0472 / S',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/Sbca04e50a163458a8373e95ea1ba408bE.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-R0472 / M',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/Sbca04e50a163458a8373e95ea1ba408bE.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-R0472 / L',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/Sbca04e50a163458a8373e95ea1ba408bE.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-R0472 / XL',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/Sbca04e50a163458a8373e95ea1ba408bE.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-R0472 / XXL',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/Sbca04e50a163458a8373e95ea1ba408bE.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-R0510 / S',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/S1da4a81ac30a4e129bb6471849580067Z.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-R0510 / M',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/S1da4a81ac30a4e129bb6471849580067Z.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-R0510 / L',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/S1da4a81ac30a4e129bb6471849580067Z.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-R0510 / XL',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/S1da4a81ac30a4e129bb6471849580067Z.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-R0510 / XXL',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/S1da4a81ac30a4e129bb6471849580067Z.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-R0514 / S',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/S13581b2384b54985930537a02ae9bcf3H.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-R0514 / M',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/S13581b2384b54985930537a02ae9bcf3H.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-R0514 / L',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/S13581b2384b54985930537a02ae9bcf3H.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-R0514 / XL',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/S13581b2384b54985930537a02ae9bcf3H.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-R0514 / XXL',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/S13581b2384b54985930537a02ae9bcf3H.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-R0527 / S',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/S36b6af5bdfd04a3bb1f09d83e72ddf43l.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-R0527 / M',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/S36b6af5bdfd04a3bb1f09d83e72ddf43l.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-R0527 / L',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/S36b6af5bdfd04a3bb1f09d83e72ddf43l.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-R0527 / XL',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/S36b6af5bdfd04a3bb1f09d83e72ddf43l.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-R0527 / XXL',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/S36b6af5bdfd04a3bb1f09d83e72ddf43l.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-Z03191 / S',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/S13c0ccd2a9dc4837884a2994efb738e2m.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-Z03191 / M',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/S13c0ccd2a9dc4837884a2994efb738e2m.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-Z03191 / L',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/S13c0ccd2a9dc4837884a2994efb738e2m.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-Z03191 / XL',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/S13c0ccd2a9dc4837884a2994efb738e2m.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-Z03191 / XXL',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/S13c0ccd2a9dc4837884a2994efb738e2m.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-Z03192 / S',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/S9e781056c5804e25b123a7209c6a47d0h.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-Z03192 / M',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/S9e781056c5804e25b123a7209c6a47d0h.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-Z03192 / L',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/S9e781056c5804e25b123a7209c6a47d0h.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-Z03192 / XL',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/S9e781056c5804e25b123a7209c6a47d0h.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-Z03192 / XXL',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/S9e781056c5804e25b123a7209c6a47d0h.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-Z03213 / S',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/S4fdd30ab58084bf9aaeec615cc2af569v.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-Z03213 / M',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/S4fdd30ab58084bf9aaeec615cc2af569v.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-Z03213 / L',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/S4fdd30ab58084bf9aaeec615cc2af569v.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-Z03213 / XL',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/S4fdd30ab58084bf9aaeec615cc2af569v.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-Z03213 / XXL',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/S4fdd30ab58084bf9aaeec615cc2af569v.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-Z157 / S',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/Secf0481af0e14261a0c0df4668a37039d.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-Z157 / M',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/Secf0481af0e14261a0c0df4668a37039d.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-Z157 / L',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/Secf0481af0e14261a0c0df4668a37039d.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-Z157 / XL',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/Secf0481af0e14261a0c0df4668a37039d.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-Z157 / XXL',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/Secf0481af0e14261a0c0df4668a37039d.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-Z03220 / S',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/Se0a644120f9941eeb5dbf364aab75e79f.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-Z03220 / M',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/Se0a644120f9941eeb5dbf364aab75e79f.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-Z03220 / L',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/Se0a644120f9941eeb5dbf364aab75e79f.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-Z03220 / XL',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/Se0a644120f9941eeb5dbf364aab75e79f.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-Z03220 / XXL',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/Se0a644120f9941eeb5dbf364aab75e79f.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-Z03348 / S',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/Sf5cb2c97e2914f8fa77b3d3f3f744f96n.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-Z03348 / M',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/Sf5cb2c97e2914f8fa77b3d3f3f744f96n.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-Z03348 / L',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/Sf5cb2c97e2914f8fa77b3d3f3f744f96n.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-Z03348 / XL',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/Sf5cb2c97e2914f8fa77b3d3f3f744f96n.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-Z03348 / XXL',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/Sf5cb2c97e2914f8fa77b3d3f3f744f96n.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-Q05065 / S',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/S81b5a26b72b94270a461d93c761cc7e77.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-Q05065 / M',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/S81b5a26b72b94270a461d93c761cc7e77.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-Q05065 / L',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/S81b5a26b72b94270a461d93c761cc7e77.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-Q05065 / XL',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/S81b5a26b72b94270a461d93c761cc7e77.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-Q05065 / XXL',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/S81b5a26b72b94270a461d93c761cc7e77.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-Q05160 / S',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/S0aadd15ece5f4d529e94061d1e0ab147B.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-Q05160 / M',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/S0aadd15ece5f4d529e94061d1e0ab147B.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-Q05160 / L',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/S0aadd15ece5f4d529e94061d1e0ab147B.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-Q05160 / XL',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/S0aadd15ece5f4d529e94061d1e0ab147B.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-Q05160 / XXL',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/S0aadd15ece5f4d529e94061d1e0ab147B.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-Q05530 / S',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/S420b4caec4854423ae492929c7814b16T.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-Q05530 / M',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/S420b4caec4854423ae492929c7814b16T.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-Q05530 / L',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/S420b4caec4854423ae492929c7814b16T.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-Q05530 / XL',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/S420b4caec4854423ae492929c7814b16T.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-Q05530 / XXL',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/S420b4caec4854423ae492929c7814b16T.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-Q06782 / S',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/S8dfc61386fe443dfb3486cfa7afbe117Z.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-Q06782 / M',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/S8dfc61386fe443dfb3486cfa7afbe117Z.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-Q06782 / L',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/S8dfc61386fe443dfb3486cfa7afbe117Z.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-Q06782 / XL',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/S8dfc61386fe443dfb3486cfa7afbe117Z.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-Q06782 / XXL',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/S8dfc61386fe443dfb3486cfa7afbe117Z.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-Q06783 / S',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/Sb31aead0020746c990214d66e96bb851r.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-Q06783 / M',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/Sb31aead0020746c990214d66e96bb851r.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-Q06783 / L',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/Sb31aead0020746c990214d66e96bb851r.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-Q06783 / XL',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/Sb31aead0020746c990214d66e96bb851r.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-Q06783 / XXL',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/Sb31aead0020746c990214d66e96bb851r.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-Q07032 / S',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/S18cfdfc7025a462498d1c15c83859626H.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-Q07032 / M',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/S18cfdfc7025a462498d1c15c83859626H.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-Q07032 / L',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/S18cfdfc7025a462498d1c15c83859626H.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-Q07032 / XL',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/S18cfdfc7025a462498d1c15c83859626H.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-Q07032 / XXL',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/S18cfdfc7025a462498d1c15c83859626H.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-R0830 / S',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/S056d799a10094a50afcc7725774f7742u.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-R0830 / M',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/S056d799a10094a50afcc7725774f7742u.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-R0830 / L',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/S056d799a10094a50afcc7725774f7742u.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-R0830 / XL',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/S056d799a10094a50afcc7725774f7742u.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-R0830 / XXL',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/S056d799a10094a50afcc7725774f7742u.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-R0840 / S',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/Sd01fbb5ebd264555a2802d2242dd1a0fC.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-R0840 / M',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/Sd01fbb5ebd264555a2802d2242dd1a0fC.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-R0840 / L',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/Sd01fbb5ebd264555a2802d2242dd1a0fC.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-R0840 / XL',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/Sd01fbb5ebd264555a2802d2242dd1a0fC.jpg_220x220q75.jpg_.avif'
			},
			{
				sku_name: 'FT-Black-R0840 / XXL',
				price: '₩9,886',
				original_price: '₩15,969',
				image: 'https://ae-pic-a1.aliexpress-media.com/kf/Sd01fbb5ebd264555a2802d2242dd1a0fC.jpg_220x220q75.jpg_.avif'
			}
		],
		main_image: 'https://ae01.alicdn.com/kf/S0aadd15ece5f4d529e94061d1e0ab147B.jpg',
		images: [
			'https://ae01.alicdn.com/kf/S0aadd15ece5f4d529e94061d1e0ab147B.jpg',
			'https://ae01.alicdn.com/kf/S420b4caec4854423ae492929c7814b16T.jpg',
			'https://ae01.alicdn.com/kf/S8dfc61386fe443dfb3486cfa7afbe117Z.jpg',
			'https://ae01.alicdn.com/kf/Sb31aead0020746c990214d66e96bb851r.jpg',
			'https://ae01.alicdn.com/kf/S18cfdfc7025a462498d1c15c83859626H.jpg',
			'https://ae01.alicdn.com/kf/S81b5a26b72b94270a461d93c761cc7e77.jpg'
		]
	},
	error: null
}

/** 에어팟 프로 3세대 상품 더미 (SKU 1개, image null 가능) */
export const productDetailDummyEarpods: ProductDetailResponse = {
	success: true,
	data: {
		title: 'Apple 2025 에어팟 프로 3세대 USB-C 블루투스 이어폰 MFHP4KH/A',
		url: 'https://ko.aliexpress.com/item/1005010399899559.html?spm=a2g0o.productlist.main.1.8b4e64b9JeRJHt&algo_pvid=58e3abc9-e726-41aa-b83c-480e6ec09119&algo_exp_id=58e3abc9-e726-41aa-b83c-480e6ec09119-0&pdp_ext_f=%7B%22order%22%3A%2279%22%2C%22eval%22%3A%221%22%2C%22fromPage%22%3A%22search%22%7D&pdp_npi=6%40dis%21KRW%21365000%21356635%21%21%21365000%21356635%21%402140c1c317728451503142519e8ac8%2112000052283976764%21sea%21KR%210%21ABX%211%210%21n_tag%3A-29910%3Bd%3Aa123715a%3Bm03_new_user%3A-29895%3BpisId%3A5000000201545901&curPageLogUid=MCyZT1tdrdOd&utparam-url=scene%3Asearch%7Cquery_from%3A%7Cx_object_id%3A1005010399899559%7C_p_origin_prod%3A',
		source: 'aliexpress',
		skus: [
			{
				sku_name: 'default',
				price: '₩356,635',
				original_price: '₩365,000',
				image: null
			}
		],
		main_image: 'https://ae01.alicdn.com/kf/Sbcf8302eff2a4d819828bddf3ef0addf5.jpg',
		images: ['https://ae01.alicdn.com/kf/Sbcf8302eff2a4d819828bddf3ef0addf5.jpg']
	},
	error: null
}

/** 주술회전 고죠 연필케이스 상품 더미 (SKU 41개, original_price null) */
export const productDetailDummyPencilCase: ProductDetailResponse = {
	success: true,
	data: {
		title:
			'Jujutsu gojo satoru 연필 케이스 만화 대용량 편지지 상자 다기능 보관 상자 얼룩 방지 펜 가방',
		url: 'https://ko.aliexpress.com/item/1005009532317806.html?spm=a2g0o.productlist.main.10.238e13c2hAWHgc&algo_pvid=fa2422d7-3114-432d-b0f4-ed51ef3088b8&algo_exp_id=fa2422d7-3114-432d-b0f4-ed51ef3088b8-9&pdp_ext_f=%7B%22order%22%3A%2225%22%2C%22eval%22%3A%221%22%2C%22fromPage%22%3A%22search%22%7D&pdp_npi=6%40dis%21KRW%2110300%2110300%21%21%2146.79%2146.79%21%40210123bc17728454837346725eb6bc%2112000049385235333%21sea%21KR%210%21ABX%211%210%21n_tag%3A-29910%3Bd%3Aa123715a%3Bm03_new_user%3A-29895&curPageLogUid=mdlvUbGssJ4E&utparam-url=scene%3Asearch%7Cquery_from%3A%7Cx_object_id%3A1005009532317806%7C_p_origin_prod%3A',
		source: 'aliexpress',
		skus: [
			{ sku_name: '39 / 41', price: '₩10,300', original_price: null, image: 'https://ae-pic-a1.aliexpress-media.com/kf/Sad9e003d579c470f9f731f10de83c9d2z.jpg_220x220q75.jpg_.avif' },
			{ sku_name: '1 / 41', price: '₩10,300', original_price: null, image: 'https://ae-pic-a1.aliexpress-media.com/kf/Sf359e438b4a34366a77f627cb4d30e53P.jpg_220x220q75.jpg_.avif' },
			{ sku_name: '8 / 41', price: '₩10,300', original_price: null, image: 'https://ae-pic-a1.aliexpress-media.com/kf/Sc078dbfb80a3467695bc0ea8b3725a75a.jpg_220x220q75.jpg_.avif' },
			{ sku_name: '15 / 41', price: '₩10,300', original_price: null, image: 'https://ae-pic-a1.aliexpress-media.com/kf/S0ae5d9c2fba742df9cbfc268301e22f0A.jpg_220x220q75.jpg_.avif' },
			{ sku_name: '22 / 41', price: '₩10,300', original_price: null, image: 'https://ae-pic-a1.aliexpress-media.com/kf/S0c7bce1443714b23856f5b06c706ff00q.jpg_220x220q75.jpg_.avif' },
			{ sku_name: '29 / 41', price: '₩10,300', original_price: null, image: 'https://ae-pic-a1.aliexpress-media.com/kf/Sfab7be43248f4a27a57576f2614e02e5q.jpg_220x220q75.jpg_.avif' },
			{ sku_name: '36 / 41', price: '₩10,300', original_price: null, image: 'https://ae-pic-a1.aliexpress-media.com/kf/Safd3eaf179ab49ec97a9057f53d6ad59S.jpg_220x220q75.jpg_.avif' },
			{ sku_name: '2 / 41', price: '₩10,300', original_price: null, image: 'https://ae-pic-a1.aliexpress-media.com/kf/Se638f1dc10604ffa871cb2a0ca4c232cA.jpg_220x220q75.jpg_.avif' },
			{ sku_name: '9 / 41', price: '₩10,300', original_price: null, image: 'https://ae-pic-a1.aliexpress-media.com/kf/S5e6c1c001c2a4955a4d676476d1fbd95o.jpg_220x220q75.jpg_.avif' },
			{ sku_name: '16 / 41', price: '₩10,300', original_price: null, image: 'https://ae-pic-a1.aliexpress-media.com/kf/Sa3ca5cf239204e69ade6d3d573423644m.jpg_220x220q75.jpg_.avif' },
			{ sku_name: '23 / 41', price: '₩10,300', original_price: null, image: 'https://ae-pic-a1.aliexpress-media.com/kf/Sbb5ee65ce6da4410bae189815d082c184.jpg_220x220q75.jpg_.avif' },
			{ sku_name: '30 / 41', price: '₩10,300', original_price: null, image: 'https://ae-pic-a1.aliexpress-media.com/kf/Sfba4ca4180304d47ac6965a6f643161cu.jpg_220x220q75.jpg_.avif' },
			{ sku_name: '37 / 41', price: '₩ 10,300', original_price: null, image: 'https://ae-pic-a1.aliexpress-media.com/kf/S6929e1e0989f49baaa73298b4e7ebdaeH.jpg_220x220q75.jpg_.avif' },
			{ sku_name: '3 / 41', price: '₩10,300', original_price: null, image: 'https://ae-pic-a1.aliexpress-media.com/kf/S780bfd3088e143b6bd6c3996bd644fd6q.jpg_220x220q75.jpg_.avif' },
			{ sku_name: '10 / 41', price: '₩10,300', original_price: null, image: 'https://ae-pic-a1.aliexpress-media.com/kf/S7fe12866e4d347cc84e654a1217e4734j.jpg_220x220q75.jpg_.avif' },
			{ sku_name: '17 / 41', price: '₩10,300', original_price: null, image: 'https://ae-pic-a1.aliexpress-media.com/kf/Sce68f1a179564073b53a6fa921c29964j.jpg_220x220q75.jpg_.avif' },
			{ sku_name: '24 / 41', price: '₩10,300', original_price: null, image: 'https://ae-pic-a1.aliexpress-media.com/kf/S3ce865be0bfe4bdb912d661e80a82903E.jpg_220x220q75.jpg_.avif' },
			{ sku_name: '31 / 41', price: '₩10,350', original_price: null, image: 'https://ae-pic-a1.aliexpress-media.com/kf/Sbf032c6904ab4d23aea8b3d430d5ce0fJ.jpg_220x220q75.jpg_.avif' },
			{ sku_name: '38 / 41', price: '₩10,350', original_price: null, image: 'https://ae-pic-a1.aliexpress-media.com/kf/S7d7c13d0504242dc8a3f640c264c78963.jpg_220x220q75.jpg_.avif' },
			{ sku_name: '4 / 41', price: '₩10,350', original_price: null, image: 'https://ae-pic-a1.aliexpress-media.com/kf/S29b7b71d641c485aa04d9d516b4ac8a5I.jpg_220x220q75.jpg_.avif' },
			{ sku_name: '11 / 41', price: '₩10,350', original_price: null, image: 'https://ae-pic-a1.aliexpress-media.com/kf/S186fc62bad62415e969e9db0d4feb229b.jpg_220x220q75.jpg_.avif' },
			{ sku_name: '18 / 41', price: '₩10,350', original_price: null, image: 'https://ae-pic-a1.aliexpress-media.com/kf/S42e98fb9d1b74a9087847e020f64e4afZ.jpg_220x220q75.jpg_.avif' },
			{ sku_name: '25 / 41', price: '₩10,350', original_price: null, image: 'https://ae-pic-a1.aliexpress-media.com/kf/Sff3029788c124fadb7db4bb0655ee886c.jpg_220x220q75.jpg_.avif' },
			{ sku_name: '32 / 41', price: '₩10,350', original_price: null, image: 'https://ae-pic-a1.aliexpress-media.com/kf/S595efe95ea594098a23c0c8c045d08b76.jpg_220x220q75.jpg_.avif' },
			{ sku_name: '5 / 41', price: '₩10,350', original_price: null, image: 'https://ae-pic-a1.aliexpress-media.com/kf/Se17b0e2e61e34df2b278f7476620e934O.jpg_220x220q75.jpg_.avif' },
			{ sku_name: '12 / 41', price: '₩10,350', original_price: null, image: 'https://ae-pic-a1.aliexpress-media.com/kf/S465220066e314dd4aaa8a19f849a66e77.jpg_220x220q75.jpg_.avif' },
			{ sku_name: '19 / 41', price: '₩10,350', original_price: null, image: 'https://ae-pic-a1.aliexpress-media.com/kf/S81f042bbd18b40349ada97d7e08530bfk.jpg_220x220q75.jpg_.avif' },
			{ sku_name: '26 / 41', price: '₩10,350', original_price: null, image: 'https://ae-pic-a1.aliexpress-media.com/kf/S34a6961a303d4f61b7fdc5597ac940b6q.jpg_220x220q75.jpg_.avif' },
			{ sku_name: '33 / 41', price: '₩10,350', original_price: null, image: 'https://ae-pic-a1.aliexpress-media.com/kf/Sa3f7f3e6ebba4e489a48f8e5758ae578a.jpg_220x220q75.jpg_.avif' },
			{ sku_name: '40 / 41', price: '₩10,350', original_price: null, image: 'https://ae-pic-a1.aliexpress-media.com/kf/S07799055f01940b2aee7ef41a23d02250.jpg_220x220q75.jpg_.avif' },
			{ sku_name: '6 / 41', price: '₩10,350', original_price: null, image: 'https://ae-pic-a1.aliexpress-media.com/kf/Sa8afcb7e91d44ec8b206ec0f60c81882P.jpg_220x220q75.jpg_.avif' },
			{ sku_name: '13 / 41', price: '₩10,350', original_price: null, image: 'https://ae-pic-a1.aliexpress-media.com/kf/S0ea6c5232ad14e8faadf58bec8242b81z.jpg_220x220q75.jpg_.avif' },
			{ sku_name: '20 / 41', price: '₩10,350', original_price: null, image: 'https://ae-pic-a1.aliexpress-media.com/kf/Sb5be65ae57d249d99f087e1a79124c1ep.jpg_220x220q75.jpg_.avif' },
			{ sku_name: '27 / 41', price: '₩10,350', original_price: null, image: 'https://ae-pic-a1.aliexpress-media.com/kf/S481c9c42d0c9423dab4d3dc4efd69be5V.jpg_220x220q75.jpg_.avif' },
			{ sku_name: '34 / 41', price: '₩10,350', original_price: null, image: 'https://ae-pic-a1.aliexpress-media.com/kf/S5f56b8fef9d342da81a3bc38f2861629q.jpg_220x220q75.jpg_.avif' },
			{ sku_name: '7 / 41', price: '₩10,350', original_price: null, image: 'https://ae-pic-a1.aliexpress-media.com/kf/Sf4b9477f6c7049fc807ca2809cc2387eQ.jpg_220x220q75.jpg_.avif' },
			{ sku_name: '14 / 41', price: '₩10,350', original_price: null, image: 'https://ae-pic-a1.aliexpress-media.com/kf/Sb8cb30bd98d34cadb27697c139ecf247U.jpg_220x220q75.jpg_.avif' },
			{ sku_name: '21 / 41', price: '₩10,350', original_price: null, image: 'https://ae-pic-a1.aliexpress-media.com/kf/S22b06822694a4561ba5166a94d9f0329x.jpg_220x220q75.jpg_.avif' },
			{ sku_name: '28 / 41', price: '₩10,350', original_price: null, image: 'https://ae-pic-a1.aliexpress-media.com/kf/S75db54445885476bac9cd2cc430b40547.jpg_220x220q75.jpg_.avif' },
			{ sku_name: '35 / 41', price: '₩10,350', original_price: null, image: 'https://ae-pic-a1.aliexpress-media.com/kf/S9df7c5468182484da073e639c76112f7p.jpg_220x220q75.jpg_.avif' }
		],
		main_image: 'https://ae01.alicdn.com/kf/Scd67be92c9ac42e7af6b3fef107edab7D.jpg',
		images: [
			'https://ae01.alicdn.com/kf/Scd67be92c9ac42e7af6b3fef107edab7D.jpg',
			'https://ae01.alicdn.com/kf/S81f042bbd18b40349ada97d7e08530bfk.jpg',
			'https://ae01.alicdn.com/kf/S7fe12866e4d347cc84e654a1217e4734j.jpg',
			'https://ae01.alicdn.com/kf/Sce68f1a179564073b53a6fa921c29964j.jpg',
			'https://ae01.alicdn.com/kf/Sf4b9477f6c7049fc807ca2809cc2387eQ.jpg',
			'https://ae01.alicdn.com/kf/S9df7c5468182484da073e639c76112f7p.jpg'
		]
	},
	error: null
}
